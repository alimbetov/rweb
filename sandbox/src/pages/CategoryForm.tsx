import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Category, CategoryGroup } from "../types/types";
import {
  fetchCategoryGroups,
  fetchCategories,
  createCategory,
  updateCategory,
} from "../apidata/goodApi";

interface CategoryFormProps {
  isEditMode?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ isEditMode = false }) => {
  const [category, setCategory] = useState<Category>({
    code: "",
    nameRu: "",
    nameKz: "",
    nameEn: "",
    isPublic: true,
    groupCode: "", // Выбираем из списка групп категорий
  });

  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    // Загружаем список групп категорий
    fetchCategoryGroups()
      .then((data) => {
        setCategoryGroups(data);
      })
      .catch(() => setError("Ошибка загрузки списка групп категорий"));

    // Если редактируем категорию - загружаем её данные
    if (isEditMode && code) {
      fetchCategories()
        .then((data) => {
          const foundCategory = data.find((cat) => cat.code === code);
          if (foundCategory) {
            setCategory(foundCategory);
          } else {
            setError("Категория не найдена");
          }
        })
        .catch(() => setError("Ошибка при загрузке данных категории"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isEditMode, code]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type, checked } = e.currentTarget;
      setCategory((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const payload = { ...category, isPublic: Boolean(category.isPublic) };

        if (isEditMode) {
          await updateCategory(category.code, payload);
        } else {
          await createCategory(payload);
        }

        navigate("/mod/categories");
      } catch (err) {
        setError("Ошибка при сохранении данных категории");
      } finally {
        setLoading(false);
      }
    },
    [category, isEditMode, navigate]
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? "Редактировать категорию" : "Добавить категорию"}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Код категории */}
        <div className="mb-4">
          <label className="block text-gray-700">Код категории</label>
          <input
            type="text"
            name="code"
            value={category.code}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            disabled={isEditMode}
            required
          />
        </div>

        {/* Названия на разных языках */}
        <div className="mb-4">
          <label className="block text-gray-700">Название (RU)</label>
          <input
            type="text"
            name="nameRu"
            value={category.nameRu}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Название (KZ)</label>
          <input
            type="text"
            name="nameKz"
            value={category.nameKz}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Название (EN)</label>
          <input
            type="text"
            name="nameEn"
            value={category.nameEn}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Выбор группы категорий */}
        <div className="mb-4">
          <label className="block text-gray-700">Группа категорий</label>
          <select
            name="groupCode"
            value={category.groupCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Выберите группу</option>
            {categoryGroups.length === 0 ? (
              <option disabled>Загрузка...</option>
            ) : (
              categoryGroups.map((group) => (
                <option key={group.code} value={group.code}>
                  {group.nameRu} ({group.code})
                </option>
              ))
            )}
          </select>
        </div>

        {/* Флаг публичности */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="isPublic"
            checked={category.isPublic}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
          <label htmlFor="isPublic" className="text-gray-700">
            Публичная
          </label>
        </div>

        {/* Кнопки */}
        <div className="flex justify-between">
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Сохранение..." : "Сохранить"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/mod/categories")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
