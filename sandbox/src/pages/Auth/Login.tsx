import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Импортируем useNavigate
import { useAuth } from "../../context/AuthContext"; // ✅ Подключаем контекст

export default function Login() {
  const { login } = useAuth(); // 🎯 Используем `login` из контекста
  const navigate = useNavigate(); // ✅ Используем useNavigate в компоненте
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Введите email и пароль!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(
          `Ошибка входа: ${errorData.message || "Неверный email или пароль"}`
        );
        return;
      }

      const data = await response.json();
      login(data.token, navigate); // ✅ Теперь передаем navigate в login
    } catch (error) {
      console.error("❌ Ошибка авторизации:", error);
      alert("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Вход</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full border p-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Вход..." : "Войти"}
        </button>
      </div>
    </div>
  );
}
