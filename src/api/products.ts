import { api } from "./client";

type CategoryResponse = {
  "slug": string,
  "name": string,
  "url": string
}

export async function getProducts() {
  const { data } = await api.get("/products");
  return data;
}

export async function getCategories() {
  const { data } = await api.get("/products/categories");
  return data as CategoryResponse[];
}

export async function getProductsByCategory(category: string) {
  const { data } = await api.get(`/products/category/${encodeURIComponent(category)}`);
  return data;
}

export async function deleteProduct(id: number) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
