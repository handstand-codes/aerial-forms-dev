import { useState, useEffect, useCallback } from 'react';
import { api } from "../api";
import { useMaybeFindFirst } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { dripLogo } from "../assets";

import { 
    LegacyCard,
    Button,
    LegacyStack,
    ButtonGroup,
    Text,
    TextField,
    Spinner,
    FormLayout,
    Form,
    Inline
  } from "@shopify/polaris";

import {
    CircleInformationMajor
} from '@shopify/polaris-icons';

export function ClientDrip() {    

    // get the current store data
    const [storeData, setStoreData] = useState('');
    const [dripToken, setDripToken] = useState('');
    const [dripAccountId, setDripAccountId] = useState('');

    useEffect(() => {
        setDripToken(data?.token);
        setDripAccountId(data?.accountId);
        const customHttpRouteRequest = async () => {
            const result = await api.connection.fetch("https://aerialforms.gadget.app/custom")
            const json = await result.json()
            setStoreData(json.currentShopId.toString())
        }

        customHttpRouteRequest().catch(console.error);
    }, [])

    // get the model data using the current store data
    const [{ data, fetching }] = useMaybeFindFirst(api.clientDrip, {    
        filter: { currentStoreId: { equals: storeData } },  
    });

    
    const [updateStatusResponse, updateStatus] = useAction(api.clientDrip.update)

    const enableDripIntegration = async () => {

        const status = {
            filter: { currentStoreId: { equals: storeData } 
            },
            "id": data?.id,
            "clientDrip": {
                "enabled": true
            }
        }

        await updateStatus(status)
    }

    const disableDripIntegration = async () => {
        
        const status = {
            filter: { currentStoreId: { equals: storeData } 
            },
            "id": data?.id,
            "clientDrip": {
                "enabled": false
            }
        }

        await updateStatus(status)

    }

        // Update API Key //

    const handleDripTokenChange = useCallback((
        newToken
        ) => setDripToken(newToken), []);

    const handleDripAccountIdChange = useCallback((
        newAccountId
        ) => setDripAccountId(newAccountId), []);
    
    const saveDripInfo = async () => {
            
        const status = {
            filter: { currentStoreId: { equals: storeData } 
            },
            "id": data?.id,
            "clientDrip": {
                "token": dripToken,
                "accountId": dripAccountId
            }
        }
        console.log(status)
        await updateStatus(status)

    }

    const Buttons = () => {

        if (fetching) {
            return <Spinner accessibilityLabel="Small spinner example" size="small" />
        }

        if (data?.enabled) {
            return <Button destructive onClick={disableDripIntegration}>Disable</Button>
        } else {
            return <Button primary onClick={enableDripIntegration}>Enable</Button>
        }

    }

    const dataInputs = (
        data?.enabled ? (
            <LegacyCard.Section>
                <FormLayout> 
                    <FormLayout.Group>
                        <Text color="success" variant="heading2xl" as="h1">Drip Enabled</Text>
                                                                                        
                        <Form 
                            onSubmit={() => saveDripInfo()}>
                            <FormLayout>
                            <TextField
                                    value={dripToken}
                                    label="Token"
                                    placeholder={data?.token}
                                    onChange={handleDripTokenChange}
                                    autoComplete='off'
                                />
                                <TextField
                                    value={dripAccountId}
                                    label="Account ID"
                                    placeholder={data?.accountId}
                                    onChange={handleDripAccountIdChange}
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
                <Inline align="space-between" blockAlign="center" gap="4">
                    <LegacyStack alignment="center">
                        <img src={dripLogo} alt='Shopify logo' style={{ width: '25px' }} />
                        <Text variant='headingMd' as='h2'>Drip</Text>
                        
                    </LegacyStack>
                    <Button
                            alignment="right"
                            plain
                            icon={CircleInformationMajor}
                            accessibilityLabel="Learn more"
                            url="https://handstand.helpscoutdocs.com/article/8-how-to-find-api-keys-for-drip-integrations"
                            target="_blank" 
                        />
                </Inline>
            </LegacyCard.Section>
            <LegacyCard.Section>
                <LegacyStack spacing="loose" vertical>
                    <p>
                        New email submissions create new customers in Drip. 
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

