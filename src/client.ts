import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_API_URL,
  headers: { authorization: process.env.REACT_APP_GRAPHQL_API_TOKEN }
});

export default client;
