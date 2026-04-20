"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_PRODUCT } from "../graphql/mutations/productMutations";

export default function AddProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

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
    setFormError(null);

    if (!name.trim()) {
      setFormError("Name is required");
      return;
    }

    const parsedPrice = parseFloat(price);

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setFormError("Price must be a valid positive number");
      return;
    }

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
    <form style={{ marginBottom: "16px" }} onSubmit={handleSubmit}>
      <h3>Add Product</h3>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <input
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            flex: 1,
          }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
      </div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <input
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            flex: 1,
          }}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
          required
        />
      </div>
      <button
        style={{
          padding: "8px 12px",
          borderRadius: "6px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        type="submit"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
      {formError && <p style={{ color: "red" }}>{formError}</p>}
      {error && <p>Error adding product</p>}
    </form>
  );
}
