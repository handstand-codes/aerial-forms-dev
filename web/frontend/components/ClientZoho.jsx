import { useState, useEffect, useCallback } from 'react';
import { api } from "../api";
import { useMaybeFindFirst } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { zohoLogo } from "../assets";

import { 
    LegacyCard,
    Button,
    LegacyStack,
    ButtonGroup,
    Text,
    TextField,
    Spinner,
    FormLayout,
    Form
  } from "@shopify/polaris";

export function ClientZoho() {    

    // get the current store data
    const [storeData, setStoreData] = useState('');
    const [zohoListKey, setZohoListKey] = useState('');

    useEffect(() => {
        setZohoListKey(data?.listKey);
        const customHttpRouteRequest = async () => {
            const result = await api.connection.fetch("https://aerialforms--development.gadget.app/custom")
            const json = await result.json()
            setStoreData(json.currentShopId.toString())
        }
        customHttpRouteRequest().catch(console.error);
    }, [])

    // get the model data using the current store data
    const [{ data, fetching }] = useMaybeFindFirst(api.clientZoho, {    
        filter: { currentStoreId: { equals: storeData } },  
    });

    const [updateStatusResponse, updateStatus] = useAction(api.clientZoho.update)

    const enableZohoIntegration = async () => {

        const status = {
            filter: { currentStoreId: { equals: storeData } 
            },
            "id": data?.id,
            "clientZoho": {
                "enabled": true
            }
        }

        await updateStatus(status)
    }

    const disableZohoIntegration = async () => {
        
        const status = {
            filter: { currentStoreId: { equals: storeData } 
            },
            "id": data?.id,
            "clientZoho": {
                "enabled": false
            }
        }

        await updateStatus(status)

    }

    // Update API Key //

    const handleZohoListKeyChange = useCallback((
        newListKey
        ) => setZohoListKey(newListKey), []);

    const saveZohoInfo = async () => {
        
        const status = {
            filter: { currentStoreId: { equals: storeData } 
            },
            "id": data?.id,
            "clientZoho": {
                "listKey": zohoListKey
            }
        }

        await updateStatus(status)

    }

    const Buttons = () => {

        if (fetching) {
            return <Spinner accessibilityLabel="Small spinner example" size="small" />
        }

        if (data?.enabled) {
            return <Button destructive onClick={disableZohoIntegration}>Disable</Button>
        } else {
            return <Button primary onClick={enableZohoIntegration}>Enable</Button>
        }

    }

    const dataInputs = (
        data?.enabled ? (
            <LegacyCard.Section>
                <FormLayout>           
                    <FormLayout.Group>
                        <Text color="success" variant="heading2xl" as="h1">Zoho Enabled</Text>
                              
                        <Form 
                            onSubmit={() => saveZohoInfo()}>
                            <FormLayout>
                                <TextField
                                    value={zohoListKey}
                                    label="List Key"
                                    placeholder={data?.listKey}
                                    onChange={handleZohoListKeyChange}
                                    autoComplete='off'
                                />
                                <Button monochrome size="slim" submit>Update</Button>
                            </FormLayout>
                        </Form>
                        
                    </FormLayout.Group>                
                </FormLayout>
            </LegacyCard.Section>
        ) : (
            <></>
        )
    )
    
    return (
        <LegacyCard>
            <LegacyCard.Section>
                <LegacyStack alignment="center">
                    <img src={zohoLogo} alt='Shopify logo' style={{ width: '25px' }} />
                    <Text variant='headingMd' as='h2'>Zoho</Text>
                </LegacyStack>
            </LegacyCard.Section>
            <LegacyCard.Section>
                <LegacyStack spacing="loose" vertical>
                    <p>
                        New email submissions create new customers in Zoho.
                    </p>
                    <LegacyStack>
                        <ButtonGroup>
                            <Buttons></Buttons>
                        </ButtonGroup>
                    </LegacyStack>
                </LegacyStack>
            </LegacyCard.Section>
            {dataInputs}
        </LegacyCard>
        

  )}


