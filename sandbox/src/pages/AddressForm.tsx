import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCities,
  fetchUserAddresses,
  addUserAddress,
  updateUserAddress,
} from "../apidata/profileApi";
import { AddressDTO, CityLocalDto } from "../types/types";

const AddressForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cities, setCities] = useState<CityLocalDto[]>([]);
  const [address, setAddress] = useState<Partial<AddressDTO>>({
    isPublic: true,
    streetAddress: "",
    postalCode: "",
    cityCode: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setCities(await fetchCities());
        if (id) {
          const allAddresses = await fetchUserAddresses();
          const editingAddress = allAddresses.find((a) => a.id === Number(id));
          if (editingAddress) setAddress(editingAddress);
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    loadData();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.streetAddress || !address.cityCode || !address.postalCode) {
      alert("Заполните все поля");
      return;
    }
    try {
      if (id) {
        await updateUserAddress(Number(id), address as AddressDTO);
      } else {
        await addUserAddress(address as AddressDTO);
      }
      navigate("/guser/addresses");
    } catch (error) {
      console.error("Ошибка сохранения адреса:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {id ? "✏ Редактирование адреса" : "➕ Добавить новый адрес"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="streetAddress"
          value={address.streetAddress}
          onChange={handleInputChange}
          placeholder="Улица, дом"
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="postalCode"
          value={address.postalCode}
          onChange={handleInputChange}
          placeholder="Почтовый индекс"
          className="w-full border p-2 rounded"
        />

        {/* 🏙 Выбор города */}
        <select
          name="cityCode"
          value={address.cityCode}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Выберите город</option>
          {cities.map((city) => (
            <option key={city.cityCode} value={city.cityCode}>
              {city.name}
            </option>
          ))}
        </select>

        {/* Чекбокс публичности */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={address.isPublic}
            onChange={() =>
              setAddress({ ...address, isPublic: !address.isPublic })
            }
          />
          <span className="text-sm">Сделать адрес публичным</span>
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {id ? "💾 Сохранить изменения" : "➕ Добавить адрес"}
        </button>

        <button
          onClick={() => navigate("/guser/addresses")}
          className="w-full bg-gray-400 text-white p-2 rounded mt-2 hover:bg-gray-500"
        >
          Отмена
        </button>
      </form>
    </div>
  );
};

export default AddressForm;
