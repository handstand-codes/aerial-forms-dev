import {useState, useCallback, useEffect } from 'react';
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { useNavigate } from "@shopify/app-bridge-react";
import { mailchimpLogo } from "../assets";

import { 
    CalloutCard,
    Text,
    Button,
    Form,
    FormLayout,
    TextField
  } from "@shopify/polaris";

export function ClientMailchimp() {

    const navigate = useNavigate();
    const [data, setData] = useState("");
    const [mailchimpChecked, setMailchimpChecked] = useState();
    const [showMailchimp, setShowMailchimp] = useState();
    const [mailchimpApiKey, setMailchimpApiKey] = useState('');
    const [mailchimpServer, setMailchimpServer] = useState('');
    const [mailchimpAudienceId, setMailchimpAudienceId] = useState('');
   
    const [mailchimpEnabledResponse, updateMailchimpEnabled] = useAction(api.clientMailchimp.update);
     
    const [mailchimpEnabled] = useFindMany(api.clientMailchimp, {    
        filter: {
            currentStoreId: {
              equals: data.currentShopId,
            },
          }
      });

    const handleMailchimpApiKeyChange = useCallback((
        newApiKey
        ) => setMailchimpApiKey(newApiKey), []);

    const handleMailchimpServerIdChange = useCallback((
        newServer
        ) => setMailchimpServer(newServer), []);

    const handleMailchimpAudienceIdChange = useCallback((
        newAudienceId
        ) => setMailchimpAudienceId(newAudienceId), []);

    const enableMailchimp = useCallback(
        () => setShowMailchimp((showMailchimp) => !showMailchimp),       
        []);

    // Update Enabled TRUE/FALSE //

    const saveMailchimpCheck = useCallback(
        async (id, enabled) => {
            const changed = !enabled
            setMailchimpChecked(changed)
            const clientMailchimp = 
                {
                enabled: changed
                }               
    await updateMailchimpEnabled({ id, clientMailchimp });            
        }
    );  

    // Update API Key / Server # //

    const saveMailchimpInfo = useCallback(
        async (id) => {
            const clientMailchimp = 
            {
                apiKey: mailchimpApiKey,
                server: mailchimpServer,
                audienceId: mailchimpAudienceId
            }               
            await updateMailchimpEnabled({ id, clientMailchimp });         
            }
        );  

    if (mailchimpEnabledResponse.fetching || mailchimpEnabledResponse.data) {
        if (mailchimpEnabledResponse.data) {
        navigate("/integrations");
        }
    };

    useEffect(() => {
        mailchimpEnabled.data?.map((startState, i) => (
            setMailchimpChecked(startState.enabled),
            setMailchimpApiKey(startState.apiKey),
            setMailchimpServer(startState.server),
            setMailchimpAudienceId(startState.audienceId),
            setShowMailchimp(startState.enabled)
         ));  
        const customHttpRouteRequest = async () => {
          const result = await api.connection.fetch("https://aerialforms--development.gadget.app/custom");
          const json = await result.json();
          setData(json.toString());   
        };   
        customHttpRouteRequest().catch(console.error);
      }, []);

    const mailchimpMarkup = (
        showMailchimp ? (
            <FormLayout>           
                <FormLayout.Group>
                    <Text 
                        color="success"
                        variant="heading4xl" as="h1">Mailchimp Enabled</Text>
                            
                    {mailchimpEnabled.data?.map((info, i) => (
                    <Form 
                        id={info.id}
                        key={info.id}
                        position={i}
                        onSubmit={() => saveMailchimpInfo(info.id)}>
                        <FormLayout>
                            <TextField
                                value={mailchimpApiKey}
                                label="API Key"
                                placeholder={info.apiKey}
                                onChange={handleMailchimpApiKeyChange}
                                autoComplete='off'
                            />
                            <TextField
                                value={mailchimpServer}
                                label="Server"
                                placeholder={info.server}
                                onChange={handleMailchimpServerIdChange}
                                autoComplete='off'
                            />
                            <TextField
                                value={mailchimpAudienceId}
                                label="Audience ID"
                                placeholder={info.audienceId}
                                onChange={handleMailchimpAudienceIdChange}
                                autoComplete='off'
                            />
                            <Button monochrome size="slim" submit>Update</Button>
                        </FormLayout>
                    </Form>
                    ))}
                    
                </FormLayout.Group>                
            </FormLayout>
            
        ):( <Text 
            variant="heading2xl" as="h1">Mailchimp</Text> )
    )

    return (

        <>
        {mailchimpEnabled.data?.map((enabled, i) => (
            <CalloutCard
                illustration={ mailchimpLogo }
                primaryAction={{
                    content: (showMailchimp ? (<Text color="critical" fontWeight="bold">Disable</Text>) : (<Text color="success" fontWeight="bold">Enable</Text>)),
                    onAction: () => (enableMailchimp(), saveMailchimpCheck(enabled.id, enabled.enabled))
                }} 
            >
            {mailchimpMarkup}  
            </CalloutCard> 
        ))} 
        </>

  )}