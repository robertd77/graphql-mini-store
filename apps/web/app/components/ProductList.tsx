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
  const [error, setError] = useState<string | null>(null);

  const [deleteProduct, { loading: deleting }] = useMutation(DELETE_PRODUCT, {
    update(cache, { data }) {
      const deletedId = data?.deleteProduct;

      cache.modify({
        fields: {
          products(existingProducts = [], { readField }) {
            return existingProducts.filter(
              (p: any) => readField("id", p) !== deletedId,
            );
          },
        },
      });
    },
  });

  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT);

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
    setError(null);

    if (!editName.trim()) {
      setError("Name is required");
      return;
    }

    const price = parseFloat(editPrice);

    if (isNaN(price) || price < 0) {
      setError("Price must be a valid positive number");
      return;
    }

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
                required
              />
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                placeholder="Price"
                required
              />
              <button onClick={() => handleSave(p.id)}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            <>
              <span>
                {p.name} - ${p.price}
              </span>

              <button disabled={deleting} onClick={() => handleEdit(p)}>
                Edit
              </button>
              <button disabled={updating} onClick={() => handleDelete(p.id)}>
                Delete
              </button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </>
          )}
        </div>
      ))}
    </>
  );
}
