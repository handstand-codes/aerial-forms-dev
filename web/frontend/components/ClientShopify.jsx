import {useState, useCallback, useEffect } from 'react';
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { useNavigate } from "@shopify/app-bridge-react";
import { shopifyLogo } from "../assets";

import { 
    CalloutCard,
    FormLayout,
    Checkbox,
    
  } from "@shopify/polaris";

export function ClientShopify() {

    const navigate = useNavigate();
    const [data, setData] = useState("");
    const [showShopify, setShowShopify] = useState(false);
    const [shopifyChecked, setShopifyChecked] = useState();

    const [shopifyEnabledResponse, updateShopifyEnabled] = useAction(api.clientShopify.update);

    const [shopifyEnabled] = useFindMany(api.clientShopify, {    
        filter: {
            currentStoreId: {
              equals: data.currentShopId,
            },
          }
      });

    const enableShopify = useCallback(
        () => setShowShopify((showShopify) => !showShopify),       
        []);

    const saveShopifyCheck = useCallback(
        async (id, enabled) => {
            const changed = !enabled
            setShopifyChecked(changed)
            const clientShopify = 
                {
                enabled: changed
                } 
                             
    await updateShopifyEnabled({ id, clientShopify });            
        }
    );  

    if (shopifyEnabledResponse.fetching || shopifyEnabledResponse.data) {
        if (shopifyEnabledResponse.data) {
        navigate("/integrations");
        }
    };

    useEffect(() => {
        shopifyEnabled.data?.map((startState, i) => (
            console.log(startState.enabled),
            setShopifyChecked(startState.enabled)
        ));
        const customHttpRouteRequest = async () => {
        const result = await api.connection.fetch("https://aerialforms--development.gadget.app/custom");
        const json = await result.json();
        setData(json.toString());   
        };   
        customHttpRouteRequest().catch(console.error);
    }, []);

    const shopifyMarkup = (
        showShopify ? (
            <FormLayout>           
                <FormLayout.Group>
                    
                        {shopifyEnabled.data?.map((enabled, i) => (
                            <Checkbox
                                id={enabled.id}
                                key={enabled.id}
                                position={i}
                                label="Enabled"
                                checked={shopifyChecked}
                                onChange={() => saveShopifyCheck(enabled.id, enabled.enabled)}
                            />                                
                        ))}
                    
                </FormLayout.Group>                
            </FormLayout>
            
        ):( null )
    )

    return (

        <>
            <CalloutCard
                illustration={ shopifyLogo }
                primaryAction={{
                    content: 'Shopify Integrations',
                    onAction: () => enableShopify()
                  }} 
            >
            {shopifyMarkup}    
            </CalloutCard>
        </>

  )}