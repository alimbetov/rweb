import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers, searchUsers, deleteUser } from "../apidata/userApi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // ✅ Загрузка пользователей
  const loadUsers = async (query = "") => {
    try {
      const userList = query ? await searchUsers(query) : await fetchUsers();
      setUsers(userList);
    } catch (error) {
      console.error("Ошибка загрузки пользователей", error);
      alert("Ошибка загрузки пользователей");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Панель админа
      </h1>

      {/* 🔍 Поиск пользователей */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Поиск по имени..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadUsers(searchQuery)}
          className="border border-gray-300 rounded-md px-4 py-2 flex-1"
        />
        <button
          onClick={() => {
            setSearchQuery("");
            loadUsers("");
          }}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          Очистить
        </button>
      </div>

      {/* Таблица пользователей */}
      <table className="w-full table-auto bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Логин</th>
            <th className="px-4 py-2">Роли</th>
            <th className="px-4 py-2">Статус</th>
            <th className="px-4 py-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-2">{user.id}</td>
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">{user.roles.join(", ")}</td>
              <td className="px-4 py-2">{user.blockState}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => deleteUser(user.id).then(() => loadUsers())}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
