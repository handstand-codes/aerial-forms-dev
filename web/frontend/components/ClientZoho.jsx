import {useState, useCallback, useEffect } from 'react';
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { useNavigate } from "@shopify/app-bridge-react";
import { zohoLogo } from "../assets";

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

export function ClientZoho() {

    const navigate = useNavigate();
    const [data, setData] = useState("");
    const [showZoho, setShowZoho] = useState(false);
    const [zohoChecked, setZohoChecked] = useState();
    const [zohoApiKey, setZohoApiKey] = useState('');
    const [zohoServer, setZohoServer] = useState('');
   
    const [clientZohoResponse, updateClientZoho] = useAction(api.clientZoho.update);
     
    const [clientZoho] = useFindMany(api.clientZoho, {    
        filter: {
            currentStoreId: {
              equals: data.currentShopId,
            },
          }
      });

    const handleZohoApiKeyChange = useCallback((
        newApiKey
        ) => setZohoApiKey(newApiKey), []);

    const handleZohoServerIdChange = useCallback((
        newServer
        ) => setZohoServer(newServer), []);

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
                apiKey: zohoApiKey,
                server: zohoServer
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
            setZohoApiKey(startState.apiKey),
            setZohoServer(startState.server)
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
            <Grid>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>           
                    <LegacyCard.Section>
                        {clientZoho.data?.map((enabled, i) => (
                            <Checkbox
                                id={enabled.id}
                                key={enabled.id}
                                position={i}
                                label="Enabled"
                                checked={zohoChecked}
                                onChange={() => saveZohoCheck(enabled.id, enabled.enabled)}
                            />                                
                        ))}
                    </LegacyCard.Section>  
                </Grid.Cell>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>              
                    
                    <LegacyCard.Section>
                    {clientZoho.data?.map((info, i) => (
                    <Form 
                        id={info.id}
                        key={info.id}
                        position={i}
                        onSubmit={() => saveZohoInfo(info.id)}>
                        <FormLayout>
                            <TextField
                                value={zohoApiKey}
                                label="API Key"
                                placeholder={info.apiKey}
                                onChange={handleZohoApiKeyChange}
                                autoComplete='off'
                            />
                            <TextField
                                value={zohoServer}
                                label="Server"
                                placeholder={info.server}
                                onChange={handleZohoServerIdChange}
                                autoComplete='off'
                            />
                            <Button primary submit>Submit</Button>
                        </FormLayout>
                    </Form>
                    ))}
                    
                    </LegacyCard.Section>                
                </Grid.Cell>
            </Grid>
        ):( null )
    )

    return (

        <>
            <CalloutCard
                illustration={ zohoLogo }
                primaryAction={{
                    content: 'Zoho Integrations',
                    onAction: () => enableZoho()
                  }} 
            >
            {zohoMarkup}  
            </CalloutCard>  
        </>

  )}