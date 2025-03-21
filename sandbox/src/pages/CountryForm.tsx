import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Country } from "../types/types";
import {
  fetchCountry,
  createCountry,
  updateCountry,
} from "../apidata/countryApi";

const CountryForm: React.FC<CountryFormProps> = ({ isEditMode = false }) => {
  const [country, setCountry] = useState<Country>({
    countryCode: "",
    nameRu: "",
    nameKz: "",
    nameEn: "",
    isPublic: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { countryCode } = useParams<{ countryCode: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode && countryCode) {
      setLoading(true);
      fetchCountry(countryCode)
        .then((data) => {
          setCountry((prev) => ({
            ...prev,
            ...data,
            isPublic: data.isPublic ?? prev.isPublic, // Гарантия наличия isPublic
          }));
        })
        .catch(() => setError("Ошибка при загрузке данных страны"))
        .finally(() => setLoading(false));
    }
  }, [isEditMode, countryCode]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type, checked } = e.currentTarget;
      setCountry((prev) => ({
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
        const payload = { ...country, isPublic: Boolean(country.isPublic) };

        if (isEditMode) {
          await updateCountry(country.countryCode, payload);
        } else {
          await createCountry(payload);
        }

        navigate("/mod/countries");
      } catch (err) {
        setError("Ошибка при сохранении данных страны");
      } finally {
        setLoading(false);
      }
    },
    [country, isEditMode, navigate]
  );

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? "Редактировать страну" : "Добавить страну"}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Код страны</label>
          <input
            type="text"
            name="countryCode"
            value={country.countryCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            disabled={isEditMode}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Название (RU)</label>
          <input
            type="text"
            name="nameRu"
            value={country.nameRu}
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
            value={country.nameKz}
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
            value={country.nameEn}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="isPublic"
            checked={country.isPublic}
            onChange={handleChange}
            className="mr-2 leading-tight"
            aria-label="Публичная страна"
          />
          <label htmlFor="isPublic" className="text-gray-700">
            Публичная
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
            onClick={() => navigate("/mod/countries")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default CountryForm;
