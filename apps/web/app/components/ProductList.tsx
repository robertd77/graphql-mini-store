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

  const buttonStyle = {
    marginLeft: "8px",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    cursor: "pointer",
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {data?.products.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {editingId === p.id ? (
            <>
              <div
                style={{ display: "flex", gap: "8px", marginBottom: "16px" }}
              >
                <input
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    flex: 1,
                  }}
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Product name"
                  required
                />
              </div>
              <div
                style={{ display: "flex", gap: "8px", marginBottom: "16px" }}
              >
                <input
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    flex: 1,
                  }}
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="Price"
                  required
                />
              </div>
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: "#22c55e",
                  color: "white",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                onClick={() => handleSave(p.id)}
              >
                Save
              </button>
              <button style={buttonStyle} onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 500 }}>
                  {p.name} - ${p.price}
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={buttonStyle}
                  disabled={deleting}
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  style={{ ...buttonStyle, color: "red" }}
                  disabled={updating}
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </>
          )}
        </div>
      ))}
    </>
  );
}
