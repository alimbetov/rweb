import { CityCoordinates } from "../types/types";
import apiClient from "./apiClient";

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

// ======================= 📍 Координаты города =======================

// 🔹 Получить координаты по коду города
export const fetchCityCoordinates = async (
  cityCode: string
): Promise<CityCoordinates> => {
  try {
    const response = await apiClient.get(`/api/geo/cities/${cityCode}/coordinates`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      // нет координат — не ошибка, можно указать вручную
      throw new Error("not_found");
    }
    throw error;
  }
};

// 🔹 Создать / обновить координаты
export const saveCityCoordinates = async (
  cityCode: string,
  coordinates: CityCoordinates
): Promise<CityCoordinates> => {
  const response = await apiClient.post(
    `/api/geo/cities/${cityCode}/coordinates`,
    coordinates
  );
  return response.data;
};

// 🔹 Удалить координаты
export const deleteCityCoordinates = async (cityCode: string): Promise<void> => {
  await apiClient.delete(`/api/geo/cities/${cityCode}/coordinates`);
};