import { 
  Page,
  Layout,
  Stack,
  Spinner,
  Card,
  IndexTable,
  TextContainer,
  EmptySearchResult,
  Frame,
  Navigation,
  Pagination,
  TextField,
  Icon,
} from "@shopify/polaris";

import {
  ImportMinor,
  SettingsMinor,
  ClipboardMinor,
} from '@shopify/polaris-icons';

import Clipboard from 'react-clipboard.js';


import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useAppBridge } from "@shopify/app-bridge-react";

export default function HomePage() {

  
const [page, setPage] = useState(true);


const [subSelect, setSubSelect] = useState(true);
const [subSettings, setSubSettings] = useState(false);


// API call & confirm Shop ID
  const [data, setData] = useState("")
  const [emailRecords] = useFindMany(api.email, {
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

 
  const pageToggle1 = useCallback(
    () => setPage(true),
    [],
  );

  const pageToggle2 = useCallback(
    () => setPage(false), 
    [],
  );


// const pageToggle = (event) => {
//   event.preventDefault()
//     newPage = !page
//     setPage(newPage)
    
// };
  
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
    

// EMPTY STATE

  const emptyStateMarkup = (
    <EmptySearchResult
      title={'No customers emails'}
      withIllustration
    />
  );

// ROW MARKUP

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
  
// LOADING SPINNER

  if (emailRecords.fetching) {
    return (
      <Page>
        <Stack sectioned alignment="center">
          <Spinner /> <span>Loading...</span>
        </Stack>
      </Page>
    );
  }
// NAV Markup

const navigationMarkup = (
  <Navigation location="/">
    <Navigation.Section
                items={[
                    {
                    selected: {subSelect},
                    label: 'Submissions',
                    icon: ImportMinor,
                    onClick: pageToggle1,                  
                    }
                ]}           
                />

    <Navigation.Section
                items={[
                    {
                      selected: {subSettings},
                      label: 'Settings',
                      icon: SettingsMinor,
                      onClick: pageToggle2,                 
                      }
                ]} 
                />
  </Navigation>   
)

// PAGE MARKUP

const pageMarkup = (

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
          </Card>         
      </Layout.Section>        
    </Layout>

{emailRecords.data.length > 25 ? (

  <Layout >
    <Layout.Section>
      
        <Pagination
          label="Search Emails"
          hasPrevious
          onPrevious={() => {
            console.log('Previous');
          }}
          hasNext
          onNext={() => {
            console.log('Next');
          }}
        />
      
    </Layout.Section>
  </Layout> 

  ):(
    null
  )}

</Page> 
);

const settingsMarkup = (
  <Page>
      <Layout>
          <Layout.Section>
              <Card title="Display the bundle on a page" sectioned>
                  <p>Copy this code and paste it on the pages where you want to show this bundle.</p>
                  <TextField 
                  readOnly 
                  value="code goes here"
                  connectedRight={
                      <Clipboard data-clipboard-text="code goes here">
                          <Icon source={ClipboardMinor}/>
                      </Clipboard>
                  }/>
              </Card>         
          </Layout.Section>        
      </Layout>
  </Page>
);

const actualMarkup = page ? pageMarkup : settingsMarkup;

  return (
    
    <Frame
      navigation={navigationMarkup}
    >
      
        {actualMarkup}
      
                  
    </Frame>
    
  );
}