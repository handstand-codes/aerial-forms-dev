import { useState, useEffect } from 'react';
import { api } from "../api";
import { useMaybeFindFirst } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { shopifyLogo } from "../assets";

import { 
    LegacyCard,
    Button,
    LegacyStack,
    ButtonGroup,
    Text,
    Spinner
  } from "@shopify/polaris";

export function ClientShopify() {    

    // get the current store data
    const [storeData, setStoreData] = useState('')

    useEffect(() => {
        const customHttpRouteRequest = async () => {
            const result = await api.connection.fetch("https://aerialforms--development.gadget.app/custom")
            const json = await result.json()
            setStoreData(json)
        }

        customHttpRouteRequest().catch(console.error);
    }, [])

    // get the model data using the current store data
    const [{ data, fetching }] = useMaybeFindFirst(api.clientShopify, {    
        where: {
            currentStoreId: toString(storeData?.currentShopId)
        }
    })

    
    const [updateStatusResponse, updateStatus] = useAction(api.clientShopify.update)

    const enableShopifyIntegration = async () => {

        const status = {
            "id": data.id,
            "clientShopify": {
                "enabled": true
            }
        }

        await updateStatus(status)
    }

    const disbleShopifyIntegration = async () => {
        
        const status = {
            "id": data.id,
            "clientShopify": {
                "enabled": false
            }
        }

        await updateStatus(status)

    }

    const Buttons = () => {

        if (fetching) {
            return <Spinner accessibilityLabel="Small spinner example" size="small" />
        }

        if (data?.enabled) {
            return <Button destructive onClick={disbleShopifyIntegration}>Disable</Button>
        } else {
            return <Button primary onClick={enableShopifyIntegration}>Enable</Button>
        }

    }

    const dataInputs = (
        data?.enabled ? (
            <LegacyCard.Section>
                add the inputs here
            </LegacyCard.Section>
        ) : (
            <></>
        )
    )
    
    return (
        <LegacyCard>
            <LegacyCard.Section>
                <LegacyStack alignment="center">
                    <img src={shopifyLogo} alt='Shopify logo' style={{ width: '25px' }} />
                    <Text variant='headingMd' as='h2'>Shopify</Text>
                </LegacyStack>
            </LegacyCard.Section>
            <LegacyCard.Section>
                <LegacyStack spacing="loose" vertical>
                    <p>
                        New email submissions create new customers in Shopify.
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