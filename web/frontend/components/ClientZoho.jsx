import {useState, useCallback, useEffect } from 'react';
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { useNavigate } from "@shopify/app-bridge-react";
import { zohoLogo } from "../assets";

import { 
    CalloutCard,
    Checkbox,
    Button,
    Form,
    FormLayout,
    TextField,
    Text
  } from "@shopify/polaris";

export function ClientZoho() {

    const navigate = useNavigate();
    const [data, setData] = useState("");
    const [zohoChecked, setZohoChecked] = useState();
    const [showZoho, setShowZoho] = useState();
    const [zohoListKey, setZohoListKey] = useState('');
   
    const [clientZohoResponse, updateClientZoho] = useAction(api.clientZoho.update);
     
    const [clientZoho] = useFindMany(api.clientZoho, {    
        filter: {
            currentStoreId: {
              equals: data.currentShopId,
            },
          }
      });

    const handleZohoListKeyChange = useCallback((
        newListKey
        ) => setZohoListKey(newListKey), []);

    const enableZoho = useCallback(
        () => setShowZoho((showZoho) => !showZoho),       
        []);

    // Update Enabled TRUE/FALSE //

    const saveZohoCheck = useCallback(
        async (id, enabled) => {
            const changed = !enabled
            setZohoChecked(changed)
            const clientZoho = 
                {
                enabled: changed
                }               
    await updateClientZoho({ id, clientZoho });            
        }
    );  

    // Update API Key / Server # //

    const saveZohoInfo = useCallback(
        async (id) => {
            const clientZoho = 
            {
                listKey: zohoListKey
            }               
            await updateClientZoho({ id, clientZoho });         
            }
        );  

    if (clientZohoResponse.fetching || clientZohoResponse.data) {
        if (clientZohoResponse.data) {
        navigate("/integrations");
        }
    };

    useEffect(() => {
        clientZoho.data?.map((startState, i) => (
            setZohoChecked(startState.enabled),
            setZohoListKey(startState.listKey),
            setShowZoho(startState.enabled)
         ));  
        const customHttpRouteRequest = async () => {
          const result = await api.connection.fetch("https://aerialforms--development.gadget.app/custom");
          const json = await result.json();
          setData(json.toString());   
        };   
        customHttpRouteRequest().catch(console.error);
      }, []);

    const zohoMarkup = (
        showZoho ? (
            <FormLayout>           
                <FormLayout.Group>
                    <Text 
                        color="success"
                        variant="heading4xl" as="h1">Zoho Enabled</Text>
                        
                        
                        
                        {/* {clientZoho.data?.map((enabled, i) => (
                            <Checkbox
                                id={enabled.id}
                                key={enabled.id}
                                position={i}
                                label="Enabled"
                                checked={zohoChecked}
                                onChange={() => saveZohoCheck(enabled.id, enabled.enabled)}
                            />                                
                        ))} */}

                            
                    {clientZoho.data?.map((info, i) => (
                    <Form 
                        id={info.id}
                        key={info.id}
                        position={i}
                        onSubmit={() => saveZohoInfo(info.id)}>
                        <FormLayout>
                            <TextField
                                value={zohoListKey}
                                label="List Key"
                                placeholder={info.listKey}
                                onChange={handleZohoListKeyChange}
                                autoComplete='off'
                            />
                            <Button monochrome size="slim" submit>Update</Button>
                        </FormLayout>
                    </Form>
                    ))}
                    
                </FormLayout.Group>                
            </FormLayout>
            
        ):( <Text 
                variant="heading2xl" as="h1">Zoho</Text> )
    )

    return (

        <>
        {clientZoho.data?.map((enabled, i) => (
            <CalloutCard
                illustration={ zohoLogo }
                primaryAction={{
                    content: (showZoho ? (<Text color="critical" fontWeight="bold">Disable</Text>) : (<Text color="success" fontWeight="bold">Enable</Text>)),
                    onAction: () => (enableZoho(), saveZohoCheck(enabled.id, enabled.enabled))
                }} 
            >
            {zohoMarkup}  
            </CalloutCard>  
        ))}
        </>

  )}