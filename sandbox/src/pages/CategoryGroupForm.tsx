import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CategoryGroup } from "../types/types";
import {
  fetchCategoryGroups,
  createCategoryGroup,
  updateCategoryGroup,
} from "../apidata/goodApi";

interface CategoryGroupFormProps {
  isEditMode?: boolean;
}

const CategoryGroupForm: React.FC<CategoryGroupFormProps> = ({
  isEditMode = false,
}) => {
  const [categoryGroup, setCategoryGroup] = useState<CategoryGroup>({
    code: "",
    nameRu: "",
    nameKz: "",
    nameEn: "",
    isPublic: true,
    categoryCodes: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode && code) {
      setLoading(true);
      fetchCategoryGroups()
        .then((data) => {
          const foundGroup = data.find((group) => group.code === code);
          if (foundGroup) {
            setCategoryGroup(foundGroup);
          } else {
            setError("Группа не найдена");
          }
        })
        .catch(() => setError("Ошибка при загрузке данных"))
        .finally(() => setLoading(false));
    }
  }, [isEditMode, code]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type, checked } = e.currentTarget;
      setCategoryGroup((prev) => ({
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
          ...categoryGroup,
          isPublic: Boolean(categoryGroup.isPublic),
        };

        if (isEditMode) {
          await updateCategoryGroup(categoryGroup.code, payload);
        } else {
          await createCategoryGroup(payload);
        }

        navigate("/mod/category-groups");
      } catch (err) {
        setError("Ошибка при сохранении данных");
      } finally {
        setLoading(false);
      }
    },
    [categoryGroup, isEditMode, navigate]
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode
          ? "Редактировать группу категорий"
          : "Добавить группу категорий"}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Код категории */}
        <div className="mb-4">
          <label className="block text-gray-700">Код группы</label>
          <input
            type="text"
            name="code"
            value={categoryGroup.code}
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
            value={categoryGroup.nameRu}
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
            value={categoryGroup.nameKz}
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
            value={categoryGroup.nameEn}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Флаг публичности */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="isPublic"
            checked={categoryGroup.isPublic}
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
            onClick={() => navigate("/mod/category-groups")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryGroupForm;
