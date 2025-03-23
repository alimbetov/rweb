import React, { useEffect, useState } from "react";
import { fetchCities, deleteCity, searchCities } from "../apidata/countryApi";
import { City } from "../types/types";
import { useNavigate } from "react-router-dom";

const CityList: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    const data = await fetchCities();
    setCities(data);
  };

  const handleEdit = (cityCode: string) => {
    navigate(`/mod/cities/edit/${cityCode}`);
  };

  const handleMapEdit = (cityCode: string) => {
    navigate(`/mod/cities/map/${cityCode}`);
  };
 

  const handleDelete = async (cityCode: string) => {
    await deleteCity(cityCode);
    loadCities();
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      loadCities();
    } else {
      const results = await searchCities(searchQuery);
      setCities(results);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Список городов</h1>

      {/* Поле ввода и кнопка для поиска */}
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

      <button
        onClick={() => navigate("/mod/cities/new")}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Добавить город
      </button>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Код города</th>
            <th className="py-2">Название (RU)</th>
            <th className="py-2">Название (KZ)</th>
            <th className="py-2">Название (EN)</th>
            <th className="py-2">Код страны</th>
            <th className="py-2">Публичный</th>
            <th className="py-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.cityCode}>
              <td className="border px-4 py-2">{city.cityCode}</td>
              <td className="border px-4 py-2">{city.nameRu}</td>
              <td className="border px-4 py-2">{city.nameKz}</td>
              <td className="border px-4 py-2">{city.nameEn}</td>
              <td className="border px-4 py-2">{city.countryCode}</td>
              <td className="border px-4 py-2">
                {city.isPublic ? "Да" : "Нет"}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(city.cityCode)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleMapEdit(city.cityCode)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                >
                  geo позиция
                </button>
                <button
                  onClick={() => handleDelete(city.cityCode)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CityList;
