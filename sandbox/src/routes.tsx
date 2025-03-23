import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext"; // ✅ Добавил `useAuth`
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "../src/ProtectedRoute"; // ✅ Подключаем защиту маршрутов

import AdminUsers from "./pages/AdminUsers";
import UserEdit from "./pages/UserEdit";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Auth/Register";
import CountryList from "./pages/CountryList";
import CountryForm from "./pages/CountryForm";
import CityList from "./pages/CityList";
import CityForm from "./pages/CityForm";
import CategoryGroupList from "./pages/CategoryGroupList";
import CategoryGroupForm from "./pages/CategoryGroupForm";
import CategoryList from "./pages/CategoryList";
import CategoryForm from "./pages/CategoryForm";
import SubCategoryList from "./pages/SubCategoryList";
import SubCategoryForm from "./pages/SubCategoryForm";
import AttributeList from "./pages/AttributesList";
import CreateAttributePage from "./pages/CreateAttributePage.tsx";
import EditAttributePage from "./pages/EditAttributePage";
import AttributeValuesPage from "./pages/AttributeValuesPage";
import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";
import ProductAttributesForm from "./pages/ProductAttributesForm";
import ProfileForm from "./pages/ProfileForm";
import AddressManager from "./pages/AddressManager";
import AddressForm from "./pages/AddressForm";
import AttributeFormPage from "./pages/AttributeFormPage.tsx";
import AttributeValueList from "./pages/AttributeValueList.tsx";
import CityMapPage from "./pages/CityMapPage.tsx";
import AddressMapPage from "./pages/AddressMapPage.tsx";

// ✅ Страница 404
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
    <h1 className="text-3xl font-bold">404 - Страница не найдена</h1>
    <p className="text-lg mt-2">
      Вернитесь на{" "}
      <a href="/" className="text-blue-500">
        главную
      </a>
      .
    </p>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // 📌 Основной layout
    children: [
      { index: true, element: <Navigate to="/dashboard" /> },
      // ✅ Открытые маршруты (не требуют авторизации)
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // ✅ Защищенные маршруты (требуют авторизации)
      {
        path: "/",
        element: <ProtectedRoute />, // 🔒 Защита маршрутов
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "admin/users", element: <AdminUsers /> },
          { path: "admin/users/edit/:id", element: <UserEdit /> },

          // ✅ Страны
          { path: "mod/countries", element: <CountryList /> },
          { path: "mod/countries/new", element: <CountryForm /> },
          {
            path: "mod/countries/edit/:countryCode",
            element: <CountryForm isEditMode={true} />,
          },

          // ✅ Города
          { path: "mod/cities", element: <CityList /> },
          { path: "mod/cities/new", element: <CityForm /> },
          {
            path: "mod/cities/edit/:cityCode",
            element: <CityForm isEditMode={true} />,
          },
          { path: "mod/cities/map/:cityCode", element: <CityMapPage /> },

          




          // ✅ Группы категорий
          { path: "mod/category-groups", element: <CategoryGroupList /> },
          { path: "mod/category-groups/new", element: <CategoryGroupForm /> },
          {
            path: "mod/category-groups/edit/:code",
            element: <CategoryGroupForm isEditMode={true} />,
          },

          // ✅ Категории
          { path: "mod/categories/:parentCode?", element: <CategoryList /> },
          { path: "mod/categories/new", element: <CategoryForm /> },
          {
            path: "mod/categories/edit/:code",
            element: <CategoryForm isEditMode={true} />,
          },

          // ✅ Подкатегории
          {
            path: "mod/sub-categories/:parentCode?",
            element: <SubCategoryList />,
          },
          { path: "mod/sub-categories/new", element: <SubCategoryForm /> },
          {
            path: "mod/sub-categories/edit/:code",
            element: <SubCategoryForm isEditMode={true} />,
          },

          // ✅ Атрибуты
          { path: "mod/attributes", element: <AttributeList /> },
          { path: "mod/attributes/new", element: <AttributeFormPage /> },
          { path: "mod/attributes/:id/edit", element: <AttributeFormPage /> },
           
          {
            path: "mod/attributes/:attributeId/values", element: <AttributeValueList />,
          },

          // ✅ Товары
          { path: "mod/products", element: <ProductList /> },
          { path: "mod/products/new", element: <ProductForm /> }, // ✅ Создание товара
          { path: "mod/products/edit/:id", element: <ProductForm /> }, // ✅ Редактирование товара
          {
            path: "mod/products/:productId/attributes",
            element: <ProductAttributesForm />,
          }, // ✅ Атрибуты товара

          { path: "guser/profile", element: <ProfileForm /> },
          { path: "guser/addresses", element: <AddressManager /> },
          { path: "guser/addresses/new", element: <AddressForm /> }, // ✅ Создание товара
          { path: "guser/addresses/edit/:id", element: <AddressForm /> }, // ✅ Редактирование товара
          { path: "guser/address/:addressId/map", element: <AddressMapPage /> }, // ✅ Редактирование товара




        ],
      },

      // ✅ Обработчик 404 ошибок
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
