import { 
    Layout, 
    Card,  
    Page,
    Frame,
    Navigation, 
    TextField,
    Button,
    Icon
} from "@shopify/polaris";

import {
    ImportMinor,
    SettingsMinor,
    ClipboardMinor,
  } from '@shopify/polaris-icons';

import Clipboard from 'react-clipboard.js';


export default function SettingsPage() {


// NAV Markup

const navigationMarkup = (
    <Navigation location="/settings">
      <Navigation.Section
                  items={[
                      {
                        url: 'https://admin.shopify.com/store/gadget-app-test-2/apps/email-getter-v7',
                        selected: false,
                        label: 'Submissions',
                        icon: ImportMinor,                 
                      },
                      {
                        url: '/',
                        selected: true,
                        label: 'Settings',
                        icon: SettingsMinor,                 
                        }
                  ]} />
    </Navigation> 
);
      
const pageMarkup = (
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


    return (

        <Frame
            navigation={navigationMarkup}
        >
        {pageMarkup}                   
        </Frame>

    )

}