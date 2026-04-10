import API from "./api";

export const getAllCategories = async () => {
  const { data } = await API.get("/categories");
  return data.categories;
};

export const createCategory = async (categoryData) => {
  const { data } = await API.post("/admin/category/create", categoryData);
  return data.category;
};

export const updateCategory = async (id, categoryData) => {
  const { data } = await API.put(`/admin/category/${id}`, categoryData);
  return data.category;
};

export const deleteCategory = async (id) => {
  const { data } = await API.delete(`/admin/category/${id}`);
  return id;
};
