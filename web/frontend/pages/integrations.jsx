import {useState, useCallback, useEffect } from 'react';
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { useNavigate } from "@shopify/app-bridge-react";
import { klaviyoLogo, shopifyLogo, mailchimpLogo } from "../assets";

import { 
    Page,
    CalloutCard,
    Card,
    Checkbox,
    Button,
    ButtonGroup,
    TextContainer,
    Form,
    FormLayout,
    TextField,
    Grid
  } from "@shopify/polaris";
 
export default function IntegrationsPage() {

    const navigate = useNavigate();

    const [data, setData] = useState("");
    
    // Get //
    
    const [klaviyoRecords] = useFindMany(api.klaviyo, {    
        filter: {
          currentStoreId: {
            equals: data.currentShopId,
          },
        }
      });
    
    const [shopifyEnabled] = useFindMany(api.shopifyEnabled, {    
        filter: {
            currentStoreId: {
              equals: data.currentShopId,
            },
          }
      });

    const [mailchimpEnabled] = useFindMany(api.mailchimpEnabled, {    
        filter: {
            currentStoreId: {
              equals: data.currentShopId,
            },
          }
      });

      
      
    // API Calls //
    const [klaviyoResponse, updateKlaviyo] = useAction(api.klaviyo.update);
    const [shopifyEnabledResponse, updateShopifyEnabled] = useAction(api.shopifyEnabled.update);
    const [mailchimpEnabledResponse, updateMailchimpEnabled] = useAction(api.mailchimpEnabled.update);


    // Update Shopify Enabled  //

    const saveShopifyCheck = useCallback(
        async (id, enabled) => {
            const changed = !enabled
            setShopifyChecked(changed)
            const shopifyEnabled = 
                {
                enabled: changed
                }               
    await updateShopifyEnabled({ id, shopifyEnabled });            
        }
    );  

    if (shopifyEnabledResponse.fetching || shopifyEnabledResponse.data) {
        if (shopifyEnabledResponse.data) {
        navigate("/integrations");
        }
    };

    // Update Klaviyo Enabled //

    const saveCheck = useCallback(
        async (id, enabled) => {
            const changed = !enabled
            setChecked(changed);
            setIsFirstButtonActive(!isFirstButtonActive)
            const klaviyo = 
                {
                enabled: changed
                }          
          await updateKlaviyo({ id, klaviyo });         
        }
      );  

    // Update List ID and API Key //

    const saveInfo = useCallback(
    async (id) => {
        const klaviyo = 
        {
            listId: listId,
            apiKey: apiKey
        }          
        console.log(klaviyo)
        await updateKlaviyo({ id, klaviyo });         
        }
    );  

    if (klaviyoResponse.fetching || klaviyoResponse.data) {
        if (klaviyoResponse.data) {
        navigate("/integrations");
        }
    };

    // Update Mailchimp Enabled  //

    const saveMailchimpCheck = useCallback(
        async (id, enabled) => {
            const changed = !enabled
            setMailchimpChecked(changed)
            const mailchimpEnabled = 
                {
                enabled: changed
                }               
    await updateMailchimpEnabled({ id, mailchimpEnabled });            
        }
    );  

    // Update List ID and API Key //

    const saveMailchimpInfo = useCallback(
        async (id) => {
            const mailchimpEnabled = 
            {
                apiKey: apiKey,
                server: server
            }               
            await updateMailchimpEnabled({ id, mailchimpEnabled });         
            }
        );  

    if (mailchimpEnabledResponse.fetching || mailchimpEnabledResponse.data) {
        if (mailchimpEnabledResponse.data) {
        navigate("/integrations");
        }
    };

    // USE EFFECT //

    useEffect(() => {
        klaviyoRecords.data?.map((startState, i) => (
            setChecked(startState.enabled),
            setListId(startState.listId),
            setApiKey(startState.apiKey)
          )); 
          
        shopifyEnabled.data?.map((startState, i) => (
            setShopifyChecked(startState.enabled)
         ));

         mailchimpEnabled.data?.map((startState, i) => (
            setMailchimpChecked(startState.enabled),
            setMailchimpApiKey(startState.apiKey),
            setMailchimpServer(startState.server)
         ));
         
        const customHttpRouteRequest = async () => {
          const result = await api.connection.fetch("https://email-getter-v7--development.gadget.app/custom");
          const json = await result.json();
          setData(json.toString());   
        };   
        customHttpRouteRequest().catch(console.error);
      }, []);

    // SHOPIFY MARKUP //

    const [showShopify, setShowShopify] = useState(false);
    const [shopifyChecked, setShopifyChecked] = useState();

    const enableShopify = useCallback(
        () => setShowShopify((showShopify) => !showShopify),       
        []);

    const shopifyMarkup = (
        showShopify ? (
            <Grid>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                    <Card.Section>
                        <TextContainer>
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
                        </TextContainer>
                    </Card.Section>                         
                </Grid.Cell>   
            </Grid>
        ):( null )
    )

    // KLAVIYO MARKUP //

    const [showKlaviyo, setShowKlaviyo] = useState(false); 
    const [isFirstButtonActive, setIsFirstButtonActive] = useState(true);
    const [checked, setChecked] = useState();
    const [listId, setListId] = useState('');
    const [apiKey, setApiKey] = useState('');
       
    const enableKlaviyo = useCallback(
        () => setShowKlaviyo((showKlaviyo) => !showKlaviyo),       
        []);

    const handleListIdChange = useCallback((
        newListId
        ) => setListId(newListId), []);
    
    const handleApiKeyChange = useCallback((
        newApiKey
        ) => setApiKey(newApiKey), []);
    
    const klaviyoMarkup = (
        showKlaviyo ? (
            <Grid>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                    <Card.Section>
                        <TextContainer>
                        <ButtonGroup segmented>
                        {klaviyoRecords.data?.map((enabled, i) => (
                            <Button
                                primary
                                id={enabled.id}
                                key={enabled.id}
                                position={i}
                                pressed={!isFirstButtonActive}
                                onClick={() => saveCheck(enabled.id, enabled.enabled)}
                            >Enable Klaviyo
                            </Button>
                            ))}
                            {klaviyoRecords.data?.map((enabled, i) => (
                            <Button 
                                destructive
                                id={enabled.id}
                                key={enabled.id}
                                position={i}
                                pressed={isFirstButtonActive} 
                                onClick={() => saveCheck(enabled.id, enabled.enabled)}>
                            Disable Klaviyo
                          </Button>
                        ))}                                
                        
                        </ButtonGroup>
                        </TextContainer>
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
                                value={listId}
                                label="List ID"
                                placeholder={info.listId}
                                onChange={handleListIdChange}
                                autoComplete='off'
                            />
                            <TextField
                                value={apiKey}
                                label="API Key"
                                placeholder={info.apiKey}
                                onChange={handleApiKeyChange}
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

    // Mailchimp MARKUP //

    const [showMailchimp, setShowMailchimp] = useState(false);
    const [mailchimpChecked, setMailchimpChecked] = useState();
    const [mailchimpApiKey, setMailchimpApiKey] = useState('');
    const [mailchimpServer, setMailchimpServer] = useState('');
    
    const handleMailchimpApiKeyChange = useCallback((
        newApiKey
        ) => setMailchimpApiKey(newApiKey), []);

    const handleMailchimpServerIdChange = useCallback((
        newServer
        ) => setMailchimpServer(newServer), []);

    const enableMailchimp = useCallback(
        () => setShowMailchimp((showMailchimp) => !showMailchimp),       
        []);

    const mailchimpMarkup = (
        showMailchimp ? (
            <Grid>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>           
                    <Card.Section>
                        {mailchimpEnabled.data?.map((enabled, i) => (
                            <Checkbox
                                id={enabled.id}
                                key={enabled.id}
                                position={i}
                                label="Enabled"
                                checked={mailchimpChecked}
                                onChange={() => saveMailchimpCheck(enabled.id, enabled.enabled)}
                            />                                
                        ))}
                    </Card.Section>  
                </Grid.Cell>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>              
                    
                    <Card.Section>
                    {mailchimpEnabled.data?.map((info, i) => (
                    <Form 
                        id={info.id}
                        key={info.id}
                        position={i}
                        onSubmit={() => saveMailchimpInfo()}>
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

        <Page title="Integrations">
            <CalloutCard
                illustration={ shopifyLogo }
                primaryAction={{
                    content: 'Shopify Integrations',
                    onAction: () => enableShopify()
                  }} 
            >
            {shopifyMarkup}    
            </CalloutCard>
            
            <CalloutCard
                illustration={ klaviyoLogo }
                primaryAction={{
                    content: 'Klaviyo Integrations',
                    onAction: () => enableKlaviyo()
                  }} 
            >
            {klaviyoMarkup}  
            </CalloutCard>

            <CalloutCard
                illustration={ mailchimpLogo }
                primaryAction={{
                    content: 'Mailchimp Integrations',
                    onAction: () => enableMailchimp()
                  }} 
            >
            {mailchimpMarkup}  
            </CalloutCard>                       
                           
        </Page>

    )
}