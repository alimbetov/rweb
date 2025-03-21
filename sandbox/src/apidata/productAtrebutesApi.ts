import apiClient from "../apidata/apiClient";
import { Product, Attribute, ProductAttributeDTO } from "../types/types";

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

// === Работа с продуктами ===

// 🔹 Получить продукт с его атрибутами
export const fetchProductById = async (productId: number): Promise<Product> => {
  const response = await apiClient.get(
    `/api/product-attributes/product/${productId}`
  );
  return response.data;
};

// 🔹 Получить товар по ID
export const fetchProductByproductId = async (id: number): Promise<Product> => {
  const response = await apiClient.get(`/api/products/${id}`);
  return response.data;
};

// 🔹 Получить все атрибуты продукта (возвращает `ProductAttributeDTO[]`)
export const fetchProductAttributesByProductId = async (
  productId: number,
  attributeId?: number
): Promise<ProductAttributeDTO[]> => {
  const response = await apiClient.get(`/api/product-attributes/${productId}`, {
    params: attributeId ? { attributeId } : {},
  });
  return response.data;
};

// 🔹 Получить связанные/несвязанные атрибуты (возвращает `Attribute[]`)
export const fetchProductAttributesList = async (
  productId: number,
  isBounded: boolean
): Promise<Attribute[]> => {
  const response = await apiClient.get(`/api/product-attributes/attributes`, {
    params: { productId, isBounded },
  });
  return response.data;
};

// 🔹 Получить список атрибутов продукта (по `isBounded`)
export const fetchAttributeDTOList = async (
  productId: number,
  isBounded: boolean
): Promise<Attribute[]> => {
  const response = await apiClient.get(`/api/product-attributes/attributes`, {
    params: { productId, isBounded },
  });
  return response.data;
};

// 🔹 Привязать атрибут к продукту
export const bindAttributeToProduct = async (
  productId: number,
  attributeId: number
): Promise<ProductAttributeDTO[]> => {
  const response = await apiClient.post(`/api/product-attributes/bind`, null, {
    params: { productId, attributeId },
  });
  return response.data;
};

// 🔹 Отвязать атрибут от продукта
export const unbindAttributeFromProduct = async (
  productId: number,
  attributeId: number
): Promise<ProductAttributeDTO[]> => {
  const response = await apiClient.delete(`/api/product-attributes/unbind`, {
    params: { productId, attributeId },
  });
  return response.data;
};
