import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchSubCategories,
  searchSubCategories,
  searchSubCategoriesByParentCode,
  deleteSubCategory,
} from "../apidata/goodApi";
import { SubCategory } from "../types/types";

const SubCategoryList: React.FC = () => {
  const { parentCode } = useParams<{ parentCode: string }>(); // ✅ Получаем `parentCode` из URL

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadSubCategories();
  }, [parentCode]); // Обновляем данные при изменении `categoryCode`

  const loadSubCategories = async () => {
    try {
      if (parentCode) {
        // Если есть `categoryCode`, ищем по нему
        const data = await searchSubCategoriesByParentCode(parentCode);
        setSubCategories(data);
      } else {
        // Иначе загружаем все подкатегории
        const data = await fetchSubCategories();
        setSubCategories(data);
      }
    } catch (error) {
      console.error("Ошибка загрузки подкатегорий:", error);
    }
  };

  const handleEdit = (code: string) => {
    navigate(`/mod/sub-categories/edit/${code}`);
  };

  const handleDelete = async (code: string) => {
    if (window.confirm("Вы уверены, что хотите удалить эту подкатегорию?")) {
      try {
        await deleteSubCategory(code);
        loadSubCategories();
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
    }
  };

  const handleSearch = async () => {
    try {
      if (searchQuery.trim() === "") {
        loadSubCategories();
      } else {
        const results = parentCode // ✅ Используем parentCode
          ? await searchSubCategoriesByParentCode(searchQuery)
          : await searchSubCategories(searchQuery);
        setSubCategories(results);
      }
    } catch (error) {
      console.error("Ошибка поиска:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {parentCode
          ? `Подкатегории категории: ${parentCode}`
          : "Список подкатегорий"}
      </h1>

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

      {/* Кнопка "Добавить подкатегорию" */}
      <button
        onClick={() => navigate("/mod/sub-categories/new")}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        ➕ Добавить подкатегорию
      </button>

      {/* Таблица подкатегорий */}
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2">Код</th>
            <th className="py-2">Название (RU)</th>
            <th className="py-2">Название (KZ)</th>
            <th className="py-2">Название (EN)</th>
            <th className="py-2">Категория</th>
            <th className="py-2">Публичная</th>
            <th className="py-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {subCategories.map((subCategory) => (
            <tr key={subCategory.code} className="border-t">
              <td className="border px-4 py-2">{subCategory.code}</td>
              <td className="border px-4 py-2">{subCategory.nameRu}</td>
              <td className="border px-4 py-2">{subCategory.nameKz}</td>
              <td className="border px-4 py-2">{subCategory.nameEn}</td>
              <td className="border px-4 py-2">{subCategory.categoryCode}</td>
              <td className="border px-4 py-2">
                {subCategory.isPublic ? "✅" : "❌"}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(subCategory.code)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                >
                  ✏️ Редактировать
                </button>
                <button
                  onClick={() => handleDelete(subCategory.code)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  🗑️ Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubCategoryList;
