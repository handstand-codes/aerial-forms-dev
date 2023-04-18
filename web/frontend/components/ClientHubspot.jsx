import {useState, useCallback, useEffect } from 'react';
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { useNavigate } from "@shopify/app-bridge-react";
import { hubspotLogo } from "../assets";

import { 
    CalloutCard,
    Checkbox,
    Button,
    Form,
    FormLayout,
    TextField
  } from "@shopify/polaris";

export function ClientHubspot() {

    const navigate = useNavigate();
    const [data, setData] = useState("");
    const [showHubspot, setShowHubspot] = useState(false);
    const [hubspotChecked, setHubspotChecked] = useState();
    const [hubspotAccessToken, setHubspotAccessToken] = useState('');
    const [hubspotServer, setHubspotServer] = useState('');
   
    const [clientHubspotResponse, updateClientHubspot] = useAction(api.clientHubspot.update);
     
    const [clientHubspot] = useFindMany(api.clientHubspot, {    
        filter: {
            currentStoreId: {
              equals: data.currentShopId,
            },
          }
      });

    const handleHubspotAccessTokenChange = useCallback((
        newAccessToken
        ) => setHubspotAccessToken(newAccessToken), []);

    const handleHubspotServerIdChange = useCallback((
        newServer
        ) => setHubspotServer(newServer), []);

    const enableHubspot = useCallback(
        () => setShowHubspot((showHubspot) => !showHubspot),       
        []);

    // Update Enabled TRUE/FALSE //

    const saveHubspotCheck = useCallback(
        async (id, enabled) => {
            const changed = !enabled
            setHubspotChecked(changed)
            const clientHubspot = 
                {
                enabled: changed
                }               
    await updateClientHubspot({ id, clientHubspot });            
        }
    );  

    // Update API Key / Server # //

    const saveHubspotInfo = useCallback(
        async (id) => {
            const clientHubspot = 
            {
                accessToken: hubspotAccessToken,
                server: hubspotServer
            }               
            await updateClientHubspot({ id, clientHubspot });         
            }
        );  

    if (clientHubspotResponse.fetching || clientHubspotResponse.data) {
        if (clientHubspotResponse.data) {
        navigate("/integrations");
        }
    };

    useEffect(() => {
        clientHubspot.data?.map((startState, i) => (
            setHubspotChecked(startState.enabled),
            setHubspotAccessToken(startState.accessToken),
            setHubspotServer(startState.server)
         ));  
        const customHttpRouteRequest = async () => {
          const result = await api.connection.fetch("https://aerialforms--development.gadget.app/custom");
          const json = await result.json();
          setData(json.toString());   
        };   
        customHttpRouteRequest().catch(console.error);
      }, []);

    const hubspotMarkup = (
        showHubspot ? (
            <FormLayout>           
                <FormLayout.Group>
                        {clientHubspot.data?.map((enabled, i) => (
                            <Checkbox
                                id={enabled.id}
                                key={enabled.id}
                                position={i}
                                label="Enabled"
                                checked={hubspotChecked}
                                onChange={() => saveHubspotCheck(enabled.id, enabled.enabled)}
                            />                                
                        ))}
                            
                    {clientHubspot.data?.map((info, i) => (
                    <Form 
                        id={info.id}
                        key={info.id}
                        position={i}
                        onSubmit={() => saveHubspotInfo(info.id)}>
                        <FormLayout>
                            <TextField
                                value={hubspotAccessToken}
                                label="Access Token"
                                placeholder={info.accessToken}
                                onChange={handleHubspotAccessTokenChange}
                                autoComplete='off'
                            />
                            {/* <TextField
                                value={hubspotServer}
                                label="Server"
                                placeholder={info.server}
                                onChange={handleHubspotServerIdChange}
                                autoComplete='off'
                            /> */}
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
                illustration={ hubspotLogo }
                primaryAction={{
                    content: 'Hubspot Integrations',
                    onAction: () => enableHubspot()
                  }} 
            >
            {hubspotMarkup}  
            </CalloutCard>  
        </>

  )}