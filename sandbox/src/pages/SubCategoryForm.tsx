import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SubCategory, Category } from "../types/types";
import {
  fetchCategories,
  fetchSubCategories,
  createSubCategory,
  updateSubCategory,
} from "../apidata/goodApi";

interface SubCategoryFormProps {
  isEditMode?: boolean;
}

const SubCategoryForm: React.FC<SubCategoryFormProps> = ({
  isEditMode = false,
}) => {
  const [subCategory, setSubCategory] = useState<SubCategory>({
    code: "",
    nameRu: "",
    nameKz: "",
    nameEn: "",
    isPublic: true,
    categoryCode: "", // Выбираем из списка категорий
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    // Загружаем список категорий
    fetchCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch(() => setError("Ошибка загрузки списка категорий"));

    // Если редактируем подкатегорию - загружаем её данные
    if (isEditMode && code) {
      fetchSubCategories()
        .then((data) => {
          const foundSubCategory = data.find((sub) => sub.code === code);
          if (foundSubCategory) {
            setSubCategory(foundSubCategory);
          } else {
            setError("Подкатегория не найдена");
          }
        })
        .catch(() => setError("Ошибка при загрузке данных подкатегории"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isEditMode, code]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type, checked } = e.currentTarget;
      setSubCategory((prev) => ({
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
        const payload = {
          ...subCategory,
          isPublic: Boolean(subCategory.isPublic),
        };

        if (isEditMode) {
          await updateSubCategory(subCategory.code, payload);
        } else {
          await createSubCategory(payload);
        }

        navigate("/mod/sub-categories");
      } catch (err) {
        setError("Ошибка при сохранении данных подкатегории");
      } finally {
        setLoading(false);
      }
    },
    [subCategory, isEditMode, navigate]
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? "Редактировать подкатегорию" : "Добавить подкатегорию"}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Код подкатегории */}
        <div className="mb-4">
          <label className="block text-gray-700">Код подкатегории</label>
          <input
            type="text"
            name="code"
            value={subCategory.code}
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
            value={subCategory.nameRu}
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
            value={subCategory.nameKz}
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
            value={subCategory.nameEn}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Выбор категории */}
        <div className="mb-4">
          <label className="block text-gray-700">Категория</label>
          <select
            name="categoryCode"
            value={subCategory.categoryCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Выберите категорию</option>
            {categories.length === 0 ? (
              <option disabled>Загрузка...</option>
            ) : (
              categories.map((category) => (
                <option key={category.code} value={category.code}>
                  {category.nameRu} ({category.code})
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
            checked={subCategory.isPublic}
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
            onClick={() => navigate("/mod/sub-categories")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubCategoryForm;
