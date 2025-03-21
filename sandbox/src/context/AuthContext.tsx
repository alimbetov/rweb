import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUserRoles } from "../context/getCurrentUserRoles";

type Role = "ROLE_USER" | "ROLE_ADMIN" | "ROLE_MODERATOR" | "ROLE_INSPECTOR";

interface AuthContextType {
  isAuthenticated: boolean;
  roles: Role[];
  login: (token: string) => void;
  logout: () => void;
  fetchRoles: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = async () => {
    if (!isAuthenticated) return;
    const userRoles = await getCurrentUserRoles();
    setRoles(userRoles);
  };

  useEffect(() => {
    fetchRoles();
  }, [isAuthenticated]);

  // ✅ Теперь login принимает navigate
  const login = (token: string, navigate: (path: string) => void) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    navigate("/dashboard"); // ✅ Используем navigate, переданный из компонента
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setRoles([]);
    const navigate = useNavigate(); // ✅ `useNavigate()` здесь тоже корректен
    navigate("/login"); // 🔄 Перенаправляем на страницу логина
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, roles, login, logout, fetchRoles }}
    >
      {children}
    </AuthContext.Provider>
  );
};
