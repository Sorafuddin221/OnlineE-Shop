import API from "./api";

export const getProducts = async ({ keyword = "", page = 1, category = "", sort = "", price = null }) => {
  let link = `/products?page=${page}`;
  if (category) link += `&category=${category}`;
  if (keyword) link += `&keyword=${keyword}`;
  if (sort) link += `&sort=${sort}`;
  
  if (price) {
    if (price.gte) link += `&price[gte]=${price.gte}`;
    if (price.lte) link += `&price[lte]=${price.lte}`;
  }
  
  const { data } = await API.get(link);
  return data;
};

export const getTrendingProducts = async () => {
  const { data } = await API.get("/products/trending");
  return data;
};

export const getProductDetails = async (id) => {
  const { data } = await API.get(`/product/${id}`);
  return data;
};

export const createReview = async (reviewData) => {
  const { data } = await API.put("/review", reviewData);
  return data;
};
