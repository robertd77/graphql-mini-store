import { products } from "../data/products";

export const resolvers = {
  Query: {
    products: () => products,
    product: (_: any, args: { id: string }) =>
      products.find((p) => p.id === args.id),
  },
  Mutation: {
    addProduct: (_: any, args: any) => {
      const newProduct = {
        id: String(products.length + 1),
        ...args,
      };
      products.push(newProduct);
      return newProduct;
    },
  },
};
