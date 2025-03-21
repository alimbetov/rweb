import React, { useEffect, useState } from "react";
import {
  fetchCountries,
  deleteCountry,
  searchCountries,
} from "../apidata/countryApi";
import { Country } from "../types/types";
import { useNavigate } from "react-router-dom";

const CountryList: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    const data = await fetchCountries();
    setCountries(data);
  };

  const handleEdit = (countryCode: string) => {
    navigate(`/mod/countries/edit/${countryCode}`);
  };

  const handleDelete = async (countryCode: string) => {
    await deleteCountry(countryCode);
    loadCountries();
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      loadCountries();
    } else {
      const results = await searchCountries(searchQuery);
      setCountries(results);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Список стран</h1>

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
        onClick={() => navigate("/mod/countries/new")}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Добавить страну
      </button>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Код страны</th>
            <th className="py-2">Название (RU)</th>
            <th className="py-2">Название (KZ)</th>
            <th className="py-2">Название (EN)</th>
            <th className="py-2">Публичная</th>
            <th className="py-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr key={country.countryCode}>
              <td className="border px-4 py-2">{country.countryCode}</td>
              <td className="border px-4 py-2">{country.nameRu}</td>
              <td className="border px-4 py-2">{country.nameKz}</td>
              <td className="border px-4 py-2">{country.nameEn}</td>
              <td className="border px-4 py-2">
                {country.isPublic ? "Да" : "Нет"}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(country.countryCode)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(country.countryCode)}
                  className="px-2 py-1 bg-red-500 text-white rounded mr-2"
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

export default CountryList;
