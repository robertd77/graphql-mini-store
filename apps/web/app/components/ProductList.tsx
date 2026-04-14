"use client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";
import type { Product } from "@repo/types";
import { GET_PRODUCTS } from "../graphql/queries/productQueries";
import { DELETE_PRODUCT } from "../graphql/mutations/productMutations";
import { UPDATE_PRODUCT } from "../graphql/mutations/productMutations";

export function ProductList() {
  const { data, loading } = useQuery<{ products: Product[] }>(GET_PRODUCTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
    awaitRefetchQueries: true,
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
    awaitRefetchQueries: true,
  });

  const handleDelete = (id: string) => {
    deleteProduct({
      variables: { id },
    }).catch((err) => {
      console.error("Error deleting product:", err);
    });
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice(String(product.price));
  };

  const handleSave = (id: string) => {
    updateProduct({
      variables: {
        id,
        name: editName,
        price: parseFloat(editPrice),
      },
    });
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {data?.products.map((p) => (
        <div key={p.id} style={{ marginBottom: "10px" }}>
          {editingId === p.id ? (
            <>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Product name"
              />
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                placeholder="Price"
              />
              <button onClick={() => handleSave(p.id)}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            <>
              <span onClick={() => handleEdit(p)}>
                {p.name} - ${p.price}
              </span>
              <button onClick={() => handleEdit(p)}>Edit</button>
              <button onClick={() => handleDelete(p.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </>
  );
}
