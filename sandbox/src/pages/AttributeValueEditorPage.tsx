// src/pages/AttributeValueEditorPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchAttributeById,
  fetchAttributeValuesByAttribute,
  createAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
} from "../apidata/attributeService";
import { Attribute, AttributeValue } from "../types/types";

const AttributeValueEditorPage: React.FC = () => {


  const { id } = useParams<{ id: string }>();
  const attributeId = Number(id);


  const navigate = useNavigate();

  const [attribute, setAttribute] = useState<Attribute | null>(null);
  const [values, setValues] = useState<AttributeValue[]>([]);
  const [newValue, setNewValue] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);

  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");


  useEffect(() => {
    const attrId = Number(attributeId);
    if (!id || isNaN(attrId)) return;
  
    fetchAttributeById(attrId).then(setAttribute);
    fetchAttributeValuesByAttribute(attrId).then(setValues);
  }, [attributeId]);

  

  const refreshValues = () => {
    fetchAttributeValuesByAttribute(attributeId).then(setValues);
  };

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newValue.trim()) return;

    if (editId !== null) {
      await updateAttributeValue(editId, {
        id: editId,
        attributeId,
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
        attributeId,
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
    setEditId(null);
    refreshValues();
  };

  const handleEdit = (val: AttributeValue) => {
    setNewValue(val.value);
    setIsPublic(val.isPublic);
    setEditId(val.id);
  };

  const handleCancelEdit = () => {
    setNewValue("");
    setIsPublic(true);
    setEditId(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Удалить это значение?")) {
      await deleteAttributeValue(id);
      refreshValues();
    }
  };

  if (!attribute) return <div className="p-6 text-gray-600">Загрузка...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Значения атрибута</h1>

      {/* Информация об атрибуте */}
      <div className="bg-gray-100 rounded p-4 mb-6 shadow-sm">
        <p><strong>ID:</strong> {attribute.id}</p>
        <p><strong>Код:</strong> {attribute.code}</p>
        <p><strong>Название (RU):</strong> {attribute.nameRu}</p>
        <p><strong>Тип:</strong> {attribute.type}</p>
      </div>

      {/* Форма добавления / редактирования */}
      <form
        onSubmit={handleAddOrEdit}
        className="bg-white rounded shadow p-4 mb-6 space-y-4 border"
      >
        <div>
          <label className="block font-medium text-gray-700">Значение</label>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded"
            placeholder="Введите значение"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label>Публичное</label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editId !== null ? "Сохранить" : "Добавить"}
          </button>

          {editId !== null && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Отмена
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/mod/attributes")}
            className="ml-auto bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Назад
          </button>
        </div>
      </form>

      {/* Таблица значений */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border rounded shadow">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Значение</th>
              <th className="px-4 py-2 border">Публичное</th>
              <th className="px-4 py-2 border">Действия</th>
            </tr>
          </thead>
          <tbody>
            {values.map((val) => (
              <tr key={val.id} className="border-t">
                <td className="px-4 py-2">{val.id}</td>
                <td className="px-4 py-2">{val.value}</td>
                <td className="px-4 py-2">{val.isPublic ? "✅" : "❌"}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(val)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(val.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {values.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  Значений пока нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttributeValueEditorPage;
