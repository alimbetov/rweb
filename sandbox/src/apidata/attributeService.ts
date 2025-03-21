// src/apidata/attributeService.ts
import apiClient from "./apiClient";
import { Attribute, AttributeValue, AttributeType } from "../types/types";

// === AUTH TOKEN interceptor ===
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

// ==================== АТРИБУТЫ ====================

// Получить все атрибуты
export const fetchAttributes = async (): Promise<Attribute[]> => {
  const response = await apiClient.get("/api/attributes");
  return response.data;
};

// Поиск атрибутов по тексту
export const searchAttributes = async (query: string): Promise<Attribute[]> => {
  const response = await apiClient.get("/api/attributes/search", {
    params: { query },
  });
  return response.data;
};

// Получить атрибут по ID
export const fetchAttributeById = async (id: number): Promise<Attribute> => {
  const response = await apiClient.get(`/api/attributes/${id}`);
  return response.data;
};

// Создать атрибут
export const createAttribute = async (attribute: Attribute): Promise<Attribute> => {
  const response = await apiClient.post("/api/attributes", attribute);
  return response.data;
};

// Обновить атрибут
export const updateAttribute = async (
  id: number,
  attribute: Attribute
): Promise<Attribute> => {
  const response = await apiClient.put(`/api/attributes/${id}`, attribute);
  return response.data;
};

// Удалить атрибут
export const deleteAttribute = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/attributes/${id}`);
};

// Получить атрибуты по типу
export const fetchAttributesByType = async (
  type: AttributeType
): Promise<Attribute[]> => {
  const response = await apiClient.get(`/api/attributes/type/${type}`);
  return response.data;
};

// Получить список типов атрибутов
export const fetchAttributeTypes = async (): Promise<AttributeType[]> => {
  const response = await apiClient.get("/api/attributes/types");
  return response.data;
};

// ==================== ЗНАЧЕНИЯ АТРИБУТОВ ====================

// Получить все значения
export const fetchAttributeValues = async (): Promise<AttributeValue[]> => {
  const response = await apiClient.get("/api/attributes/values");
  return response.data;
};

// Получить значение по ID
export const fetchAttributeValueById = async (id: number): Promise<AttributeValue> => {
  const response = await apiClient.get(`/api/attributes/values/${id}`);
  return response.data;
};

// Получить значения по attributeId

export const fetchAttributeValuesByAttribute = async (
  attributeId: number
): Promise<AttributeValue[]> => {
  const response = await apiClient.get(
    `/api/attributes/values/attribute/${attributeId}` // ✅
  );
  return response.data;
};

// Поиск значений по тексту
export const searchAttributeValues = async (
  query: string
): Promise<AttributeValue[]> => {
  const response = await apiClient.get("/api/attributes/values/search", {
    params: { query },
  });
  return response.data;
};

// Получить только публичные значения
export const fetchPublicAttributeValues = async (): Promise<AttributeValue[]> => {
  const response = await apiClient.get("/api/attributes/values/public");
  return response.data;
};

// Создать значение
export const createAttributeValue = async (
  value: AttributeValue
): Promise<AttributeValue> => {
  const response = await apiClient.post("/api/attributes/values", value);
  return response.data;
};

// Обновить значение
export const updateAttributeValue = async (
  id: number,
  value: AttributeValue
): Promise<AttributeValue> => {
  const response = await apiClient.put(`/api/attributes/values/${id}`, value);
  return response.data;
};

// Удалить значение
export const deleteAttributeValue = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/attributes/values/${id}`);
};
