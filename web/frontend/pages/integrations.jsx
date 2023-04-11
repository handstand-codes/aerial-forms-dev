import {useState, useCallback, useEffect } from 'react';
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { useNavigate } from "@shopify/app-bridge-react";
import { klaviyoLogo } from "../assets";

import { 
    Page,
    Layout,
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
    const [checked, setChecked] = useState();
    const [isFirstButtonActive, setIsFirstButtonActive] = useState(true);
    const [shopifyChecked, setShopifyChecked] = useState();
    const [listId, setListId] = useState('');
    const [apiKey, setApiKey] = useState('');
    

    const handleListIdChange = useCallback((
    newListId
    ) => setListId(newListId), []);

    const handleApiKeyChange = useCallback((
    newApiKey
    ) => setApiKey(newApiKey), []);


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
      
    // API Calls //
    const [klaviyoResponse, updateKlaviyo] = useAction(api.klaviyo.update);
    const [shopifyEnabledResponse, updateShopifyEnabled] = useAction(api.shopifyEnabled.update);

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
    }

    if (shopifyEnabledResponse.fetching || shopifyEnabledResponse.data) {
        if (shopifyEnabledResponse.data) {
            navigate("/integrations");
            }
        }


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
         
        const customHttpRouteRequest = async () => {
          const result = await api.connection.fetch("https://email-getter-v7--development.gadget.app/custom");
          const json = await result.json();
          setData(json.toString());   
        };   
        customHttpRouteRequest().catch(console.error);
      }, []);


    const [showKlaviyo, setShowKlaviyo] = useState(false)
    
    const enableKlaviyo = useCallback(
        () => setShowKlaviyo((showKlaviyo) => !showKlaviyo),
              
        []);
    

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
                    <br/>
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
                    <br/> 
                    </Card.Section>                
                </Grid.Cell>
                                                     
            </Grid>

            ):( null )
    )


    return (

        <Page title="Integrations">
            
            
            <CalloutCard
                illustration={ klaviyoLogo }
                primaryAction={{
                    content: 'Klaviyo Integrations',
                    onAction: () => enableKlaviyo()
                  }} 
                      
            >

                {klaviyoMarkup}    
                    
            </CalloutCard>
         
            
            <Card
                title="Shopify"
            >
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
                </Card>
          
        </Page>

    )
}