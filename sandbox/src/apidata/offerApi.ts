// src/api/offerApi.ts
import apiClient from "./apiClient";
import { AddressLocalDTO, CityLocalDto, OfferFormDTO } from "../types/types"; // путь может отличаться
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

// 🔹 Получить список адресов
export const fetchUserLocalAddresses = async (): Promise<AddressLocalDTO[]> => {
  const response =
    await apiClient.get("/api/profile/local-addresses");
  return response.data;
};

// 🔹 Получить  адрес
export const fetchUserPubAddress = async (id: number): Promise<AddressLocalDTO> => {
  const response = await apiClient.get(`/api/profile/pub-addresses/${id}`);
  return response.data;
};

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
export const fetchFilteredOffers_old = async (params: {
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

interface OfferFilterParams {
  productId?: number;
  status?: string;
  other?: boolean;
  page?: number;
  size?: number;
  sort?: string;
  cities?: CityLocalDto[]; // <-- добавлено!
}

export const fetchFilteredOffers = async (params: OfferFilterParams): Promise<{
  content: OfferFormDTO[];
  totalElements: number;
  totalPages: number;
}> => {
  // 🔍 Разделим параметры
  const { productId, status, other, page, size, sort, cities } = params;

  // 📦 Query-параметры (идут в URL)
  const queryParams = {
    productId,
    status,
    other,
    page,
    size,
    sort,
  };

  // 📦 Body-параметры
  const body = {
    cities: cities ?? [], // если undefined — передаем пустой список
  };

  const response: AxiosResponse<any> = await apiClient.post(
    "/api/offers/filter",
    body,
    {
      params: queryParams,
    }
  );

  return response.data;
};


