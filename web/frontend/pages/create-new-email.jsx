import { api } from "../api";
import { useAction } from "@gadgetinc/react";

import { Layout, Card, Stack, Spinner, Banner, Page } from "@shopify/polaris";
import { EmailForm } from "../components";
import { useCallback } from "react";
import { useNavigate } from "@shopify/app-bridge-react";


export default function CreateNewQuizPage() {
  const navigate = useNavigate();

  const [createEmailResponse, createEmail] = useAction(api.email.create);

  const saveEmail = useCallback(
    async (emailName) => {

      const email = {
        submitEmail: emailName,
        
      };

      await createEmail({ email });
    }
  );

  if (createEmailResponse.fetching || createEmailResponse.data) {
    if (createEmailResponse.data) {
      navigate("/");
    }

    return (
      <Page>
        <Layout sectioned>
          <Layout.Section>
            <Card sectioned title="Create a new customer email">
              <Stack alignment="center">
                <Spinner /> <span>Saving customer email...</span>
              </Stack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page>
      <Layout sectioned>
        <Layout.Section>
          {createEmailResponse.error && (
            <Banner title="Error on email creation" status="critical">
              <p>{createEmailResponse.error.message}</p>
            </Banner>
          )}
          <Card sectioned title="Create a new customer email">
            <EmailForm onSave={saveEmail} />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
