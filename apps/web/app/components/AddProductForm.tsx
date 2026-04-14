"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_PRODUCT } from "../graphql/mutations/productMutations";

export default function AddProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [addProduct, { loading, error }] = useMutation(ADD_PRODUCT, {
    update(cache, { data: { addProduct } }) {
      cache.modify({
        fields: {
          products(existingProducts = []) {
            return [...existingProducts, addProduct];
          },
        },
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addProduct({
      variables: {
        name,
        price: parseFloat(price),
      },
    });

    setName("");
    setPrice("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Product</h3>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />

      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        type="number"
      />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Product"}
      </button>

      {error && <p>Error adding product</p>}
    </form>
  );
}
