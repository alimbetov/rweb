import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchAttributeById,
  createAttribute,
  updateAttribute,
  fetchAttributeTypes,
} from "../apidata/attributeService";
import { Attribute, AttributeType } from "../types/types";

const AttributeForm: React.FC<{ isEditMode?: boolean }> = ({
  isEditMode = false,
}) => {
  const [attribute, setAttribute] = useState<Attribute>({
    id: 0,
    code: "",
    nameRu: "",
    nameKz: "",
    nameEn: "",
    isPublic: true,
    type: AttributeType.STRING,
  });

  const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>(); // Получаем ID из URL
  const navigate = useNavigate();

  useEffect(() => {
    // Загружаем список типов атрибутов
    fetchAttributeTypes()
      .then(setAttributeTypes)
      .catch(() => setError("Ошибка загрузки типов атрибутов"));

    // Если режим редактирования, загружаем данные атрибута
    if (isEditMode && id) {
      setLoading(true);
      fetchAttributeById(Number(id))
        .then((data) => setAttribute(data))
        .catch(() => setError("Ошибка при загрузке атрибута"))
        .finally(() => setLoading(false));
    }
  }, [isEditMode, id]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type, checked } = e.currentTarget;
      setAttribute((prev) => ({
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
        if (isEditMode) {
          await updateAttribute(attribute.id, attribute);
        } else {
          await createAttribute(attribute);
        }

        navigate("/mod/attributes");
      } catch (err) {
        setError("Ошибка при сохранении атрибута");
      } finally {
        setLoading(false);
      }
    },
    [attribute, isEditMode, navigate]
  );

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? "Редактировать атрибут" : "Добавить атрибут"}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Код</label>
          <input
            type="text"
            name="code"
            value={attribute.code}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            disabled={isEditMode} // Код нельзя менять при редактировании
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Название (RU)</label>
          <input
            type="text"
            name="nameRu"
            value={attribute.nameRu}
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
            value={attribute.nameKz}
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
            value={attribute.nameEn}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Тип атрибута</label>
          <select
            name="type"
            value={attribute.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            {attributeTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="isPublic"
            checked={attribute.isPublic}
            onChange={handleChange}
            className="mr-2 leading-tight"
            aria-label="Публичный атрибут"
          />
          <label htmlFor="isPublic" className="text-gray-700">
            Публичный
          </label>
        </div>

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
            onClick={() => navigate("/attributes")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttributeForm;
