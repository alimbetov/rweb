import apiClient from "../apidata/apiClient";
import { Attribute, AttributeValue, AttributeType } from "../types/types";

// === Работа с атрибутами ===
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

// Создать новый атрибут
export const createAttribute = async (
  attribute: Attribute
): Promise<Attribute> => {
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

// === Работа со значениями атрибутов ===

// Получить все значения атрибутов
export const fetchAttributeValues = async (): Promise<AttributeValue[]> => {
  const response = await apiClient.get("/api/attributes/values");
  return response.data;
};

// Получить значение атрибута по ID
export const fetchAttributeValueById = async (
  id: number
): Promise<AttributeValue> => {
  const response = await apiClient.get(`/api/attributes/values/${id}`);
  return response.data;
};

// Создать значение атрибута
export const createAttributeValue = async (
  attributeValue: AttributeValue
): Promise<AttributeValue> => {
  const response = await apiClient.post(
    "/api/attributes/values",
    attributeValue
  );
  return response.data;
};

// Обновить значение атрибута
export const updateAttributeValue = async (
  id: number,
  attributeValue: AttributeValue
): Promise<AttributeValue> => {
  const response = await apiClient.put(
    `/api/attributes/values/${id}`,
    attributeValue
  );
  return response.data;
};

// Удалить значение атрибута
export const deleteAttributeValue = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/attributes/values/${id}`);
};

// Найти значения атрибута по `attributeId`
export const fetchAttributeValuesByAttribute = async (
  attributeId: number
): Promise<AttributeValue[]> => {
  const response = await apiClient.get(
    `/api/attributes/values/attribute/${attributeId}`
  );
  return response.data;
};

// Поиск значений по подстроке
export const searchAttributeValues = async (
  query: string
): Promise<AttributeValue[]> => {
  const response = await apiClient.get("/api/attributes/values/search", {
    params: { query },
  });
  return response.data;
};

// Получить публичные значения
export const fetchPublicAttributeValues = async (): Promise<
  AttributeValue[]
> => {
  const response = await apiClient.get("/api/attributes/values/public");
  return response.data;
};
