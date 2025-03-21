import { AuthProvider } from "./context/AuthContext"; // ✅ Глобальный контекст аутентификации
import { RouterProvider } from "react-router-dom";
import router from "./routes";

export default function App() {
  return (
    <AuthProvider>
      {" "}
      {/* ✅ Убрали `<BrowserRouter>` */}
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
