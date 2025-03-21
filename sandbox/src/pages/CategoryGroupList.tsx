import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCategoryGroups,
  deleteCategoryGroup,
  searchCategoryGroups,
} from "../apidata/goodApi";
import { CategoryGroup } from "../types/types";

const CategoryGroupList: React.FC = () => {
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCategoryGroups();
  }, []);

  const loadCategoryGroups = async () => {
    try {
      const data = await fetchCategoryGroups();
      setCategoryGroups(data);
    } catch (error) {
      console.error("Ошибка загрузки групп категорий:", error);
    }
  };

  const handleEdit = (code: string) => {
    navigate(`/mod/category-groups/edit/${code}`);
  };

  const handleForChildrenViewEdit = (code: string) => {
    navigate(`/mod/categories/${code}`); // ✅ Теперь код категории передается правильно
  };

  const handleDelete = async (code: string) => {
    if (window.confirm("Вы уверены, что хотите удалить эту группу?")) {
      try {
        await deleteCategoryGroup(code);
        loadCategoryGroups();
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      loadCategoryGroups();
    } else {
      try {
        const results = await searchCategoryGroups(searchQuery);
        setCategoryGroups(results);
      } catch (error) {
        console.error("Ошибка поиска:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Группы категорий</h1>

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

      {/* Кнопка "Добавить" */}
      <button
        onClick={() => navigate("/mod/category-groups/new")}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        ➕ Добавить группу
      </button>

      {/* Таблица категорий */}
      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Код</th>
            <th className="py-2 px-4">Название (RU)</th>
            <th className="py-2 px-4">Название (KZ)</th>
            <th className="py-2 px-4">Название (EN)</th>
            <th className="py-2 px-4">Публичная</th>
            <th className="py-2 px-4">Действия</th>
          </tr>
        </thead>
        <tbody>
          {categoryGroups.map((group) => (
            <tr key={group.code} className="border-t">
              <td className="border px-4 py-2">{group.code}</td>
              <td className="border px-4 py-2">{group.nameRu}</td>
              <td className="border px-4 py-2">{group.nameKz}</td>
              <td className="border px-4 py-2">{group.nameEn}</td>
              <td className="border px-4 py-2">
                {group.isPublic ? "✅" : "❌"}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(group.code)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                >
                  ✏️ Редактировать
                </button>
                <button
                  onClick={() => handleDelete(group.code)}
                  className="px-2 py-1 bg-red-500 text-white rounded mr-2"
                >
                  🗑️ Удалить
                </button>
                <button
                  onClick={() => handleForChildrenViewEdit(group.code)}
                  className="px-2 py-1 bg-green-500 text-white rounded"
                >
                  📂 Категории
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryGroupList;
