import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const dialtoneGraphURL = new HttpLink({
  uri: "https://api.studio.thegraph.com/query/37770/dialtone/version/latest",
});

export const dialtoneGraphClient = new ApolloClient({
  link: dialtoneGraphURL,
  cache: new InMemoryCache(),
});
