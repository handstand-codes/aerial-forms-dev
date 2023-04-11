import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./routes/Routes";

import {
  AppType,
  Provider as GadgetProvider,
  useGadget,
} from "@gadgetinc/react-shopify-app-bridge";

import { api } from "./api";

import { PolarisProvider } from "./components";

/**
  Gadget's Provider takes care of App Bridge authentication, you do not need Shopify's default AppBridgeProvider.
*/
export default function App() {
  return (
    <GadgetProvider
      type={AppType.Embedded}
      shopifyApiKey={process.env["SHOPIFY_API_KEY"]}
      api={api}
    >
      <PolarisProvider>
        <BrowserRouter>
          <EmbeddedApp />
        </BrowserRouter>
      </PolarisProvider>
    </GadgetProvider>
  );
}

// This is where we make sure we have auth'd with AppBridge
// Once we have authenticated, we can render our app!
// Feel free to use the default page navigation that Shopify's CLI sets up for you
// example here - https://gituhb.com/gadget-inc/examples/blob/main/packages/shopify-cli-embedded/web/frontend/App.jsx
function EmbeddedApp() {
  // we use `isAuthenticated` to render pages once the OAuth flow is complete!
  const { isAuthenticated } = useGadget();

  // console.log(isAuthenticated)

  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  return isAuthenticated ? (
    <>
    <NavigationMenu
        navigationLinks={[
          {
            label: "Submissions",
            destination: "/",
          },
          {
            label: "Integrations",
            destination: "/integrations",
          },
          {
            label: "Settings",
            destination: "/settings",
          },
        ]}
      />
    <Routes pages={pages} />
  </>
  ) : (
    <span>Authenticating...</span>
  );
}