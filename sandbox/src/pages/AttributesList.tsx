import React, { useEffect, useState } from "react";
import {
  fetchAttributes,
  searchAttributes,
  deleteAttribute,
} from "../apidata/attributeService";
import { Attribute } from "../types/types";
import { useNavigate } from "react-router-dom";

const AttributeList: React.FC = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      const data = await fetchAttributes();
      setAttributes(data);
    } catch (error) {
      console.error("Ошибка загрузки атрибутов:", error);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/mod/attributes/${id}/edit`);
  };

  const handleManageValues = (id: number) => {
    navigate(`/mod/attributes/${id}/values`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот атрибут?")) {
      try {
        await deleteAttribute(id);
        loadAttributes(); // Перезагружаем список после удаления
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
    }
  };

  const handleSearch = async () => {
    try {
      if (searchQuery.trim() === "") {
        loadAttributes();
      } else {
        const results = await searchAttributes(searchQuery);
        setAttributes(results);
      }
    } catch (error) {
      console.error("Ошибка поиска:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Список атрибутов</h1>

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

      {/* Кнопка "Добавить атрибут" */}
      <button
        onClick={() => navigate("/mod/attributes/new")}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        ➕ Добавить атрибут
      </button>

      {/* Таблица атрибутов */}
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2">Код</th>
            <th className="py-2">Название (RU)</th>
            <th className="py-2">Название (KZ)</th>
            <th className="py-2">Название (EN)</th>
            <th className="py-2">Тип</th>
            <th className="py-2">Публичный</th>
            <th className="py-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {attributes.map((attribute) => (
            <tr key={attribute.id} className="border-t">
              <td className="border px-4 py-2">{attribute.code}</td>
              <td className="border px-4 py-2">{attribute.nameRu}</td>
              <td className="border px-4 py-2">{attribute.nameKz}</td>
              <td className="border px-4 py-2">{attribute.nameEn}</td>
              <td className="border px-4 py-2">{attribute.type}</td>
              <td className="border px-4 py-2">
                {attribute.isPublic ? "✅" : "❌"}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(attribute.id)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                >
                  ✏️ Редактировать
                </button>
                <button
                  onClick={() => handleDelete(attribute.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded mr-2"
                >
                  🗑️ Удалить
                </button>
                <button
                  onClick={() => handleManageValues(attribute.id)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  📂 Значения
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttributeList;
