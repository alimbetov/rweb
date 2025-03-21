import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  filterProducts,
  searchProductsByName, // ✅ Добавили поиск по имени
  deleteProduct,
  fetchCategories,
  fetchSubCategories,
} from "../apidata/productService";
import { Product, Category, SubCategory } from "../types/types";

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryCode, setCategoryCode] = useState<string>("");
  const [subCategoryCode, setSubCategoryCode] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchQuery, categoryCode, subCategoryCode, page]);

  const loadProducts = async () => {
    try {
      let data;
      if (searchQuery.trim() !== "") {
        // ✅ Если есть поисковый запрос, используем API поиска по имени
        data = await searchProductsByName(searchQuery, page, 10);
      } else {
        // ✅ Иначе фильтруем по категории и подкатегории
        data = await filterProducts(categoryCode, subCategoryCode, page, 10);
      }

      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);

      const subCategoriesData = await fetchSubCategories();
      setSubCategories(subCategoriesData);
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Список товаров</h1>

      {/* Поля поиска */}
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Поиск по названию"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded w-1/3"
        />

        {/* Выпадающий список категорий */}
        <select
          value={categoryCode}
          onChange={(e) => setCategoryCode(e.target.value)}
          className="px-4 py-2 border rounded w-1/3 ml-2"
        >
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option key={category.code} value={category.code}>
              {category.nameRu}
            </option>
          ))}
        </select>

        {/* Выпадающий список подкатегорий */}
        <select
          value={subCategoryCode}
          onChange={(e) => setSubCategoryCode(e.target.value)}
          className="px-4 py-2 border rounded w-1/3 ml-2"
          disabled={!categoryCode} // ✅ Блокируем, если категория не выбрана
        >
          <option value="">Все подкатегории</option>
          {subCategories
            .filter((sub) => sub.categoryCode === categoryCode) // ✅ Фильтруем подкатегории
            .map((subCategory) => (
              <option key={subCategory.code} value={subCategory.code}>
                {subCategory.nameRu}
              </option>
            ))}
        </select>

        <button
          onClick={loadProducts}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          🔍 Искать
        </button>
      </div>

      {/* Кнопка "Добавить товар" */}
      <button
        onClick={() => navigate("/mod/products/new")}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        ➕ Добавить товар
      </button>

      {/* Таблица товаров */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Название (RU)</th>
            <th className="py-2 px-4 border">Категория</th>
            <th className="py-2 px-4 border">Подкатегория</th>
            <th className="py-2 px-4 border">Публичный</th>
            <th className="py-2 px-4 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="border px-4 py-2">{product.id}</td>
              <td className="border px-4 py-2">{product.nameRu}</td>
              <td className="border px-4 py-2">{product.categoryCode}</td>
              <td className="border px-4 py-2">
                {product.subCategoryCode ?? "—"}
              </td>
              <td className="border px-4 py-2">
                {product.isPublic ? "✅" : "❌"}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => navigate(`/mod/products/edit/${product.id}`)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                >
                  ✏️ Редактировать
                </button>
                <button
                  onClick={() =>
                    navigate(`/mod/products/${product.id}/attributes`)
                  }
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                >
                  🛠️ Атрибуты
                </button>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  🗑️ Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Пагинация */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-3 py-1 bg-gray-300 rounded mr-2"
        >
          ⬅ Назад
        </button>
        <span className="mx-4">
          Страница {page + 1} из {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Вперед ➡
        </button>
      </div>
    </div>
  );
};

export default ProductList;
