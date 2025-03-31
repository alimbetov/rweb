// src/api/mediaApi.ts
import apiClient from "./apiClient";
import { AxiosResponse } from "axios";

// 🔐 Интерцептор для автоматической установки токена авторизации
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

// 🧾 DTO для представления сохранённого файла
export interface StoredFileDTO {
  id: number;                     // Уникальный идентификатор файла
  originalFilename: string;      // Исходное имя файла
  contentType: string;           // MIME-тип файла (например, image/jpeg, video/mp4)
  size: number;                  // Размер файла в байтах
  url: string;                   // URL для загрузки файла (например, из S3)
  previewUrl: string;            // URL предпросмотра (используется для изображений и медиа)
  signedUrl: string | null;      // Подписанная временная ссылка (если файл приватный)
  mediaType: "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO" | "OTHER"; // Тип контента
  editable: boolean;             // 🔥 Новое поле — доступность редактирования для текущего пользователя
}

/**
 * 🔁 Загрузка одного файла
 * Используется для загрузки одиночного файла с указанием связи (linkedType, linkedId)
 */
export const uploadFile = async (
  file: File,
  linkedType: string,
  linkedId: number,
  storeInDatabase: boolean = false,
  isPublic: boolean = true
): Promise<StoredFileDTO> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("linkedType", linkedType);
  formData.append("linkedId", linkedId.toString());
  formData.append("storeInDatabase", storeInDatabase.toString());
  formData.append("isPublic", isPublic.toString());


  const response: AxiosResponse<StoredFileDTO> = await apiClient.post(
    "/api/media/upload",
    formData,
    {
      headers: {
        "Content-Type": undefined, // ВАЖНО! Убираем, чтобы Axios сам поставил boundary
      },
    }
  );

  return response.data;
};

/**
 * 🔁 Загрузка нескольких файлов
 * Используется для пакетной загрузки группы файлов с одинаковой связью
 */
export const uploadMultipleFiles = async (
  files: File[],
  linkedType: string,
  linkedId: number,
  storeInDatabase: boolean = false,
  isPublic: boolean = true
): Promise<StoredFileDTO[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  formData.append("linkedType", linkedType);
  formData.append("linkedId", linkedId.toString());
  formData.append("storeInDatabase", storeInDatabase.toString());
  formData.append("isPublic", isPublic.toString());


  const response: AxiosResponse<StoredFileDTO[]> = await apiClient.post(
    "/api/media/upload-multiple",
    formData,
    {
      headers: {
        "Content-Type": undefined,
      },
    }
  );
  return response.data;
};

/**
 * 📦 Получение медиафайлов, связанных с сущностью (с пагинацией)
 */
export const fetchLinkedMediaPaged = async (
  linkedType: string,
  linkedId: number,
  page: number = 0,
  size: number = 10
): Promise<{
  content: StoredFileDTO[];
  totalElements: number;
  totalPages: number;
}> => {
  const response = await apiClient.get("/api/media/linked/paged", {
    params: { linkedType, linkedId, page, size }
  });
  return response.data;
};

/**
 * ⬇️ Скачать файл по ID (если он хранится в БД)
 */
export const downloadMediaFile = async (id: number): Promise<Blob> => {
  const response = await apiClient.get(`/api/media/download/${id}`, {
    responseType: "blob",
  });
  return response.data;
};

/**
 * ❌ Удаление файла по ID
 */
export const deleteMediaFile = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/media/${id}`);
};


/**
 * 🔄 Установить публичность файла
 */
export const setFilePublic = async (
  fileId: number,
  isPublic: boolean
): Promise<void> => {
  await apiClient.put("/api/media/set-public", null, {
    params: { fileId, isPublic },
  });
};

/**
 * ⭐ Сделать файл главным (только если файл публичный)
 */
export const setFileAsMain = async (
  fileId: number
): Promise<void> => {
  await apiClient.put("/api/media/set-main", null, {
    params: { fileId },
  });
};
