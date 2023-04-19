import {useState, useEffect } from 'react';
import { api } from "../api";
import { useMaybeFindFirst } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { shopifyLogo } from "../assets";

import { 
    FormLayout,
    Checkbox,
    LegacyCard,
    Button,
    LegacyStack,
    ButtonGroup,
    Text
  } from "@shopify/polaris";

export function ClientShopify() {

    useEffect(() => {
        const customHttpRouteRequest = async () => {
            const result = await api.connection.fetch("https://aerialforms--development.gadget.app/custom")
            const json = await result.json()
            setData(json.toString())
        }

        customHttpRouteRequest().catch(console.error);
    }, [])


    // get the current store data
    const [data, setData] = useState("")

    // get the model data using the current store data
    const [clientShopify] = useMaybeFindFirst(api.clientShopify, {    
        filter: {
            currentStoreId: {
                equals: data.currentShopId,
            }
        }
    })

    const [shopifyUpdated, updateShopify] = useAction(api.clientShopify.update);


    const enableShopifyIntegration = async () => {

        console.log(clientShopify.data.id)

        const id = 1
        
        const status = {
            enabled: "true"
        }

        await updateShopify({ id, status })
    }

    const disbleShopifyIntegration = () => {
        console.log('disable shopify')
    }
    
    const buttons = (
        clientShopify?.data?.enabled ? (
            <Button destructive onClick={disbleShopifyIntegration}>Disable</Button>
        ) : (
            <Button primary onClick={enableShopifyIntegration}>Enable</Button>
        )
    )
    

    const shopifyDataInputs = (
        clientShopify?.data?.enabled ? (
            <LegacyCard.Section>
                enabled
            </LegacyCard.Section>
        ) : (
            <LegacyCard.Section>
                disabled
            </LegacyCard.Section>
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
                            {buttons}
                        </ButtonGroup>
                    </LegacyStack>
                </LegacyStack>
            </LegacyCard.Section>
            {shopifyDataInputs}
        </LegacyCard>
        

  )}