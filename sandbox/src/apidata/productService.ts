import apiClient from "../apidata/apiClient";
import { Product, Category, SubCategory } from "../types/types";

// 🔹 Автоматическое добавление токена в запросы
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========================== CRUD ТОВАРОВ ==========================

// 🔹 Получить товар по ID
export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await apiClient.get(`/api/products/${id}`);
  return response.data;
};

// 🔹 Создать товар
export const createProduct = async (product: Product): Promise<Product> => {
  const response = await apiClient.post("/api/products", product);
  return response.data;
};

// 🔹 Обновить товар
export const updateProduct = async (
  id: number,
  product: Product
): Promise<Product> => {
  const response = await apiClient.put(`/api/products/${id}`, product);
  return response.data;
};

// 🔹 Удалить товар
export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/products/${id}`);
};

// ========================== ПОИСК С ПАГИНАЦИЕЙ ==========================

// 🔹 Поиск товаров по названию (RU, KZ, EN) с пагинацией
export const searchProductsByName = async (
  query: string,
  page: number = 0,
  size: number = 10
): Promise<{ content: Product[]; totalPages: number }> => {
  const response = await apiClient.get("/api/products/search", {
    params: { query, page, size },
  });
  return response.data;
};

// 🔹 Фильтр товаров по категории и подкатегории с пагинацией
export const filterProducts = async (
  categoryCode?: string,
  subCategoryCode?: string,
  page: number = 0,
  size: number = 10
): Promise<{ content: Product[]; totalPages: number }> => {
  const response = await apiClient.get("/api/products/filter", {
    params: { categoryCode, subCategoryCode, page, size },
  });
  return response.data;
};

// 🔹 Получить все категории
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get("/api/good/category");
  return response.data;
};

// 🔹 Получить все подкатегории
export const fetchSubCategories = async (): Promise<SubCategory[]> => {
  const response = await apiClient.get("/api/good/sub-category");
  return response.data;
};
