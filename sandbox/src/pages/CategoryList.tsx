import React, { useEffect, useState } from "react";
import {
  fetchCategories,
  searchCategories,
  searchCategoriesByParentCode,
  deleteCategory,
} from "../apidata/goodApi";
import { Category } from "../types/types";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
interface CategoryListProps {
  parentCode?: string; // Добавляем поддержку родительского кода
}

const CategoryList: React.FC<CategoryListProps> = () => {
  const { parentCode } = useParams<{ parentCode: string }>(); // ✅ Получаем `parentCode` из URL
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, [parentCode]); // Обновляем данные при изменении parentCode

  const loadCategories = async () => {
    try {
      if (parentCode) {
        // Если есть parentCode, ищем по нему
        const data = await searchCategoriesByParentCode(parentCode);
        setCategories(data);
      } else {
        // Иначе загружаем все категории
        const data = await fetchCategories();
        setCategories(data);
      }
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
    }
  };

  const handleEdit = (code: string) => {
    navigate(`/mod/categories/edit/${code}`);
  };

  const handleForChildrenViewEdit = (code: string) => {
    console.log("Переход на подкатегории категории:", code);
    navigate(`/mod/sub-categories/${code}`);
  };
  const handleDelete = async (code: string) => {
    if (window.confirm("Вы уверены, что хотите удалить эту категорию?")) {
      try {
        await deleteCategory(code);
        loadCategories();
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
    }
  };

  const handleSearch = async () => {
    try {
      if (searchQuery.trim() === "") {
        loadCategories();
      } else {
        const results = parentCode
          ? await searchCategoriesByParentCode(searchQuery)
          : await searchCategories(searchQuery);
        setCategories(results);
      }
    } catch (error) {
      console.error("Ошибка поиска:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Список категорий</h1>

      {/* Поле поиска */}
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Поиск по коду или названию"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          🔍 Искать
        </button>
      </div>

      {/* Кнопка "Добавить категорию" */}
      <button
        onClick={() => navigate("/mod/categories/new")}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        ➕ Добавить категорию
      </button>

      {/* Таблица категорий */}
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2">Код</th>
            <th className="py-2">Название (RU)</th>
            <th className="py-2">Название (KZ)</th>
            <th className="py-2">Название (EN)</th>
            <th className="py-2">Группа категорий</th>
            <th className="py-2">Публичная</th>
            <th className="py-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.code} className="border-t">
              <td className="border px-4 py-2">{category.code}</td>
              <td className="border px-4 py-2">{category.nameRu}</td>
              <td className="border px-4 py-2">{category.nameKz}</td>
              <td className="border px-4 py-2">{category.nameEn}</td>
              <td className="border px-4 py-2">{category.groupCode}</td>
              <td className="border px-4 py-2">
                {category.isPublic ? "✅" : "❌"}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(category.code)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                >
                  ✏️ Редактировать
                </button>
                <button
                  onClick={() => handleDelete(category.code)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  🗑️ Удалить
                </button>
                <button
                  onClick={() => handleForChildrenViewEdit(category.code)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  📂 Подкатегории
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
