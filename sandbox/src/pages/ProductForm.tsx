import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProductById,
  createProduct,
  updateProduct,
  fetchCategories,
  fetchSubCategories,
} from "../apidata/productService";
import { Product, Category, SubCategory } from "../types/types";

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // ID товара для редактирования
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product>({
    id: 0,
    nameRu: "",
    nameKz: "",
    nameEn: "",
    isPublic: true,
    categoryCode: "",
    subCategoryCode: "",
    productAttributes: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<
    SubCategory[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategoriesAndSubCategories();
  }, []);

  useEffect(() => {
    if (id) {
      loadProduct(Number(id));
    }
  }, [id]);

  useEffect(() => {
    // Фильтруем подкатегории при изменении категории
    filterSubCategories(product.categoryCode);
  }, [product.categoryCode, subCategories]);

  // ✅ Загружаем категории и подкатегории
  const loadCategoriesAndSubCategories = async () => {
    try {
      const categoriesData = await fetchCategories();
      const subCategoriesData = await fetchSubCategories();

      setCategories(categoriesData);
      setSubCategories(subCategoriesData);

      // Если уже выбрана категория, отфильтровать подкатегории сразу
      if (product.categoryCode) {
        filterSubCategories(product.categoryCode);
      }
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
    }
  };

  // ✅ Загружаем товар
  const loadProduct = async (productId: number) => {
    try {
      const data = await fetchProductById(productId);
      setProduct(data);

      // После загрузки товара отфильтровать подкатегории
      filterSubCategories(data.categoryCode);
    } catch (error) {
      console.error("Ошибка загрузки товара:", error);
    }
  };

  // ✅ Фильтрация подкатегорий по `categoryCode`
  const filterSubCategories = (categoryCode: string) => {
    if (!categoryCode) {
      setFilteredSubCategories([]);
      return;
    }
    const filtered = subCategories.filter(
      (sub) => sub.categoryCode === categoryCode
    );
    setFilteredSubCategories(filtered);
  };

  // ✅ Обрабатываем изменения в форме
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "categoryCode") {
      setProduct((prev) => ({
        ...prev,
        subCategoryCode: "", // ⚡ Сбрасываем подкатегорию при изменении категории
      }));
    }
  };

  // ✅ Сохранение товара (создание/редактирование)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await updateProduct(Number(id), product);
      } else {
        await createProduct(product);
      }

      navigate("/mod/products");
    } catch (err) {
      setError("Ошибка при сохранении товара.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Редактировать товар" : "Добавить товар"}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Название (RU) */}
        <div className="mb-4">
          <label className="block text-gray-700">Название (RU)</label>
          <input
            type="text"
            name="nameRu"
            value={product.nameRu}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Название (KZ) */}
        <div className="mb-4">
          <label className="block text-gray-700">Название (KZ)</label>
          <input
            type="text"
            name="nameKz"
            value={product.nameKz}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Название (EN) */}
        <div className="mb-4">
          <label className="block text-gray-700">Название (EN)</label>
          <input
            type="text"
            name="nameEn"
            value={product.nameEn}
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
            value={product.categoryCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Выберите категорию</option>
            {categories.map((category) => (
              <option key={category.code} value={category.code}>
                {category.nameRu}
              </option>
            ))}
          </select>
        </div>

        {/* Выбор подкатегории (динамическая) */}
        <div className="mb-4">
          <label className="block text-gray-700">Подкатегория</label>
          <select
            name="subCategoryCode"
            value={product.subCategoryCode || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            disabled={
              !product.categoryCode || filteredSubCategories.length === 0
            } // ⚡ Блокируем, если нет подкатегорий
          >
            <option value="">Выберите подкатегорию</option>
            {filteredSubCategories.map((subCategory) => (
              <option key={subCategory.code} value={subCategory.code}>
                {subCategory.nameRu}
              </option>
            ))}
          </select>
        </div>

        {/* Флажок "Публичный" */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="isPublic"
            checked={product.isPublic}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
          <label className="text-gray-700">Публичный</label>
        </div>

        {/* Кнопки */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {loading ? "Сохранение..." : id ? "Обновить" : "Добавить"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/mod/products")}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
