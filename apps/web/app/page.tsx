import { ProductList } from "@/app/components/ProductList";
import AddProductForm from "./components/AddProductForm";

export default function Page() {
  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h1>Product Manager</h1>
      <AddProductForm />
      <ProductList />
    </div>
  );
  return;
}
