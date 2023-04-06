import { 
    Page,
    Layout,
    Card,
    TextField,
    Icon,
    
  } from "@shopify/polaris";
  
import {
    ClipboardMinor,
  } from '@shopify/polaris-icons';
  
import Clipboard from 'react-clipboard.js';
  
export default function SettingsPage() {

    return (

        <Page>
            <Layout>
                <Layout.Section>
                    <Card title="Display the bundle on a page" sectioned>
                        <p>Copy this code and paste it on the pages where you want to show this bundle.</p>
                        <br/>
                        
                        <TextField 
                        readOnly
                        value="<div class='aerialForms'></div>"
                        connectedRight=
                            {
                            
                        
                            <Clipboard data-clipboard-text="<div class='aerialForms'></div>">
                                
                                    <Icon source={ClipboardMinor}/>
                                
                            </Clipboard>
                            
                            }
                        />
                        
                        <br/>
                    </Card>         
                </Layout.Section>        
            </Layout>
        </Page>

    )
}