import {useState, useCallback, useEffect } from 'react';
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { useNavigate } from "@shopify/app-bridge-react";
import { klaviyoLogo } from "../assets";

import { 
    CalloutCard,
    Button,
    Form,
    FormLayout,
    TextField,
    Text
  } from "@shopify/polaris";

export function ClientKlaviyo() {

    const navigate = useNavigate();
    const [data, setData] = useState("");
    const [klaviyoChecked, setKlaviyoChecked] = useState();
    const [showKlaviyo, setShowKlaviyo] = useState(); 
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
            setKlaviyoChecked(changed);
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
            setKlaviyoChecked(startState.enabled),
            setListId(startState.listId),
            setApiKey(startState.apiKey),
            setShowKlaviyo(startState.enabled)
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
            <FormLayout> 
                <FormLayout.Group>
                    <Text 
                    color="success"
                    variant="heading4xl" as="h1">Klaviyo Enabled</Text>
                                                                                          
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
                            <Button monochrome size="slim" submit>Update</Button>
                        </FormLayout>
                    </Form>
                    ))}
                    
                </FormLayout.Group>                
            </FormLayout>
                                                
            ):( <Text 
                variant="heading2xl" as="h1">Klaviyo</Text> )
    )

    return (

        <>
        {klaviyoRecords.data?.map((enabled, i) => (
            <CalloutCard
                    id={enabled.id}
                    key={enabled.id}
                    position={i}
                    illustration={ klaviyoLogo }
                    primaryAction={{
                        content: (showKlaviyo ? (<Text color="critical" fontWeight="bold">Disable</Text>) : (<Text color="success" fontWeight="bold">Enable</Text>)),
                        onAction: () => (enableKlaviyo(), saveCheck(enabled.id, enabled.enabled))
                    }} 
                >
                {klaviyoMarkup}  
            </CalloutCard>
        ))}
        </>

  )}