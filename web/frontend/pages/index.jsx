import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";

import { 
  Page,
  Layout,
  Stack,
  Spinner,
  Card,
  IndexTable,
  TextContainer,
  EmptySearchResult,
  Pagination,
} from "@shopify/polaris";


export default function HomePage() {

// API call & confirm Shop ID //
  const [data, setData] = useState("")
  const [cursor, setCursor] = useState({ first: 25 });

  const [emailRecords] = useFindMany(api.email, {    
    ...cursor,
    filter: {
      currentStoreId: {
        equals: data.currentShopId,
      },
    },
    select: {
      __typename: true,
      id: true,
      currentStoreId: true,
      submitEmail: true,
      createdAt: true,
    },
  });
  
  useEffect(() => {
    // define an async function to make the request
    const customHttpRouteRequest = async () => {
      // make sure to use your Gadget app domain and route!
      const result = await api.connection.fetch("https://email-getter-v7--development.gadget.app/custom");
      const json = await result.json();
      // use state hooks to handle response data in your component
      setData(json.toString());   
    };
    // call async function and handle errors
    customHttpRouteRequest().catch(console.error);
  }, []);
    
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
    setCursor({ first: 25, after: emailRecords.data.endCursor });
  }, [emailRecords.data]);

  const getPreviousPage = useCallback(() => {
    // use last + before to page backwards
    setCursor({ last: 25, before: emailRecords.data.startCursor });
  }, [emailRecords.data]);

// ROW MARKUP //

  const rowMarkup = emailRecords.data?.map((email, i) => (
    
      <IndexTable.Row
        id={email.id}
        key={email.id}
        position={i}
      >    
      
        <IndexTable.Cell>
          <TextContainer>
            {email.submitEmail}
          </TextContainer>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <TextContainer>
            {email.createdAt.toLocaleDateString()}
          </TextContainer>
        </IndexTable.Cell>

      </IndexTable.Row> 

    )
   );
  
// LOADING SPINNER //

  if (emailRecords.fetching) {
    return (
      <Page>
        <Stack sectioned alignment="center">
          <Spinner /> <span>Loading...</span>
        </Stack>
      </Page>
    );
  }

  return (
    
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
              <IndexTable
                itemCount={emailRecords.data?.length}
                emptyState={emptyStateMarkup}
                headings={[
                  {title: 'Customer Emails:'},
                  {title: 'Created At:'},
                ]}
                selectable={false}
                >
                {rowMarkup}
                
              </IndexTable> 
               
                    <br/>
                    <Stack
                    distribution="center"
                    > 
                      <Stack.Item>
                        <Pagination
                          hasPrevious={emailRecords.data.hasPreviousPage}
                          onPrevious={() => {
                            

                            getPreviousPage()
                          }}
                          hasNext={emailRecords.data.hasNextPage}
                          onNext={() => {


                            getNextPage()
                            }}
                        />   
                      </Stack.Item>               
                    </Stack> 
                    <br/>
                  
            </Card>         
        </Layout.Section>        
      </Layout>

    </Page> 
    
  );
}