import { useState, useEffect, useCallback } from 'react';
import { api } from "../api";
import { useMaybeFindFirst } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { klaviyoLogo } from "../assets";

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

import {
    CircleInformationMajor
} from '@shopify/polaris-icons';

export function ClientKlaviyo() {    

    // get the current store data
    const [storeData, setStoreData] = useState('');
    const [listId, setListId] = useState('');
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        setListId(data?.listId);
        setApiKey(data?.apiKey)
        const customHttpRouteRequest = async () => {
            const result = await api.connection.fetch("https://aerialforms--development.gadget.app/custom")
            const json = await result.json()
            setStoreData(json.currentShopId.toString())
        }

        customHttpRouteRequest().catch(console.error);
    }, [])

    // get the model data using the current store data
    const [{ data, fetching }] = useMaybeFindFirst(api.clientKlaviyo, {    
        filter: { currentStoreId: { equals: storeData } },  
    });

    
    const [updateStatusResponse, updateStatus] = useAction(api.clientKlaviyo.update)

    const enableKlaviyoIntegration = async () => {

        const status = {
            filter: { currentStoreId: { equals: storeData } 
            },
            "id": data?.id,
            "clientKlaviyo": {
                "enabled": true
            }
        }

        await updateStatus(status)
    }

    const disableKlaviyoIntegration = async () => {
        
        const status = {
            filter: { currentStoreId: { equals: storeData } 
            },
            "id": data?.id,
            "clientKlaviyo": {
                "enabled": false
            }
        }

        await updateStatus(status)

    }

    // Update API Key / Server # //

    const handleListIdChange = useCallback((
        newListId
        ) => setListId(newListId), []);

    const handleApiKeyChange = useCallback((
        newApiKey
        ) => setApiKey(newApiKey), []);

    const saveKlaviyoInfo = async () => {
        
        const status = {
            filter: { currentStoreId: { equals: storeData } 
            },
            "id": data?.id,
            "clientKlaviyo": {
                "apiKey": apiKey,
                "listId": listId
            }
        }

        await updateStatus(status)

    }

    const Buttons = () => {

        if (fetching) {
            return <Spinner accessibilityLabel="Small spinner example" size="small" />
        }

        if (data?.enabled) {
            return <Button destructive onClick={disableKlaviyoIntegration}>Disable</Button>
        } else {
            return <Button primary onClick={enableKlaviyoIntegration}>Enable</Button>
        }

    }

    const dataInputs = (
        data?.enabled ? (
            <LegacyCard.Section>
                <FormLayout> 
                    <FormLayout.Group>
                        <Text color="success" variant="heading2xl" as="h1">Klaviyo Enabled</Text>
                                                                
                        <Form 
                            onSubmit={() => saveKlaviyoInfo()}>
                            <FormLayout>
                            <TextField
                                    value={apiKey}
                                    label="API Key"
                                    placeholder={data?.apiKey}
                                    onChange={handleApiKeyChange}
                                    autoComplete='off'
                                />
                                <TextField
                                    value={listId}
                                    label="List ID"
                                    placeholder={data?.listId}
                                    onChange={handleListIdChange}
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
                    <img src={klaviyoLogo} alt='Shopify logo' style={{ width: '25px' }} />
                    <Text variant='headingMd' as='h2'>Klaviyo</Text>
                    
                </LegacyStack>
            </LegacyCard.Section>
            <LegacyCard.Section>
                <LegacyStack spacing="loose" vertical>
                    <p>
                        New email submissions create new customers in Klaviyo.
                        <Button
                            alignment="right"
                            plain
                            icon={CircleInformationMajor}
                            accessibilityLabel="Learn more"
                            url="https://handstand.helpscoutdocs.com/article/4-how-to-find-api-keys-for-email-integrations"
                        />
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


