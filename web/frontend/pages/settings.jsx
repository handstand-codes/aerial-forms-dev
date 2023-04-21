import { useState, useCallback } from "react";

import { 
    Page,
    Layout,
    LegacyCard,
    Button,
    LegacyStack,
    TextField,
    Icon,
    FormLayout,
    Banner,
    Inline
  } from "@shopify/polaris";
  
import {
    ClipboardMinor,
    CircleInformationMajor
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

        <LegacyCard title="Settings">
                <LegacyCard.Section>
                    <Inline align="space-between" blockAlign="center" gap="4">
                        
                        <LegacyStack title="Display the bundle on a page" sectioned>
                            <p>Copy this code and paste it on the pages where you want to show this bundle.</p>
                        </LegacyStack>
                        <Button
                            alignment="right"
                            plain
                            icon={CircleInformationMajor}
                            accessibilityLabel="Learn more"
                            url="https://handstand.helpscoutdocs.com/article/9-how-to-embed-aerial-forms-using-code-snippet"
                            target="_blank" 
                        />
                        
                    </Inline>
                </LegacyCard.Section>
                <LegacyCard.Section>
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
                        {bannerMarkup}   
                </LegacyCard.Section>  
                            
        </LegacyCard>   

    )
}