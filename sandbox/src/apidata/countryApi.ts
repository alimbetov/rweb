import { Country, City } from "../types/types";
import apiClient from "../apidata/apiClient";

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
// === Вызовы API для стран ===
export const fetchCountries = async (): Promise<Country[]> => {
  const response = await apiClient.get("/api/geo/countries");
  return response.data;
};

export const fetchCountry = async (countryCode: string): Promise<Country> => {
  const response = await apiClient.get(`/api/geo/countries/${countryCode}`);
  return response.data;
};

export const createCountry = async (country: Country): Promise<Country> => {
  const response = await apiClient.post("/api/geo/countries", country);
  return response.data;
};

export const updateCountry = async (
  countryCode: string,
  country: Country
): Promise<Country> => {
  const response = await apiClient.put(
    `/api/geo/countries/${countryCode}`,
    country
  );
  return response.data;
};

export const deleteCountry = async (countryCode: string): Promise<void> => {
  await apiClient.delete(`/api/geo/countries/${countryCode}`);
};
export const searchCountries = async (query: string): Promise<Country[]> => {
  const response = await apiClient.get(`/api/geo/countries/search`, {
    params: { query },
  });
  return response.data;
};

// === Вызовы API для городов ===

export const fetchCities = async (): Promise<City[]> => {
  const response = await apiClient.get("/api/geo/cities");
  return response.data;
};

export const fetchCitiesByCountry = async (
  countryCode: string
): Promise<City[]> => {
  const response = await apiClient.get(
    `/api/geo/cities/country/${countryCode}`
  );
  return response.data;
};

export const fetchCity = async (cityCode: string): Promise<City> => {
  const response = await apiClient.get(`/api/geo/cities/${cityCode}`);
  return response.data;
};

export const createCity = async (city: City): Promise<City> => {
  const response = await apiClient.post("/api/geo/cities", city);
  return response.data;
};

export const updateCity = async (
  cityCode: string,
  city: City
): Promise<City> => {
  const response = await apiClient.put(`/api/geo/cities/${cityCode}`, city);
  return response.data;
};

export const deleteCity = async (cityCode: string): Promise<void> => {
  await apiClient.delete(`/api/geo/cities/${cityCode}`);
};

export const searchCities = async (query: string): Promise<City[]> => {
  const response = await apiClient.get(`/api/geo/cities/search`, {
    params: { query },
  });
  return response.data;
};
