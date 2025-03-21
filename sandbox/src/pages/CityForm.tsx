import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { City, Country } from "../types/types";
import {
  fetchCity,
  createCity,
  updateCity,
  fetchCountries,
} from "../apidata/countryApi";

const CityForm: React.FC<{ isEditMode?: boolean }> = ({
  isEditMode = false,
}) => {
  const [city, setCity] = useState<City>({
    cityCode: "",
    nameRu: "",
    nameKz: "",
    nameEn: "",
    isPublic: true,
    countryCode: "", // Выбираем из списка стран
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { cityCode } = useParams<{ cityCode: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Загружаем список стран для выбора
    fetchCountries()
      .then(setCountries)
      .catch(() => setError("Ошибка загрузки списка стран"));

    // Если режим редактирования, загружаем данные города
    if (isEditMode && cityCode) {
      setLoading(true);
      fetchCity(cityCode)
        .then((data) => {
          setCity((prev) => ({
            ...prev,
            ...data,
            isPublic: data.isPublic ?? prev.isPublic, // Гарантия наличия isPublic
          }));
        })
        .catch(() => setError("Ошибка при загрузке данных города"))
        .finally(() => setLoading(false));
    }
  }, [isEditMode, cityCode]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type, checked } = e.currentTarget;
      setCity((prev) => ({
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
        const payload = { ...city, isPublic: Boolean(city.isPublic) };

        if (isEditMode) {
          await updateCity(city.cityCode, payload);
        } else {
          await createCity(payload);
        }

        navigate("/mod/cities");
      } catch (err) {
        setError("Ошибка при сохранении данных города");
      } finally {
        setLoading(false);
      }
    },
    [city, isEditMode, navigate]
  );

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? "Редактировать город" : "Добавить город"}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Код города</label>
          <input
            type="text"
            name="cityCode"
            value={city.cityCode}
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
            value={city.nameRu}
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
            value={city.nameKz}
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
            value={city.nameEn}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Страна</label>
          <select
            name="countryCode"
            value={city.countryCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Выберите страну</option>
            {countries.map((country) => (
              <option key={country.countryCode} value={country.countryCode}>
                {country.nameRu} ({country.countryCode})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="isPublic"
            checked={city.isPublic}
            onChange={handleChange}
            className="mr-2 leading-tight"
            aria-label="Публичный город"
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
            onClick={() => navigate("/mod/cities")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default CityForm;
