import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Импортируем useAuth

export default function Dashboard() {
  const { roles } = useAuth(); // ✅ Получаем роли пользователя

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">📊 Dashboard</h1>

      {/* ✅ Выводим роли пользователя */}
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold">🔑 Ваши роли:</h2>
        {roles.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700 mt-2">
            {roles.map((role, index) => (
              <li
                key={index}
                className="font-mono bg-gray-200 inline-block px-3 py-1 rounded-md mr-2"
              >
                {role}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500"> Вы не авторизованы:</p>
        )}
      </div>

      {/* ✅ Если ролей нет - показываем ссылки "Вход" и "Регистрация" */}
      {(roles?.length ?? 0) === 0 && (
        <div>
          <div className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition">
            <Link to="/login" className="hover:underline">
              Вход
            </Link>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition">
            <Link to="/registr" className="hover:underline">
              Регистрация
            </Link>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ✅ Ссылка для ADMIN */}
        {roles?.includes("ROLE_ADMIN") && (
          <div className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">👥 Пользователи</h2>
            <p className="text-gray-600 mt-2">Всего зарегистрировано: 120</p>
            <Link
              to="/admin/users"
              className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Управлять пользователями
            </Link>
          </div>
        )}

        {/* ✅ Ссылка для MODERATOR */}
        {roles?.includes("ROLE_MODERATOR") && (
          <div className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">📦 Товары</h2>
            <p className="text-gray-600 mt-2">Всего товаров: 340</p>
            <Link
              to="/mod/category-groups"
              className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              ▶ Управлять группами категорий
            </Link>
            <Link
              to="/mod/categories"
              className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              ▶ Управлять категориями
            </Link>
            <Link
              to="/mod/sub-categories"
              className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              ▶ Управлять подкатегориями
            </Link>

            <Link
              to="/mod/attributes"
              className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              🔗 Управлять Атрибутами товар и услуг
            </Link>

            <Link
              to="/mod/products"
              className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              🔗 Управлять товарами / услугами
            </Link>
          </div>
        )}

        {/* ✅ Ссылка для ADMIN и INSPECTOR */}
        {(roles?.includes("ROLE_ADMIN") ||
          roles?.includes("ROLE_INSPECTOR")) && (
          <div className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">
              🌍 Справочник стран и городов
            </h2>
            <p className="text-gray-600 mt-2">
              Управление географическими данными
            </p>
            <Link
              to="/mod/countries"
              className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Управлять странами
            </Link>
            <Link
              to="/mod/cities"
              className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Управлять городами
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
