import apiClient from "../apidata/apiClient";

// Интерфейс пользователя
export interface UserDto {
  id: number;
  username: string;
  roles: string[];
  blockState: string;
}

// === Вызовы API для пользователей ===

// 🔹 Получить всех пользователей
export const fetchUsers = async (): Promise<UserDto[]> => {
  const response = await apiClient.get("/api/admin/users");
  return response.data;
};

// 🔹 Найти пользователей по имени
export const searchUsers = async (query: string): Promise<UserDto[]> => {
  const response = await apiClient.get("/api/admin/users/search", {
    params: { query },
  });
  return response.data;
};

// 🔹 Получить пользователя по ID
export const fetchUser = async (id: number): Promise<UserDto> => {
  const response = await apiClient.get(`/api/admin/users/${id}`);
  return response.data;
};

// 🔹 Создать пользователя
export const createUser = async (user: UserDto): Promise<UserDto> => {
  const response = await apiClient.post("/api/admin/users", user);
  return response.data;
};

// 🔹 Обновить пользователя
export const updateUser = async (user: UserDto): Promise<UserDto> => {
  const response = await apiClient.put(`/api/admin/users/${user.id}`, user);
  return response.data;
};

// 🔹 Удалить пользователя
export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/admin/users/${id}`);
};

// 🔹 Получить список всех ролей
export const fetchRoles = async (): Promise<string[]> => {
  const response = await apiClient.get("/api/admin/users/roles");
  return response.data;
};
