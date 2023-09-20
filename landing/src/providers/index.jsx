import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ThemeProvider } from "../../../site/src/context/theme";

const client = new ApolloClient({
  uri: import.meta.env.VITE_APP_ECOSYSTEM_API_END_POINT,
  cache: new InMemoryCache(),
});

export default function Providers({ children }) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider>{children}</ThemeProvider>
    </ApolloProvider>
  );
}
