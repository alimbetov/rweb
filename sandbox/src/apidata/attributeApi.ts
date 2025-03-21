// src/api/attributeApi.ts
import apiClient from "./apiClient";
import { Attribute, AttributeValue } from "../types/types";

// ========================== ATTRIBUTES ==========================

// 🔹 Получить все атрибуты
export const fetchAttributes = async (): Promise<Attribute[]> => {
  const response = await apiClient.get("/api/attributes");
  return response.data;
};

// 🔹 Поиск атрибутов
export const searchAttributes = async (query: string): Promise<Attribute[]> => {
  const response = await apiClient.get("/api/attributes/search", {
    params: { query },
  });
  return response.data;
};

// 🔹 Получить атрибут по коду
export const getAttributeByCode = async (code: string): Promise<Attribute> => {
  const response = await apiClient.get(`/api/attributes/${code}`);
  return response.data;
};

// 🔹 Создать атрибут
export const createAttribute = async (
  attribute: Attribute
): Promise<Attribute> => {
  const response = await apiClient.post("/api/attributes", attribute);
  return response.data;
};

// 🔹 Обновить атрибут
export const updateAttribute = async (
  code: string,
  attribute: Attribute
): Promise<Attribute> => {
  const response = await apiClient.put(`/api/attributes/${code}`, attribute);
  return response.data;
};

// 🔹 Удалить атрибут
export const deleteAttribute = async (code: string): Promise<void> => {
  await apiClient.delete(`/api/attributes/${code}`);
};

// ========================== ATTRIBUTE VALUES ==========================

// 🔹 Получить все значения атрибута по коду
export const fetchAttributeValuesByAttributeCode = async (
  attributeCode: string
): Promise<AttributeValue[]> => {
  const response = await apiClient.get(
    `/api/attributes/${attributeCode}/values`
  );
  return response.data;
};
export const fetchAttributeValuesByAttributeId = async (attributeId: number): Promise<AttributeValue[]> => {
  const response = await apiClient.get(`/api/attributes/values/attribute/${attributeId}`);
  return response.data;
};
// 🔹 Создать значение атрибута
export const createAttributeValue = async (
  attributeCode: string,
  value: AttributeValue
): Promise<AttributeValue> => {
  const response = await apiClient.post(
    `/api/attributes/${attributeCode}/values`,
    value
  );
  return response.data;
};

// 🔹 Обновить значение атрибута
export const updateAttributeValue = async (
  id: number,
  value: AttributeValue
): Promise<AttributeValue> => {
  const response = await apiClient.put(`/api/attribute-values/${id}`, value);
  return response.data;
};

// 🔹 Удалить значение атрибута
export const deleteAttributeValue = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/attribute-values/${id}`);
};

