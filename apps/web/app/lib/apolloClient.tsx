"use client";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider,
} from "@apollo/client";
import { ReactNode } from "react";

const link = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

export default function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
