import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProductByproductId,
  fetchAttributeDTOList,
  bindAttributeToProduct,
  unbindAttributeFromProduct,
} from "../apidata/productAtrebutesApi";
import { Product, Attribute } from "../types/types";

const ProductAttributesForm: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [boundAttributes, setBoundAttributes] = useState<Attribute[]>([]); // Привязанные атрибуты
  const [availableAttributes, setAvailableAttributes] = useState<Attribute[]>(
    []
  ); // Доступные для привязки
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      loadProductInfo(Number(productId));
      loadAttributes(Number(productId));
    }
  }, [productId]);

  const loadProductInfo = async (id: number) => {
    try {
      const data: Product = await fetchProductByproductId(id);
      setProduct(data);
    } catch (err) {
      setError("Ошибка загрузки информации о товаре");
    }
  };

  const loadAttributes = async (id: number) => {
    try {
      setLoading(true);
      const boundData: Attribute[] = await fetchAttributeDTOList(id, true); // Привязанные
      const availableData: Attribute[] = await fetchAttributeDTOList(id, false); // Доступные
      setBoundAttributes(boundData);
      setAvailableAttributes(availableData);
    } catch (err) {
      setError("Ошибка загрузки атрибутов");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      if (searchQuery.trim() === "") {
        loadAttributes(Number(productId));
      } else {
        const data: Attribute[] = await fetchAttributeDTOList(
          Number(productId),
          false
        );
        const filteredAttributes = data.filter(
          (attr) =>
            attr.nameRu.toLowerCase().includes(searchQuery.toLowerCase()) ||
            attr.nameKz.toLowerCase().includes(searchQuery.toLowerCase()) ||
            attr.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setAvailableAttributes(filteredAttributes);
      }
    } catch (err) {
      setError("Ошибка поиска атрибутов");
    } finally {
      setLoading(false);
    }
  };

  const handleBindAttribute = async (attributeId: number) => {
    if (!productId) return;

    try {
      await bindAttributeToProduct(Number(productId), attributeId);
      loadAttributes(Number(productId));
    } catch (err) {
      setError("Ошибка привязки атрибута");
    }
  };

  const handleUnbindAttribute = async (attributeId: number) => {
    if (!productId) return;

    try {
      await unbindAttributeFromProduct(Number(productId), attributeId);
      loadAttributes(Number(productId));
    } catch (err) {
      setError("Ошибка удаления атрибута");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Редактирование атрибутов продукта
      </h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* Информация о товаре */}
      {product && (
        <div className="mb-4 p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-semibold">Информация о товаре</h2>
          <p>
            <strong>ID:</strong> {product.id}
          </p>
          <p>
            <strong>Название (RU):</strong> {product.nameRu}
          </p>
          <p>
            <strong>Название (KZ):</strong> {product.nameKz}
          </p>
          <p>
            <strong>Название (EN):</strong> {product.nameEn}
          </p>
          <p>
            <strong>Категория:</strong> {product.categoryCode}
          </p>
          {product.subCategoryCode && (
            <p>
              <strong>Подкатегория:</strong> {product.subCategoryCode}
            </p>
          )}
          <p>
            <strong>Публичный:</strong> {product.isPublic ? "Да" : "Нет"}
          </p>
        </div>
      )}

      {/* Поле поиска */}
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Поиск по названию атрибута"
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

      {/* Привязанные атрибуты */}
      <h2 className="text-xl font-semibold mb-2">Привязанные атрибуты</h2>
      <table className="min-w-full bg-white mb-4">
        <thead>
          <tr>
            <th className="py-2 border">ID</th>
            <th className="py-2 border">Название</th>
            <th className="py-2 border">Тип</th>
            <th className="py-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {boundAttributes.length > 0 ? (
            boundAttributes.map((attr) => (
              <tr key={attr.id}>
                <td className="border px-4 py-2">{attr.id}</td>
                <td className="border px-4 py-2">{attr.nameRu}</td>
                <td className="border px-4 py-2">{attr.type}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleUnbindAttribute(attr.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    ❌ Отвязать
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4">
                Нет привязанных атрибутов
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Доступные для привязки атрибуты */}
      <h2 className="text-xl font-semibold mb-2">Доступные атрибуты</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 border">ID</th>
            <th className="py-2 border">Название</th>
            <th className="py-2 border">Тип</th>
            <th className="py-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {availableAttributes.length > 0 ? (
            availableAttributes.map((attr) => (
              <tr key={attr.id}>
                <td className="border px-4 py-2">{attr.id}</td>
                <td className="border px-4 py-2">{attr.nameRu}</td>
                <td className="border px-4 py-2">{attr.type}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleBindAttribute(attr.id)}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    ➕ Привязать
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4">
                Все атрибуты привязаны
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductAttributesForm;
