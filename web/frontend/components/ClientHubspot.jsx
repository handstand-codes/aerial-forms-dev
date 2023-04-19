import {useState, useCallback, useEffect } from 'react';
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { useNavigate } from "@shopify/app-bridge-react";
import { hubspotLogo } from "../assets";

import { 
    CalloutCard,
    Text,
    Button,
    Form,
    FormLayout,
    TextField
  } from "@shopify/polaris";

export function ClientHubspot() {

    const navigate = useNavigate();
    const [data, setData] = useState("");
    const [hubspotChecked, setHubspotChecked] = useState();
    const [showHubspot, setShowHubspot] = useState(false);
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
            setHubspotServer(startState.server),
            setShowHubspot(startState.enabled)
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
                    <Text 
                        color="success"
                        variant="heading4xl" as="h1">Hubspot Enabled</Text>
                                       
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
                            <Button monochrome size="slim" submit>Update</Button>
                        </FormLayout>
                    </Form>
                    ))}
                    
                </FormLayout.Group>                
            </FormLayout>

        ):( <Text 
            variant="heading2xl" as="h1">Hubspot</Text> )
    )

    return (

        <>
        {clientHubspot.data?.map((enabled, i) => (
            <CalloutCard
                illustration={ hubspotLogo }
                primaryAction={{
                    content: (showHubspot ? (<Text color="critical" fontWeight="bold">Disable</Text>) : (<Text color="success" fontWeight="bold">Enable</Text>)),
                    onAction: () => (enableHubspot(), saveHubspotCheck(enabled.id, enabled.enabled))
                }} 
            >
            {hubspotMarkup}  
            </CalloutCard>
        ))}  
        </>

  )}