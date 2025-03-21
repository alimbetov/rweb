import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Импортируем useAuth

export default function MainLayout() {
  const { roles, logout } = useAuth(); // ✅ Получаем роли и logout()

  return (
    <div className="flex flex-col min-h-screen">
      {/* 🔹 Хедер */}
      <header className="bg-blue-500 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">🛒 Marketplace</h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">
            Главная
          </Link>
          <Link to="/login" className="hover:underline">
            Вход
          </Link>
          <Link to="/register" className="hover:underline">
            Регистрация
          </Link>

          {roles.includes("ROLE_USER") && (
            <>
              <Link to="/guser/profile" className="hover:underline">
                Профиль
              </Link>
            </>
          )}

          {/* ✅ Кнопка выхода */}
          {roles.length > 0 && (
            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Выйти
            </button>
          )}
        </nav>
      </header>

      {/* 🔹 Контент (будет заменяться в зависимости от маршрута) */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

      {/* 🔹 Футер */}
      <footer className="bg-gray-800 text-white text-center py-4">
        Ⓒ {new Date().getFullYear()} Marketplace. Все права защищены.
      </footer>
    </div>
  );
}
