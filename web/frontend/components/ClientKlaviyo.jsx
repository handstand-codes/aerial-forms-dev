import {useState, useCallback, useEffect } from 'react';
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { useNavigate } from "@shopify/app-bridge-react";
import { klaviyoLogo } from "../assets";

import { 
    CalloutCard,
    Card,
    Button,
    Checkbox,
    Form,
    FormLayout,
    TextField,
    Grid
  } from "@shopify/polaris";

export function ClientKlaviyo() {

    const navigate = useNavigate();
    const [data, setData] = useState("");
    const [showKlaviyo, setShowKlaviyo] = useState(false); 
    const [checked, setChecked] = useState();
    const [listId, setListId] = useState('');
    const [apiKey, setApiKey] = useState('');

    const [klaviyoResponse, updateKlaviyo] = useAction(api.clientKlaviyo.update);
       
    const [klaviyoRecords] = useFindMany(api.clientKlaviyo, {    
        filter: {
          currentStoreId: {
            equals: data.currentShopId,
          },
        }
      });

    const handleListIdChange = useCallback((
        newListId
        ) => setListId(newListId), []);

    const handleApiKeyChange = useCallback((
        newApiKey
        ) => setApiKey(newApiKey), []);

    const enableKlaviyo = useCallback(
        () => setShowKlaviyo((showKlaviyo) => !showKlaviyo),       
        []);

    // Update Enabled TRUE/FALSE //

    const saveCheck = useCallback(
        async (id, enabled) => {
            const changed = !enabled
            setChecked(changed);
            const clientKlaviyo = 
                {
                enabled: changed
                }          
          await updateKlaviyo({ id, clientKlaviyo });         
        }
      );  

    // Update List ID and API Key //

    const saveInfo = useCallback(
    async (id) => {
        const clientKlaviyo = 
        {
            listId: listId,
            apiKey: apiKey
        }          
        console.log(clientKlaviyo)
        await updateKlaviyo({ id, clientKlaviyo });         
        }
    );  

    if (klaviyoResponse.fetching || klaviyoResponse.data) {
        if (klaviyoResponse.data) {
        navigate("/integrations");
        }
    };

    useEffect(() => {
        klaviyoRecords.data?.map((startState, i) => (
            setChecked(startState.enabled),
            setListId(startState.listId),
            setApiKey(startState.apiKey)
          ));  
        const customHttpRouteRequest = async () => {
          const result = await api.connection.fetch("https://aerialforms--development.gadget.app/custom");
          const json = await result.json();
          setData(json.toString());   
        };   
        customHttpRouteRequest().catch(console.error);
      }, []);

    const klaviyoMarkup = (
        showKlaviyo ? (
            <Grid>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                    <Card.Section>
                        
                        {klaviyoRecords.data?.map((enabled, i) => (
                            <Checkbox
                            id={enabled.id}
                            key={enabled.id}
                            position={i}
                            label="Enabled"
                            checked={checked}
                            onChange={() => saveCheck(enabled.id, enabled.enabled)}
                        />    
                            ))}
                                                                               
                    </Card.Section>                         
                </Grid.Cell> 

                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>              
                    
                    <Card.Section>
                    {klaviyoRecords.data?.map((info, i) => (
                    <Form 
                        id={info.id}
                        key={info.id}
                        position={i}
                        onSubmit={() => saveInfo(info.id)}>
                        <FormLayout>
                        <TextField
                                value={apiKey}
                                label="API Key"
                                placeholder={info.apiKey}
                                onChange={handleApiKeyChange}
                                autoComplete='off'
                            />
                            <TextField
                                value={listId}
                                label="List ID"
                                placeholder={info.listId}
                                onChange={handleListIdChange}
                                autoComplete='off'
                            />
                            <Button primary submit>Submit</Button>
                        </FormLayout>
                    </Form>
                    ))}
                    
                    </Card.Section>                
                </Grid.Cell>
                                                
            </Grid>
            ):( null )
    )

    return (

        <>
            <CalloutCard
                    illustration={ klaviyoLogo }
                    primaryAction={{
                        content: 'Klaviyo Integrations',
                        onAction: () => enableKlaviyo()
                    }} 
                >
                {klaviyoMarkup}  
            </CalloutCard>
        </>

  )}