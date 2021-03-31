import { ChakraProvider } from "@chakra-ui/react";
import { createClient, Provider } from "urql";

import { AppProps } from "next/app";
import { DarkModeSwitch } from "../components/DarkModeSwitch";

import theme from "../theme";

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include", // for cookies stuff
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <DarkModeSwitch>
          <Component {...pageProps} />
        </DarkModeSwitch>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
