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
  
  

export default function CreateNewQuizPage() {

    return (

        <Page>
            <Layout>
                <Layout.Section>
                    <Card title="Display the bundle on a page" sectioned>
                        <p>Copy this code and paste it on the pages where you want to show this bundle.</p>
                        <TextField 
                        readOnly 
                        value="code goes here"
                        connectedRight=
                            {
                            <Clipboard data-clipboard-text="code goes here">
                                <Icon source={ClipboardMinor}/>
                            </Clipboard>
                            }
                        />
                    </Card>         
                </Layout.Section>        
            </Layout>
        </Page>

    )

}