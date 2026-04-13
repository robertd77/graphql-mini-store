"use client";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { Product } from "@repo/types";

const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
    }
  }
`;

export function ProductList() {
  const { data, loading } = useQuery<{ products: Product[] }>(GET_PRODUCTS);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {data?.products.map((p) => (
        <div key={p.id}>
          {p.name} - ${p.price}
        </div>
      ))}
    </>
  );
}
