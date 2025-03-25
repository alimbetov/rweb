import apiClient from "../apidata/apiClient";
import {
  ProfileDTO,
  PhoneContactDTO,
  AddressDTO,
  LanguageDTO,
  CurrencyDTO,
  CityLocalDto,
  AddressCoordinatesDTO,
  CountryLocalDto,
} from "../types/types";

// 🔹 Автоматическое добавление токена в заголовок Authorization
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

// ========================== 📌 Профиль ==========================

// 🔹 Получить профиль пользователя
export const fetchUserProfile = async (): Promise<ProfileDTO> => {
  const response = await apiClient.get("/api/profile");
  return response.data;
};

// 🔹 Обновить профиль пользователя
export const updateUserProfile = async (
  profile: ProfileDTO
): Promise<ProfileDTO> => {
  const response = await apiClient.put("/api/profile", profile);
  return response.data;
};

// ========================== 🌐 Языки и Валюты ==========================

// 🔹 Получить список языков
export const fetchLanguages = async (): Promise<LanguageDTO[]> => {
  const response = await apiClient.get("/api/profile/languages");
  return response.data;
};

// 🔹 Получить список валют
export const fetchCurrencies = async (): Promise<CurrencyDTO[]> => {
  const response = await apiClient.get("/api/profile/currencies");
  return response.data;
};

// ========================== 📞 Телефоны ==========================

// 🔹 Получить список телефонов пользователя
export const fetchUserPhones = async (): Promise<PhoneContactDTO[]> => {
  const response = await apiClient.get("/api/profile/phones");
  return response.data;
};

// 🔹 Добавить телефон
export const addUserPhone = async (
  phone: PhoneContactDTO
): Promise<PhoneContactDTO> => {
  const response = await apiClient.post("/api/profile/phones", phone);
  return response.data;
};

// 🔹 Обновить телефон
export const updateUserPhone = async (
  id: number,
  phone: PhoneContactDTO
): Promise<PhoneContactDTO> => {
  const response = await apiClient.put(`/api/profile/phones/${id}`, phone);
  return response.data;
};

// 🔹 Удалить телефон
export const deleteUserPhone = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/profile/phones/${id}`);
};

// ========================== 🏠 Адреса ==========================

// 🔹 Получить список адресов
export const fetchUserAddresses = async (): Promise<AddressDTO[]> => {
  const response = await apiClient.get("/api/profile/addresses");
  return response.data;
};

// 🔹 Получить список городов
export const fetchCities = async (): Promise<CityLocalDto[]> => {
  const response = await apiClient.get("/api/profile/cities");
  return response.data;
};

export const fetchCountries = async (): Promise<CountryLocalDto[]> => {
  const response = await apiClient.get("/api/profile/countries");
  return response.data;
};


// 🔹 Добавить адрес
export const addUserAddress = async (
  address: AddressDTO
): Promise<AddressDTO> => {
  const response = await apiClient.post("/api/profile/addresses", address);
  return response.data;
};

// 🔹 Обновить адрес
export const updateUserAddress = async (
  id: number,
  address: AddressDTO
): Promise<AddressDTO> => {
  const response = await apiClient.put(`/api/profile/addresses/${id}`, address);
  return response.data;
};

// 🔹 Удалить адрес
export const deleteUserAddress = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/profile/addresses/${id}`);
};



// ========================== 🧭 Координаты адресов ==========================


// 🔹 Получить координаты адреса
export const fetchAddressCoordinates = async (
  addressId: number
): Promise<AddressCoordinatesDTO> => {
  const response = await apiClient.get(`/api/profile/address/${addressId}/coordinates`);
  return response.data;
};

// 🔹 Обновить координаты адреса
export const updateAddressCoordinates = async (
  addressId: number,
  latitude: number,
  longitude: number
): Promise<void> => {
  await apiClient.put(`/api/profile/address/${addressId}/coordinates`, null, {
    params: {
      latitude,
      longitude,
    },
  });
};

// 🔹 Очистить координаты адреса
export const clearAddressCoordinates = async (addressId: number): Promise<void> => {
  await apiClient.delete(`/api/profile/address/${addressId}/coordinates`);
};
