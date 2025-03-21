// src/pages/AttributeFormPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createAttribute,
  updateAttribute,
  fetchAttributeById,
  fetchAttributeTypes,
  deleteAttribute,
} from "../apidata/attributeService";
import { Attribute, AttributeType } from "../types/types";

const AttributeFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // id может быть undefined при создании
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [attribute, setAttribute] = useState<Attribute>({
    id: 0,
    code: "",
    nameRu: "",
    nameKz: "",
    nameEn: "",
    isPublic: true,
    type: AttributeType.STRING,
  });

  const [types, setTypes] = useState<AttributeType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttributeTypes().then(setTypes);
    if (isEdit && id) {
      fetchAttributeById(Number(id)).then(setAttribute);
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setAttribute((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isEdit && id) {
        await updateAttribute(Number(id), attribute);
      } else {
        await createAttribute(attribute);
      }
      navigate("/mod/attributes");
    } catch (e) {
      console.error("Ошибка при сохранении:", e);
      setError("Не удалось сохранить атрибут");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (id && window.confirm("Удалить этот атрибут?")) {
      try {
        await deleteAttribute(Number(id));
        navigate("/mod/attributes");
      } catch (e) {
        console.error("Ошибка при удалении:", e);
        setError("Не удалось удалить атрибут");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isEdit ? "Редактировать атрибут" : "Создать атрибут"}
      </h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Код</label>
          <input
            type="text"
            name="code"
            value={attribute.code}
            onChange={handleChange}
            required
            disabled={isEdit}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Название (RU)</label>
          <input
            type="text"
            name="nameRu"
            value={attribute.nameRu}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Название (KZ)</label>
          <input
            type="text"
            name="nameKz"
            value={attribute.nameKz}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Название (EN)</label>
          <input
            type="text"
            name="nameEn"
            value={attribute.nameEn}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Тип</label>
          <select
            name="type"
            value={attribute.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isPublic"
            checked={attribute.isPublic}
            onChange={handleChange}
            className="mr-2"
          />
          <label>Публичный</label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Сохранение..." : isEdit ? "Сохранить" : "Создать"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/mod/attributes")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Назад
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Удалить
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AttributeFormPage;
