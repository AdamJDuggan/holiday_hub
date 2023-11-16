const {
  getAllProducts,
  getProductsByPrice,
  getProductById,
  addProduct,
} = require("./products.model");

module.exports = {
  Query: {
    products: getAllProducts,
    productsByPrice: (_, args) => getProductsByPrice(args.min, args.max),
    product: (_, args) => getProductById(args.id),
  },
  Mutation: {
    addProduct: (_, args) => addProduct(args.id, args.description, args.price),
  },
};
