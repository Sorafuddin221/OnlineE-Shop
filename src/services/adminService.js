import API from "./api";

export const getAdminProducts = async () => {
  const { data } = await API.get("/admin/products");
  return data.products;
};

export const getDashboardStats = async () => {
  const { data } = await API.get("/admin/dashboard");
  return data;
};

export const getAllOrders = async () => {
  const { data } = await API.get("/admin/orders");
  return data;
};

export const getAllUsers = async () => {
  const { data } = await API.get("/admin/users");
  return data.users;
};

export const getInquiries = async () => {
  const { data } = await API.get("/admin/inquiry");
  return data.inquiries;
};

export const updateInquiryStatus = async (id, status, response) => {
  const { data } = await API.patch("/admin/inquiry", { id, status, response });
  return data;
};

export const deleteInquiry = async (id) => {
  const { data } = await API.delete(`/admin/inquiry?id=${id}`);
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await API.put(`/admin/order/${id}`, { status });
  return data;
};

export const deleteOrder = async (id) => {
  const { data } = await API.delete(`/admin/order/${id}`);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await API.put(`/admin/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await API.delete(`/admin/users/${id}`);
  return data;
};

export const getNewsletterSubscribers = async () => {
  const { data } = await API.get("/admin/newsletter");
  return data.subscribers;
};

export const deleteSubscriber = async (id) => {
  const { data } = await API.delete(`/admin/newsletter?id=${id}`);
  return data;
};
