import { useState, useCallback } from "react";

import { 
    Page,
    Layout,
    Card,
    TextField,
    Icon,
    FormLayout,
    Banner,
  } from "@shopify/polaris";
  
import {
    ClipboardMinor,
  } from '@shopify/polaris-icons';
  
import Clipboard from 'react-clipboard.js';

  
export default function SettingsPage() {

    const [showBanner, setShowBanner] = useState(false)

    const bannerMarkup = (
        showBanner ? (
        <Banner
            title="Copied!"
            status="success"
            onDismiss={() => setShowBanner(false)}
        >
        </Banner>
        ):( null )

    )
    
    return (

        <Page title="Settings">
            <Layout>
                <Layout.Section>
                    <Card title="Display the bundle on a page" sectioned>
                        <p>Copy this code and paste it on the pages where you want to show this bundle.</p>
                        <br/>
                        <div>
                            <FormLayout>
                        <TextField
                        readOnly
                        value="<div class='aerialForms'></div>"
                        connectedRight=
                            {
                                <Clipboard 
                                    data-clipboard-text="<div class='aerialForms'></div>"
                                    button-title="I'm a tooltip"
                                    className="Polaris-Button"
                                    onClick={() => setShowBanner(true)}
                                >                                        
                                    <Icon source={ClipboardMinor}/>  
                                      
                                </Clipboard>
                            }
                        />
                        </FormLayout>
                        </div>
                        <br/>
                       
                        {bannerMarkup} 
                      
                    </Card>         
                </Layout.Section>        
            </Layout>
        </Page>

    )
}