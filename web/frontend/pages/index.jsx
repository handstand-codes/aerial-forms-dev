import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";

import { 
  Page,
  Layout,
  LegacyStack,
  Spinner,
  IndexTable,
  LegacyCard,
  EmptySearchResult,
  Pagination,
  Icon,
} from "@shopify/polaris";

import {
  TickMinor,
  CancelMinor
} from '@shopify/polaris-icons';


export default function HomePage() {

// API call & confirm Shop ID //
  const [storeData, setStoreData] = useState("");
  const [cursor, setCursor] = useState({ first: 25 });

 
  
  
  const [emailRecords] = useFindMany(api.email, {    
    ...cursor,
    filter: { currentStoreId: { equals: storeData } 
  },
    select: {
      __typename: true,
      id: true,
      currentStoreId: true,
      submitEmail: true,
      createdAt: true,
      sentToDrip: true,
      sentToHubspot: true,
      sentToShopify: true,
      sentToMailchimp: true
    },
  });
  

  
  useEffect(() => {
    
    const customHttpRouteRequest = async () => {
      const result = await api.connection.fetch("https://aerialforms.gadget.app/custom")
      const json = await result.json()
      setStoreData(json.currentShopId.toString())
  }

  customHttpRouteRequest().catch(console.error);
}, [])
    
// EMPTY STATE //

  const emptyStateMarkup = (
    <EmptySearchResult
      title={'No customers emails'}
      withIllustration
    />
  );

// PAGINATION //

  const getNextPage = useCallback(() => {
    // use first + after to page forwards
    setCursor({ first: 25, after: emailRecords.data?.endCursor });
  }, [emailRecords.data]);

  const getPreviousPage = useCallback(() => {
    // use last + before to page backwards
    setCursor({ last: 25, before: emailRecords.data?.startCursor });
  }, [emailRecords.data]);

// ROW MARKUP //

  const rowMarkup = emailRecords.data?.map((email, i) => (

    
    
      <IndexTable.Row
        id={email.id}
        key={email.id}
        position={i}
      >
        <IndexTable.Cell>
        {email.submitEmail}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {email.createdAt.toLocaleString()}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {email.sentToShopify ? <Icon source={TickMinor} color="base" /> :  <Icon source={CancelMinor} color="base" /> }
        </IndexTable.Cell>
        <IndexTable.Cell>
          {email.sentToKlaviyo ? <Icon source={TickMinor} color="base" /> :  <Icon source={CancelMinor} color="base" /> }
        </IndexTable.Cell>
        <IndexTable.Cell>
          {email.sentToMailchimp ? <Icon source={TickMinor} color="base" /> :  <Icon source={CancelMinor} color="base" /> }
        </IndexTable.Cell>
        <IndexTable.Cell>
          {email.sentToHubspot ? <Icon source={TickMinor} color="base" /> :  <Icon source={CancelMinor} color="base" /> }
        </IndexTable.Cell>
        <IndexTable.Cell>
          {email.sentToDrip ? <Icon source={TickMinor} color="base" /> :  <Icon source={CancelMinor} color="base" /> }
        </IndexTable.Cell>
        <IndexTable.Cell>
          {email.sentToZoho ? <Icon source={TickMinor} color="base" /> :  <Icon source={CancelMinor} color="base" /> }
        </IndexTable.Cell>

      </IndexTable.Row> 

    )
   );
  
// LOADING SPINNER //

  if (emailRecords.fetching) {
    return (
      <Page>
        <LegacyStack sectioned alignment="center">
          <Spinner /> <span>Loading...</span>
        </LegacyStack>
      </Page>
    );
  }

  return (
    
    <Page title="Submissions">
        <Layout>
            <Layout.Section>
                <LegacyCard>
                    <IndexTable
                      itemCount={emailRecords.data?.length}
                      emptyState={emptyStateMarkup}
                      headings={[
                        {title: 'Customer Email'},
                        {title: 'Created At'},
                        {title: 'Sent to Shopify'},
                        {title: 'Sent to Klaviyo'},
                        {title: 'Sent to Mailchimp'},
                        {title: 'Sent to Hubspot'},
                        {title: 'Sent to Drip'},
                        {title: 'Sent to Zoho'},
                      ]}
                      selectable={false}
                      >
                      {rowMarkup}
                      
                    </IndexTable> 
                          <br/>
                          <LegacyStack alignment="center" distribution="center"> 
                              <LegacyStack.Item>
                                  <Pagination
                                    hasPrevious={emailRecords.data?.hasPreviousPage}
                                    onPrevious={() => {
                                      getPreviousPage()
                                    }}
                                    hasNext={emailRecords.data?.hasNextPage}
                                    onNext={() => {
                                      getNextPage()
                                      }}
                                  />   
                              </LegacyStack.Item>               
                          </LegacyStack> 
                          <br/>
                  </LegacyCard>         
            </Layout.Section>        
        </Layout>
    </Page> 
    
  );
}