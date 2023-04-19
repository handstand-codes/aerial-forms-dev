import { useState, useEffect } from 'react';
import { api } from "../api";
import { useMaybeFindFirst } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { klaviyoLogo } from "../assets";

import { 
    LegacyCard,
    Button,
    LegacyStack,
    ButtonGroup,
    Text,
    Spinner
  } from "@shopify/polaris";

export function ClientKlaviyo() {    

    // get the current store data
    const [storeData, setStoreData] = useState('')

    useEffect(() => {
        const customHttpRouteRequest = async () => {
            const result = await api.connection.fetch("https://aerialforms--development.gadget.app/custom")
            const json = await result.json()
            setStoreData(json)
        }

        customHttpRouteRequest().catch(console.error);
    }, [])

    // get the model data using the current store data
    const [{ data, fetching }] = useMaybeFindFirst(api.clientKlaviyo, {    
        where: {
            currentStoreId: toString(storeData?.currentShopId)
        }
    })

    
    const [updateStatusResponse, updateStatus] = useAction(api.clientKlaviyo.update)

    const enableKlaviyoIntegration = async () => {

        const status = {
            "id": data.id,
            "clientKlaviyo": {
                "enabled": true
            }
        }

        await updateStatus(status)
    }

    const disableKlaviyoIntegration = async () => {
        
        const status = {
            "id": data.id,
            "clientKlaviyo": {
                "enabled": false
            }
        }

        await updateStatus(status)

    }

    const Buttons = () => {

        if (fetching) {
            return <Spinner accessibilityLabel="Small spinner example" size="small" />
        }

        if (data?.enabled) {
            return <Button destructive onClick={disableKlaviyoIntegration}>Disable</Button>
        } else {
            return <Button primary onClick={enableKlaviyoIntegration}>Enable</Button>
        }

    }

    const dataInputs = (
        data?.enabled ? (
            <LegacyCard.Section>
                add the inputs here
            </LegacyCard.Section>
        ) : (
            <></>
        )
    )
    
    return (
        <LegacyCard>
            <LegacyCard.Section>
                <LegacyStack alignment="center">
                    <img src={klaviyoLogo} alt='Shopify logo' style={{ width: '25px' }} />
                    <Text variant='headingMd' as='h2'>Klaviyo</Text>
                </LegacyStack>
            </LegacyCard.Section>
            <LegacyCard.Section>
                <LegacyStack spacing="loose" vertical>
                    <p>
                        New email submissions create new customers in Shopify.
                    </p>
                    <LegacyStack>
                        <ButtonGroup>
                            <Buttons></Buttons>
                        </ButtonGroup>
                    </LegacyStack>
                </LegacyStack>
            </LegacyCard.Section>
            {dataInputs}
        </LegacyCard>
        

  )}





// import {useState, useCallback, useEffect } from 'react';
// import { api } from "../api";
// import { useFindMany } from "@gadgetinc/react";
// import { useAction } from "@gadgetinc/react";
// import { useNavigate } from "@shopify/app-bridge-react";
// import { klaviyoLogo } from "../assets";

// import { 
//     CalloutCard,
//     Button,
//     Form,
//     FormLayout,
//     TextField,
//     Text
//   } from "@shopify/polaris";

// export function ClientKlaviyo() {

//     const navigate = useNavigate();
//     const [data, setData] = useState("");
//     const [klaviyoChecked, setKlaviyoChecked] = useState();
//     const [showKlaviyo, setShowKlaviyo] = useState(); 
//     const [listId, setListId] = useState('');
//     const [apiKey, setApiKey] = useState('');

//     const [klaviyoResponse, updateKlaviyo] = useAction(api.clientKlaviyo.update);
       
//     const [klaviyoRecords] = useFindMany(api.clientKlaviyo, {    
//         filter: {
//           currentStoreId: {
//             equals: data.currentShopId,
//           },
//         }
//       });

//     const handleListIdChange = useCallback((
//         newListId
//         ) => setListId(newListId), []);

//     const handleApiKeyChange = useCallback((
//         newApiKey
//         ) => setApiKey(newApiKey), []);

//     const enableKlaviyo = useCallback(
//         () => setShowKlaviyo((showKlaviyo) => !showKlaviyo),       
//         []);

//     // Update Enabled TRUE/FALSE //

//     const saveCheck = useCallback(
//         async (id, enabled) => {
//             const changed = !enabled
//             setKlaviyoChecked(changed);
//             const clientKlaviyo = 
//                 {
//                 enabled: changed
//                 }          
//           await updateKlaviyo({ id, clientKlaviyo });         
//         }
//       );  

//     // Update List ID and API Key //

//     const saveInfo = useCallback(
//     async (id) => {
//         const clientKlaviyo = 
//         {
//             listId: listId,
//             apiKey: apiKey
//         }          
//         await updateKlaviyo({ id, clientKlaviyo });         
//         }
//     );  

//     if (klaviyoResponse.fetching || klaviyoResponse.data) {
//         if (klaviyoResponse.data) {
//         navigate("/integrations");
//         }
//     };

//     useEffect(() => {
//         klaviyoRecords.data?.map((startState, i) => (
//             setKlaviyoChecked(startState.enabled),
//             setListId(startState.listId),
//             setApiKey(startState.apiKey),
//             setShowKlaviyo(startState.enabled)
//           ));  
//         const customHttpRouteRequest = async () => {
//           const result = await api.connection.fetch("https://aerialforms--development.gadget.app/custom");
//           const json = await result.json();
//           setData(json.toString());   
//         };   
//         customHttpRouteRequest().catch(console.error);
//       }, []);

//     const klaviyoMarkup = (
//         showKlaviyo ? (
//             <FormLayout> 
//                 <FormLayout.Group>
//                     <Text 
//                     color="success"
//                     variant="heading4xl" as="h1">Klaviyo Enabled</Text>
                                                                                          
//                     {klaviyoRecords.data?.map((info, i) => (
//                     <Form 
//                         id={info.id}
//                         key={info.id}
//                         position={i}
//                         onSubmit={() => saveInfo(info.id)}>
//                         <FormLayout>
//                         <TextField
//                                 value={apiKey}
//                                 label="API Key"
//                                 placeholder={info.apiKey}
//                                 onChange={handleApiKeyChange}
//                                 autoComplete='off'
//                             />
//                             <TextField
//                                 value={listId}
//                                 label="List ID"
//                                 placeholder={info.listId}
//                                 onChange={handleListIdChange}
//                                 autoComplete='off'
//                             />
//                             <Button monochrome size="slim" submit>Update</Button>
//                         </FormLayout>
//                     </Form>
//                     ))}
                    
//                 </FormLayout.Group>                
//             </FormLayout>
                                                
//             ):( <Text 
//                 variant="heading2xl" as="h1">Klaviyo</Text> )
//     )

//     return (

//         <>
//         {klaviyoRecords.data?.map((enabled, i) => (
//             <CalloutCard
//                     id={enabled.id}
//                     key={enabled.id}
//                     position={i}
//                     illustration={ klaviyoLogo }
//                     primaryAction={{
//                         content: (showKlaviyo ? (<Text color="critical" fontWeight="bold">Disable</Text>) : (<Text color="success" fontWeight="bold">Enable</Text>)),
//                         onAction: () => (enableKlaviyo(), saveCheck(enabled.id, enabled.enabled))
//                     }} 
//                 >
//                 {klaviyoMarkup}  
//             </CalloutCard>
//         ))}
//         </>

//   )}