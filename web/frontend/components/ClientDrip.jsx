import {useState, useCallback, useEffect } from 'react';
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { useNavigate } from "@shopify/app-bridge-react";
import { dripLogo } from "../assets";

import { 
    CalloutCard,
    LegacyCard,
    Checkbox,
    Button,
    Form,
    FormLayout,
    TextField,
    Grid
  } from "@shopify/polaris";

export function ClientDrip() {

    const navigate = useNavigate();
    const [data, setData] = useState("");
    const [showDrip, setShowDrip] = useState(false);
    const [dripChecked, setDripChecked] = useState();
    const [dripToken, setDripToken] = useState('');
    const [dripAccountId, setDripAccountId] = useState('');
   
    const [clientDripResponse, updateClientDrip] = useAction(api.clientDrip.update);
     
    const [clientDrip] = useFindMany(api.clientDrip, {    
        filter: {
            currentStoreId: {
              equals: data.currentShopId,
            },
          }
      });

    const handleDripTokenChange = useCallback((
        newToken
        ) => setDripToken(newToken), []);

    const handleDripAccountIdChange = useCallback((
        newAccountId
        ) => setDripAccountId(newAccountId), []);

    const enableDrip = useCallback(
        () => setShowDrip((showDrip) => !showDrip),       
        []);

    // Update Enabled TRUE/FALSE //

    const saveDripCheck = useCallback(
        async (id, enabled) => {
            const changed = !enabled
            setDripChecked(changed)
            const clientDrip = 
                {
                enabled: changed
                }               
    await updateClientDrip({ id, clientDrip });            
        }
    );  

    // Update API Key / Server # //

    const saveDripInfo = useCallback(
        async (id) => {
            const clientDrip = 
            {
                apiKey: dripToken,
                server: dripAccountId
            }               
            await updateClientDrip({ id, clientDrip });         
            }
        );  

    if (clientDripResponse.fetching || clientDripResponse.data) {
        if (clientDripResponse.data) {
        navigate("/integrations");
        }
    };

    useEffect(() => {
        clientDrip.data?.map((startState, i) => (
            setDripChecked(startState.enabled),
            setDripToken(startState.token),
            setDripAccountId(startState.accountId)
         ));  
        const customHttpRouteRequest = async () => {
          const result = await api.connection.fetch("https://aerialforms--development.gadget.app/custom");
          const json = await result.json();
          setData(json.toString());   
        };   
        customHttpRouteRequest().catch(console.error);
      }, []);

    const dripMarkup = (
        showDrip ? (
            <FormLayout>           
                <FormLayout.Group>
                        {clientDrip.data?.map((enabled, i) => (
                            <Checkbox
                                id={enabled.id}
                                key={enabled.id}
                                position={i}
                                label="Enabled"
                                checked={dripChecked}
                                onChange={() => saveDripCheck(enabled.id, enabled.enabled)}
                            />                                
                        ))}          
                    
                    {clientDrip.data?.map((info, i) => (
                    <Form 
                        id={info.id}
                        key={info.id}
                        position={i}
                        onSubmit={() => saveDripInfo(info.id)}>
                        <FormLayout>
                            <TextField
                                value={dripToken}
                                label="Token"
                                placeholder={info.token}
                                onChange={handleDripTokenChange}
                                autoComplete='off'
                            />
                            <TextField
                                value={dripAccountId}
                                label="Account ID"
                                placeholder={info.accountId}
                                onChange={handleDripAccountIdChange}
                                autoComplete='off'
                            />
                            <Button primary submit>Submit</Button>
                        </FormLayout>
                    </Form>
                    ))}
                    
                </FormLayout.Group>                
            </FormLayout> 
                 
        ):( null )
    )

    return (

        <>
            <CalloutCard
                illustration={ dripLogo }
                primaryAction={{
                    content: 'Drip Integrations',
                    onAction: () => enableDrip()
                  }} 
            >
            {dripMarkup}  
            </CalloutCard>  
        </>

  )}