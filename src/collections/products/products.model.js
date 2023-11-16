const products = [
  { id: "redshoe", description: "Red shoe", price: 42.1, reviews: [] },
  { id: "bluegean", description: "Blue Jeans", price: 54.1, reviews: [] },
];

const getAllProducts = () => products;

const getProductsByPrice = (min, max) =>
  products.filter((p) => p.price > min && p.price < max);

const getProductById = (id) => products.find((p) => p.id === id);

const addProduct = (id, description, price) => {
  const product = { id, description, price, reviews: [] };
  products.push(product);
  return product;
};

module.exports = {
  getAllProducts,
  getProductsByPrice,
  getProductById,
  addProduct,
};
