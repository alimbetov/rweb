import { Category, CategoryGroup, SubCategory } from "../types/types";
import apiClient from "../apidata/apiClient";

// 🔹 Автоустановка токена перед каждым запросом
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

// ========================== CATEGORY GROUP ==========================

// 🔹 Получить все группы категорий
export const fetchCategoryGroups = async (): Promise<CategoryGroup[]> => {
  const response = await apiClient.get("/api/good/category-group");
  return response.data;
};

// 🔹 Поиск групп категорий
export const searchCategoryGroups = async (
  query: string
): Promise<CategoryGroup[]> => {
  const response = await apiClient.get("/api/good/category-group/search", {
    params: { query },
  });
  return response.data;
};

// 🔹 Создать группу категорий
export const createCategoryGroup = async (
  group: CategoryGroup
): Promise<CategoryGroup> => {
  const response = await apiClient.post("/api/good/category-group", group);
  return response.data;
};

// 🔹 Обновить группу категорий
export const updateCategoryGroup = async (
  code: string,
  group: CategoryGroup
): Promise<CategoryGroup> => {
  const response = await apiClient.put(
    `/api/good/category-group/${code}`,
    group
  );
  return response.data;
};

// 🔹 Удалить группу категорий
export const deleteCategoryGroup = async (code: string): Promise<void> => {
  await apiClient.delete(`/api/good/category-group/${code}`);
};

// ========================== CATEGORY ==========================

// 🔹 Получить все категории
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get("/api/good/category");
  return response.data;
};

// 🔹 Поиск категорий
export const searchCategories = async (query: string): Promise<Category[]> => {
  const response = await apiClient.get("/api/good/category/search", {
    params: { query },
  });
  return response.data;
};

export const searchCategoriesByParentCode = async (
  query: string
): Promise<Category[]> => {
  const response = await apiClient.get("/api/good/category/search-by-parent", {
    params: { query },
  });
  return response.data;
};

// 🔹 Создать категорию
export const createCategory = async (category: Category): Promise<Category> => {
  const response = await apiClient.post("/api/good/category", category);
  return response.data;
};

// 🔹 Обновить категорию
export const updateCategory = async (
  code: string,
  category: Category
): Promise<Category> => {
  const response = await apiClient.put(`/api/good/category/${code}`, category);
  return response.data;
};

// 🔹 Удалить категорию
export const deleteCategory = async (code: string): Promise<void> => {
  await apiClient.delete(`/api/good/category/${code}`);
};

// ========================== SUB CATEGORY ==========================

// 🔹 Получить все подкатегории
export const fetchSubCategories = async (): Promise<SubCategory[]> => {
  const response = await apiClient.get("/api/good/sub-category");
  return response.data;
};

// 🔹 Поиск подкатегорий
export const searchSubCategories = async (
  query: string
): Promise<SubCategory[]> => {
  const response = await apiClient.get("/api/good/sub-category/search", {
    params: { query },
  });
  return response.data;
};

export const searchSubCategoriesByParentCode = async (
  query: string
): Promise<SubCategory[]> => {
  const response = await apiClient.get(
    "/api/good/sub-category/search-by-parent",
    { params: { query } }
  );
  return response.data;
};

// 🔹 Создать подкатегорию
export const createSubCategory = async (
  subCategory: SubCategory
): Promise<SubCategory> => {
  const response = await apiClient.post("/api/good/sub-category", subCategory);
  return response.data;
};

// 🔹 Обновить подкатегорию
export const updateSubCategory = async (
  code: string,
  subCategory: SubCategory
): Promise<SubCategory> => {
  const response = await apiClient.put(
    `/api/good/sub-category/${code}`,
    subCategory
  );
  return response.data;
};

// 🔹 Удалить подкатегорию
export const deleteSubCategory = async (code: string): Promise<void> => {
  await apiClient.delete(`/api/good/sub-category/${code}`);
};
