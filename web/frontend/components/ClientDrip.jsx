import { useState, useEffect } from 'react';
import { api } from "../api";
import { useMaybeFindFirst } from "@gadgetinc/react";
import { useAction } from "@gadgetinc/react";
import { dripLogo } from "../assets";

import { 
    LegacyCard,
    Button,
    LegacyStack,
    ButtonGroup,
    Text,
    Spinner
  } from "@shopify/polaris";

export function ClientDrip() {    

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
    const [{ data, fetching }] = useMaybeFindFirst(api.clientDrip, {    
        where: {
            currentStoreId: toString(storeData?.currentShopId)
        }
    })

    
    const [updateStatusResponse, updateStatus] = useAction(api.clientDrip.update)

    const enableDripIntegration = async () => {

        const status = {
            "id": data.id,
            "clientDrip": {
                "enabled": true
            }
        }

        await updateStatus(status)
    }

    const disableDripIntegration = async () => {
        
        const status = {
            "id": data.id,
            "clientDrip": {
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
            return <Button destructive onClick={disableDripIntegration}>Disable</Button>
        } else {
            return <Button primary onClick={enableDripIntegration}>Enable</Button>
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
                    <img src={dripLogo} alt='Shopify logo' style={{ width: '25px' }} />
                    <Text variant='headingMd' as='h2'>Drip</Text>
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
// import { dripLogo } from "../assets";

// import { 
//     CalloutCard,
//     Text,
//     Button,
//     Form,
//     FormLayout,
//     TextField
//   } from "@shopify/polaris";

// export function ClientDrip() {

//     const navigate = useNavigate();
//     const [data, setData] = useState("");
//     const [dripChecked, setDripChecked] = useState();
//     const [showDrip, setShowDrip] = useState();
//     const [dripToken, setDripToken] = useState('');
//     const [dripAccountId, setDripAccountId] = useState('');
   
//     const [clientDripResponse, updateClientDrip] = useAction(api.clientDrip.update);
     
//     const [clientDrip] = useFindMany(api.clientDrip, {    
//         filter: {
//             currentStoreId: {
//               equals: data.currentShopId,
//             },
//           }
//       });

//     const handleDripTokenChange = useCallback((
//         newToken
//         ) => setDripToken(newToken), []);

//     const handleDripAccountIdChange = useCallback((
//         newAccountId
//         ) => setDripAccountId(newAccountId), []);

//     const enableDrip = useCallback(
//         () => setShowDrip((showDrip) => !showDrip),       
//         []);

//     // Update Enabled TRUE/FALSE //

//     const saveDripCheck = useCallback(
//         async (id, enabled) => {
//             const changed = !enabled
//             setDripChecked(changed)
//             const clientDrip = 
//                 {
//                 enabled: changed
//                 }               
//     await updateClientDrip({ id, clientDrip });            
//         }
//     );  

//     // Update API Key / Server # //

//     const saveDripInfo = useCallback(
//         async (id) => {            
//             const clientDrip = 
//             {
//                 apiKey: dripToken,
//                 server: dripAccountId
//             }               
//             await updateClientDrip({ id, clientDrip });         
//             }
//         );  

//     if (clientDripResponse.fetching || clientDripResponse.data) {
//         if (clientDripResponse.data) {
//         navigate("/integrations");
//         }
//     };

//     useEffect(() => {
//         clientDrip.data?.map((startState, i) => (
//             setDripChecked(startState.enabled),
//             setDripToken(startState.token),
//             setDripAccountId(startState.accountId),
//             setShowDrip(startState.enabled)
//          ));  
//         const customHttpRouteRequest = async () => {
//           const result = await api.connection.fetch("https://aerialforms--development.gadget.app/custom");
//           const json = await result.json();
//           setData(json.toString());   
//         };   
//         customHttpRouteRequest().catch(console.error);
//       }, []);

//     const dripMarkup = (
//         showDrip ? (
//             <FormLayout>           
//                 <FormLayout.Group>
//                     <Text 
//                         color="success"
//                         variant="heading4xl" as="h1">Drip Enabled</Text>     
                    
//                     {clientDrip.data?.map((info, i) => (
//                     <Form 
//                         id={info.id}
//                         key={info.id}
//                         position={i}
//                         onSubmit={() => saveDripInfo(info.id)}>
//                         <FormLayout>
//                             <TextField
//                                 value={dripToken}
//                                 label="Token"
//                                 placeholder={info.token}
//                                 onChange={handleDripTokenChange}
//                                 autoComplete='off'
//                             />
//                             <TextField
//                                 value={dripAccountId}
//                                 label="Account ID"
//                                 placeholder={info.accountId}
//                                 onChange={handleDripAccountIdChange}
//                                 autoComplete='off'
//                             />
//                             <Button monochrome size="slim" submit>Update</Button>
//                         </FormLayout>
//                     </Form>
//                     ))}
                    
//                 </FormLayout.Group>                
//             </FormLayout> 
                 
//         ):( <Text 
//             variant="heading2xl" as="h1">Drip</Text> )
//     )

//     return (

//         <>
//         {clientDrip.data?.map((enabled, i) => (
//             <CalloutCard
//                 illustration={ dripLogo }
//                 primaryAction={{
//                     content: (showDrip ? (<Text color="critical" fontWeight="bold">Disable</Text>) : (<Text color="success" fontWeight="bold">Enable</Text>)),
//                     onAction: () => (enableDrip(), saveDripCheck(enabled.id, enabled.enabled))
//                 }} 
//             >
//             {dripMarkup}  
//             </CalloutCard> 
//         ))} 
//         </>

//   )}