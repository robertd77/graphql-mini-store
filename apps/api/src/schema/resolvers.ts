import { products } from "../data/products";

export const resolvers = {
  Query: {
    products: () => products,
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
