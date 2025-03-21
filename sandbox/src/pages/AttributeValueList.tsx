import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchAttributeById,
  fetchAttributeValuesByAttribute,
  searchAttributeValues,
  createAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
} from "../apidata/attributeService";
import { Attribute, AttributeValue } from "../types/types";

const AttributeValueList: React.FC = () => {
  const { attributeId } = useParams<{ attributeId: string }>(); // Получаем ID атрибута из URL
  const navigate = useNavigate();

  const [attribute, setAttribute] = useState<Attribute | null>(null);
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editValueId, setEditValueId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (attributeId) {
      loadAttribute();
      loadAttributeValues();
    }
  }, [attributeId]);

  const loadAttribute = async () => {
    try {
      const attr = await fetchAttributeById(Number(attributeId));
      setAttribute(attr);
    } catch (error) {
      console.error("Ошибка загрузки атрибута:", error);
    }
  };

  const loadAttributeValues = async () => {
    try {
      const values = await fetchAttributeValuesByAttribute(Number(attributeId));
      setAttributeValues(values);
    } catch (error) {
      console.error("Ошибка загрузки значений атрибута:", error);
    }
  };

  const handleSearch = async () => {
    try {
      if (searchQuery.trim() === "") {
        loadAttributeValues();
      } else {
        const results = await searchAttributeValues(searchQuery);
        setAttributeValues(results);
      }
    } catch (error) {
      console.error("Ошибка поиска:", error);
    }
  };

  const handleAddOrUpdateValue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!newValue.trim()) {
        setError("Значение не может быть пустым.");
        setLoading(false);
        return;
      }

      if (editMode && editValueId) {
        await updateAttributeValue(editValueId, {
          id: editValueId,
          attributeId: Number(attributeId),
          value: newValue,
          isPublic,
          valueRu: "",
          valueKz: "",
          valueEn: "",
          attributeCode: ""
        });
      } else {
        await createAttributeValue({
          id: 0,
          attributeId: Number(attributeId),
          value: newValue,
          isPublic,
          valueRu: "",
          valueKz: "",
          valueEn: "",
          attributeCode: ""
        });
      }

      setNewValue("");
      setIsPublic(true);
      setEditMode(false);
      setEditValueId(null);
      loadAttributeValues();
    } catch (err) {
      setError("Ошибка при сохранении значения.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (value: AttributeValue) => {
    setNewValue(value.value);
    setIsPublic(value.isPublic);
    setEditMode(true);
    setEditValueId(value.id);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить это значение?")) {
      try {
        await deleteAttributeValue(id);
        loadAttributeValues();
      } catch (error) {
        console.error("Ошибка удаления значения:", error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Значения атрибута</h1>

      {/* Информация об атрибуте */}
      {attribute && (
        <div className="mb-4 p-4 border rounded bg-gray-100">
          <p>
            <strong>Код:</strong> {attribute.code}
          </p>
          <p>
            <strong>Название (RU):</strong> {attribute.nameRu}
          </p>
          <p>
            <strong>Тип:</strong> {attribute.type}
          </p>
        </div>
      )}

      {/* Поле поиска */}
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Поиск значений..."
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

      {/* Форма добавления / редактирования */}
      <form onSubmit={handleAddOrUpdateValue} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700">Значение</label>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="mr-2 leading-tight"
          />
          <label className="text-gray-700">Публичное</label>
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
            {loading ? "Сохранение..." : editMode ? "Обновить" : "Добавить"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/mod/attributes")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Назад
          </button>
        </div>
      </form>

      {/* Таблица значений */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Значение</th>
            <th className="py-2 px-4 border">Публичное</th>
            <th className="py-2 px-4 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {attributeValues.map((val) => (
            <tr key={val.id} className="border-t">
              <td className="border px-4 py-2">{val.value}</td>
              <td className="border px-4 py-2">{val.isPublic ? "✅" : "❌"}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(val)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(val.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttributeValueList;
