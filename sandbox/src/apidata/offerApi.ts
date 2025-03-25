// src/api/offerApi.ts
import apiClient from "./apiClient";
import { OfferFormDTO } from "../types/types"; // путь может отличаться
import { AxiosResponse } from "axios";


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
 * 🔁 Генерация нового оффера (POST /api/offers/generate)
 */
export const generateOfferForm = async (productId: number): Promise<OfferFormDTO> => {
  const response: AxiosResponse<OfferFormDTO> = await apiClient.post(
    "/api/offers/generate",
    null,
    {
      params: { productId },
    }
  );
  return response.data;
};

/**
 * 💾 Обновление оффера (PUT /api/offers/update)
 */
export const updateOfferForm = async (offer: OfferFormDTO): Promise<OfferFormDTO> => {
  const response: AxiosResponse<OfferFormDTO> = await apiClient.put(
    "/api/offers/update",
    offer
  );
  return response.data;
};

/**
 * 📥 Получение офферов с фильтрацией (GET /api/offers/filter)
 */
export const fetchFilteredOffers = async (params: {
  productId?: number;
  status?: string;
  other?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}): Promise<{
  content: OfferFormDTO[];
  totalElements: number;
  totalPages: number;
}> => {
  const response = await apiClient.get("/api/offers/filter", { params });
  return response.data;
};