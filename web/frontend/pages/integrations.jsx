import { 
    ClientShopify,
    ClientKlaviyo,
    ClientMailchimp,
    ClientHubspot,
    ClientDrip,
    ClientZoho
} from "../components";

import { Page } from "@shopify/polaris";
 
export default function IntegrationsPage() {

    return (

        <Page title="Integrations">

            <ClientShopify />
            <ClientKlaviyo />
            <ClientZoho />
            <ClientMailchimp />
            <ClientHubspot />
            <ClientDrip />
                   
        </Page>
  )}