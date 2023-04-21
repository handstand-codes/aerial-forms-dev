import { useState, useEffect, useCallback } from 'react';
import { api } from "../api";
import { useMaybeFindFirst } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { hubspotLogo } from "../assets";

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

export function ClientHubspot() {    

    // get the current store data
    const [storeData, setStoreData] = useState('');
    const [hubspotAccessToken, setHubspotAccessToken] = useState('');

    useEffect(() => {
        setHubspotAccessToken(data?.accessToken);
        const customHttpRouteRequest = async () => {
            const result = await api.connection.fetch("https://aerialforms--development.gadget.app/custom")
            const json = await result.json()
            setStoreData(json.currentShopId.toString())
        }

        customHttpRouteRequest().catch(console.error);
    }, [])

    // get the model data using the current store data
    const [{ data, fetching }] = useMaybeFindFirst(api.clientHubspot, {    
        filter: { currentStoreId: { equals: storeData } },  
    });

    
    const [updateStatusResponse, updateStatus] = useAction(api.clientHubspot.update)

    const enableHubspotIntegration = async () => {

        const status = {
            filter: { currentStoreId: { equals: storeData } 
            },
            "id": data?.id,
            "clientHubspot": {
                "enabled": true
            }
        }

        await updateStatus(status)
    }

    const disableHubspotIntegration = async () => {
        
        const status = {
            filter: { currentStoreId: { equals: storeData } 
            },
            "id": data?.id,
            "clientHubspot": {
                "enabled": false
            }
        }

        await updateStatus(status)

    }

    // Update API Key / Server # //

    const handleHubspotAccessTokenChange = useCallback((
        newAccessToken
        ) => setHubspotAccessToken(newAccessToken), []);

    const saveHubspotInfo = async () => {
        
        const status = {
            filter: { currentStoreId: { equals: storeData } 
            },
            "id": data?.id,
            "clientHubspot": {
                "accessToken": hubspotAccessToken
            }
        }

        await updateStatus(status)

    }

    const Buttons = () => {

        if (fetching) {
            return <Spinner accessibilityLabel="Small spinner example" size="small" />
        }

        if (data?.enabled) {
            return <Button destructive onClick={disableHubspotIntegration}>Disable</Button>
        } else {
            return <Button primary onClick={enableHubspotIntegration}>Enable</Button>
        }

    }

    const dataInputs = (
        data?.enabled ? (
            <LegacyCard.Section>
                <FormLayout>           
                    <FormLayout.Group>
                        <Text color="success" variant="heading2xl" as="h1">Hubspot Enabled</Text>
                                       
                        <Form 
                            onSubmit={() => saveHubspotInfo()}>
                            <FormLayout>
                                <TextField
                                    value={hubspotAccessToken}
                                    label="Access Token"
                                    placeholder={data?.accessToken}
                                    onChange={handleHubspotAccessTokenChange}
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
                    <img src={hubspotLogo} alt='Shopify logo' style={{ width: '25px' }} />
                    <Text variant='headingMd' as='h2'>Hubspot</Text>
                    
                </LegacyStack>
            </LegacyCard.Section>
            <LegacyCard.Section>
                <LegacyStack spacing="loose" vertical>
                    <p>
                        New email submissions create new customers in Hubspot.
                        <Button
                        alignment="right"
                        plain
                        icon={CircleInformationMajor}
                        accessibilityLabel="Learn more"
                        url="https://handstand.helpscoutdocs.com/article/5-how-to-find-api-keys-for-hubspot-integrations"
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


