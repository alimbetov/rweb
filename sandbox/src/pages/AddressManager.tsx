import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserAddresses, deleteUserAddress } from "../apidata/profileApi";
import { AddressDTO } from "../types/types";

const AddressManager: React.FC = () => {
  const [addresses, setAddresses] = useState<AddressDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setAddresses(await fetchUserAddresses());
      } catch (error) {
        console.error("Ошибка загрузки адресов:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAddresses();
  }, []);

  const handleDeleteAddress = async (id: number) => {
    try {
      await deleteUserAddress(id);
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Ошибка удаления адреса:", error);
    }
  };

  if (loading) return <p className="text-center">⏳ Загрузка...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">
        🏠 Управление адресами
      </h2>

      <button
        onClick={() => navigate("/guser/profile")}
        className="w-full bg-green-500 text-white p-2 rounded mb-4 hover:bg-green-600"
      >
        назад к профилю
      </button>
      <button
        onClick={() => navigate("/guser/addresses/new")}
        className="w-full bg-green-500 text-white p-2 rounded mb-4 hover:bg-green-600"
      >
        ➕ Добавить новый адрес
      </button>

      {addresses.length > 0 ? (
        <ul className="space-y-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="border p-3 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{address.streetAddress}</p>
                <p className="text-xs text-gray-500">
                  📍 Почтовый индекс: {address.postalCode}:{address.cityCode}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    navigate(`/guser/addresses/edit/${address.id}`)
                  }
                  className="text-blue-500"
                >
                  ✏
                </button>
                <button
                  onClick={() =>
                    navigate(`/guser/address/${address.id}/map`)
                  }
                  className="text-blue-500"
                >
                  🌍 
                </button>        
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="text-red-500"
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">📭 Адресов пока нет.</p>
      )}
    </div>
  );
};

export default AddressManager;
