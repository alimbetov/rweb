// src/api/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080", // Поддержка .env
  timeout: 10000, // 10 секунд таймаут
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
