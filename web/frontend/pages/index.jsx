import { 
  Page,
  Card,
  Layout,
  TextContainer,
  Heading,
  Stack,
  Spinner,
  Button,
  DataTable,
  LegacyCard,
} from "@shopify/polaris";

import { TitleBar, useNavigate } from "@shopify/app-bridge-react";
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";


export default function HomePage() {
  const navigate = useNavigate();
  
  const [emailRecords] = useFindMany(api.email, {
    select: {
      __typename: true,
      id: true,
      submitEmail: true,
      createdAt: true,
    },
  });

  console.log(emailRecords)

  const onCreateNewEmail = () => {
    navigate("/create-new-email");
  };
  
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

      <TitleBar
        title="Email List"
      />
      <Stack sectioned alignment="center" distribution="equalSpacing">
        <TextContainer spacing="loose">
          <p>Customer Information</p>
        </TextContainer>
        <Button primary fullWidth onClick={() => onCreateNewEmail()}>
          Create new email
        </Button>
      </Stack>

      <Layout>
        <Layout.Section>
          <Heading>Customer Emails</Heading>
            
          <Card.Section>
              {emailRecords.data.length > 0 ? (
                emailRecords.data.map((email, i) => {
                  return (
                    
                    <LegacyCard key={i} sectioned subdued>
                      
                        <DataTable
                          columnContentTypes={[
                            "text",
                          ]}
                          headings={[
                            "Email Address:",
                          ]}
                          rows={email.submitEmail}
                          />

                    </LegacyCard>
                  )})
              ):(
                <Card subdued sectioned>
                  <Stack distribution="center">
                    <p>No customer emails</p>
                  </Stack>
                </Card>
              )}
          </Card.Section>
        </Layout.Section>        
      </Layout>

    </Page>
  );
}