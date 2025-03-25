import apiClient from "./apiClient";
import { CatalogNodeDto } from "../types/types";


apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Получить дерево каталога
 */
export const fetchCatalogTree = async (): Promise<CatalogNodeDto[]> => {
  const response = await apiClient.get("/api/catalog/tree");
  return response.data;
};
