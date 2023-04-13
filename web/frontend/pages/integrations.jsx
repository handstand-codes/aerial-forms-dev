import { ClientShopify } from "../components";
import { ClientKlaviyo } from "../components";
import { ClientMailchimp } from "../components";

import { Page } from "@shopify/polaris";
 
export default function IntegrationsPage() {

    return (

        <Page title="Integrations">

            <ClientShopify />
            <ClientKlaviyo />
            <ClientMailchimp />
                     
        </Page>
  )}