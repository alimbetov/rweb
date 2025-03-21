import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";

interface UserDto {
  id: number;
  username: string;
  roles: string[];
  blocked: boolean;
}

export default function UserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserDto | null>(null);
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (id) {
      loadUser(id);
      loadRoles();
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      setSelectedRoles(Array.isArray(user.roles) ? user.roles : []);
      setIsBlocked(user.blocked);
    }
  }, [user]);
  async function loadUser(userId: string) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/admin/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const userData: UserDto = await response.json();

        // ✅ Очищаем `[` и `]` из строк ролей
        const rolesArray = Array.isArray(userData.roles)
          ? userData.roles.map((role) => role.replace(/[\[\]]/g, "").trim()) // 🛠 Убираем `[` и `]`
          : userData.roles
              .replace(/[\[\]]/g, "") // 🛠 Убираем `[` и `]`
              .split(",") // Разбиваем строку в массив
              .map((role) => role.trim()); // Очищаем пробелы

        console.log("🔹 Загруженные роли:", rolesArray); // ✅ Для отладки

        setUser(userData);
        setSelectedRoles(rolesArray);
      } else {
        console.error("Ошибка загрузки пользователя");
      }
    } catch (error) {
      console.error("❌ Ошибка загрузки пользователя:", error);
    }
  }

  async function loadRoles() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/admin/users/roles",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const rolesData = await response.json();

        // ✅ Чистим `[` и `]`, убираем дубликаты
        const rolesArray = Array.isArray(rolesData)
          ? [
              ...new Set(
                rolesData.flatMap((role) =>
                  typeof role === "string"
                    ? role
                        .replace(/[\[\]]/g, "")
                        .split(",")
                        .map((r) => r.trim()) // Убираем `[` и `]`
                    : role
                )
              ),
            ]
          : [];

        console.log("🔹 Все доступные роли:", rolesArray); // ✅ Для отладки

        setAllRoles(rolesArray);
      } else {
        console.error("Ошибка загрузки списка ролей");
      }
    } catch (error) {
      console.error("❌ Ошибка загрузки ролей:", error);
    }
  }

  async function updateUser() {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");

      // ✅ Чистим `[` и `]`
      const flattenedRoles = selectedRoles.map((role) =>
        role.replace(/[\[\]]/g, "").trim()
      );

      const updatedUser = {
        ...user,
        roles: flattenedRoles,
        blocked: isBlocked,
      };

      console.log("📤 Отправка на сервер:", updatedUser); // ✅ Для отладки

      const response = await fetch(`http://localhost:8080/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        navigate("/admin/users");
      } else {
        console.error("Ошибка обновления пользователя");
      }
    } catch (error) {
      console.error("❌ Ошибка обновления пользователя:", error);
    }
  }

  if (!user) return <p className="text-center text-gray-500">Загрузка...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Редактирование пользователя
      </h2>

      {/* Имя пользователя */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Имя пользователя
        </label>
        <input
          type="text"
          value={user.username}
          readOnly
          className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Мульти-селект для ролей */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Роли
        </label>
        <Select
          isMulti
          options={allRoles.map((role) => ({ value: role, label: role }))}
          value={selectedRoles.map((role) => ({ value: role, label: role }))}
          onChange={(selectedOptions) =>
            setSelectedRoles(selectedOptions.map((opt) => opt.value))
          }
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Выберите роли..."
        />
      </div>

      {/* Чекбокс блокировки пользователя */}
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isBlocked}
          onChange={() => setIsBlocked(!isBlocked)}
          className="w-4 h-4 text-red-600"
        />
        <label className="text-gray-700 text-sm">Заблокирован</label>
      </div>

      {/* Кнопки */}
      <div className="flex justify-between">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={updateUser}
        >
          Сохранить
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          onClick={() => navigate("/admin/users")}
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
