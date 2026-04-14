import { gql } from "apollo-server";

export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    addProduct(name: String!, price: Float!): Product!
  }

  type Mutation {
    deleteProduct(id: ID!): ID
  }

  type Mutation {
    updateProduct(id: ID!, name: String, price: Float): Product
  }
`;
