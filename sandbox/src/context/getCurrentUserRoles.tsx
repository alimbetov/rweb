// 📌 Импортируем apiClient
import apiClient from "../apidata/apiClient";

// Тип ролей
type Role = "ROLE_USER" | "ROLE_ADMIN" | "ROLE_MODERATOR" | "ROLE_INSPECTOR";

// 🔹 Автоустановка токена перед каждым запросом
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("передача токена на сервер:", token); // 🔥 Логируем ответ сервера
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getCurrentUserRoles = async (): Promise<Role[]> => {
  try {
    const response = await apiClient.get("/api/auth/me"); // ⚡ Запрос на сервер
    console.log("Ответ сервера:", response.data); // 🔥 Логируем ответ сервера
    return response.data;
  } catch (error) {
    console.error("Ошибка получения ролей:", error);
    return [];
  }
};
