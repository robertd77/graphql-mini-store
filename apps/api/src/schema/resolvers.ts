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

    deleteProduct: (_: any, args: { id: string }) => {
      const index = products.findIndex((p) => p.id === args.id);
      if (index === -1) return null;
      products.splice(index, 1);
      return args.id;
    },

    updateProduct: (
      _: any,
      args: { id: string; name?: string; price?: number },
    ) => {
      const product = products.find((p) => p.id === args.id);
      if (!product) return null;
      if (args.name !== undefined) product.name = args.name;
      if (args.price !== undefined) product.price = args.price;
      return product;
    },
  },
};
