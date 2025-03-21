// src/pages/EditAttributePage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchAttributeById,
  updateAttribute,
  fetchAttributeTypes,
} from "../apidata/attributeService";
import { Attribute, AttributeType } from "../types/types";

const EditAttributePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [attribute, setAttribute] = useState<Attribute | null>(null);
  const [types, setTypes] = useState<AttributeType[]>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем данные атрибута и типы
  useEffect(() => {
    const load = async () => {
      if (!id) return;

      try {
        const [attr, typeList] = await Promise.all([
          fetchAttributeById(Number(id)),
          fetchAttributeTypes(),
        ]);
        setAttribute(attr);
        setTypes(typeList);
      } catch (e) {
        console.error("Ошибка при загрузке атрибута", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setAttribute((prev) =>
      prev
        ? {
            ...prev,
            [name]: type === "checkbox" ? checked : value,
          }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attribute || !id) return;

    try {
      await updateAttribute(Number(id), attribute);
      navigate("/attributes"); // Вернуться на список
    } catch (e) {
      console.error("Ошибка при обновлении", e);
    }
  };

  if (loading || !attribute) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Редактирование атрибута</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Код</label>
          <input
            type="text"
            name="code"
            value={attribute.code}
            onChange={handleChange}
            disabled // Обычно код менять нельзя
          />
        </div>

        <div>
          <label>Название (RU)</label>
          <input name="nameRu" value={attribute.nameRu} onChange={handleChange} />
        </div>

        <div>
          <label>Название (KZ)</label>
          <input name="nameKz" value={attribute.nameKz} onChange={handleChange} />
        </div>

        <div>
          <label>Название (EN)</label>
          <input name="nameEn" value={attribute.nameEn} onChange={handleChange} />
        </div>

        <div>
          <label>Тип</label>
          <select name="type" value={attribute.type} onChange={handleChange}>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="isPublic"
              checked={attribute.isPublic}
              onChange={handleChange}
            />
            Публичный
          </label>
        </div>

        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
};

export default EditAttributePage;
