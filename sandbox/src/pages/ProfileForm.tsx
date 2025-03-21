import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchUserProfile,
  updateUserProfile,
  fetchLanguages,
  fetchCurrencies,
  fetchUserPhones,
  addUserPhone,
  updateUserPhone,
  deleteUserPhone,
} from "../apidata/profileApi";
import {
  ProfileDTO,
  LanguageDTO,
  CurrencyDTO,
  PhoneContactDTO,
} from "../types/types";

const DEFAULT_AVATAR = "https://via.placeholder.com/100?text=Avatar"; // 🔹 Дефолтное фото

const ProfileForm: React.FC = () => {
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [languages, setLanguages] = useState<LanguageDTO[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyDTO[]>([]);
  const [phones, setPhones] = useState<PhoneContactDTO[]>([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchUserProfile();
        setProfile(profileData);
        setLanguages(await fetchLanguages());
        setCurrencies(await fetchCurrencies());
        if (profileData) {
          setPhones(await fetchUserPhones());
        }
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!profile) return;

    const { name, value } = e.target;

    if (name === "preferredLanguage.code") {
      setProfile({
        ...profile,
        preferredLanguage: { ...profile.preferredLanguage, code: value },
      });
    } else if (name === "preferredCurrency.code") {
      setProfile({
        ...profile,
        preferredCurrency: { ...profile.preferredCurrency, code: value },
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  // 🔹 Функция добавления телефона
  const handleAddPhone = async () => {
    try {
      const newPhone: PhoneContactDTO = {
        phoneNumber: "",
        isPublic: true,
        type: "mobile",
      };
      const addedPhone = await addUserPhone(newPhone);
      setPhones([...phones, addedPhone]);
    } catch (error) {
      console.error("Ошибка добавления телефона:", error);
    }
  };

  // 🔹 Функция обновления телефона
  const handlePhoneChange = async (
    id: number,
    field: keyof PhoneContactDTO,
    value: string | boolean
  ) => {
    try {
      const updatedPhone = await updateUserPhone(id, {
        ...phones.find((p) => p.id === id)!,
        [field]: value,
      });
      setPhones(phones.map((p) => (p.id === id ? updatedPhone : p)));
    } catch (error) {
      console.error("Ошибка обновления телефона:", error);
    }
  };

  // 🔹 Функция удаления телефона
  const handleDeletePhone = async (id: number) => {
    try {
      await deleteUserPhone(id);
      setPhones(phones.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Ошибка удаления телефона:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const updatedProfile = await updateUserProfile(profile);
      setProfile(updatedProfile);
      alert("✅ Профиль успешно обновлен!");
    } catch (error) {
      console.error("Ошибка обновления профиля:", error);
      alert("❌ Не удалось обновить профиль");
    }
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Редактирование профиля
      </h2>

      {/* 🔹 Вкладки */}
      <div className="flex border-b mb-4">
        {[
          { key: "profile", label: "Профиль" },
          { key: "phones", label: "Телефоны" },
          { key: "socials", label: "Социальные сети" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`p-2 flex-1 text-center transition-colors duration-200 ${
              activeTab === tab.key
                ? "border-b-2 border-blue-500 font-semibold text-blue-500"
                : "text-gray-500 hover:text-blue-400"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🔹 Вкладка "Профиль" */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md"
        >
          {/* 🔹 Фото профиля */}
          <div className="text-center">
            <label
              htmlFor="profilePhotoUrl"
              className="cursor-pointer block relative w-24 h-24 mx-auto"
            >
              <img
                src={profile?.profilePhotoUrl || DEFAULT_AVATAR}
                alt="Фото профиля"
                className="w-24 h-24 rounded-full border border-gray-300 shadow-md transition hover:opacity-80"
              />
              <span className="absolute bottom-0 right-0 bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                🔄
              </span>
            </label>
          </div>

          {/* 🔹 Поля ввода */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Смена фото */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium">
                🔄 Сменить фото (URL)
              </label>
              <input
                type="text"
                id="profilePhotoUrl"
                name="profilePhotoUrl"
                value={profile?.profilePhotoUrl || ""}
                onChange={handleProfileChange}
                placeholder="Введите ссылку на фото"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Имя профиля */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium">Имя профиля</label>
              <input
                type="text"
                name="profileName"
                value={profile?.profileName || ""}
                onChange={handleProfileChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Выбор языка */}
            <div>
              <label className="block text-sm font-medium">🌐 Язык</label>
              <select
                name="preferredLanguage.code"
                value={profile?.preferredLanguage.code || ""}
                onChange={handleProfileChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 transition"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Выбор валюты */}
            <div>
              <label className="block text-sm font-medium">💰 Валюта</label>
              <select
                name="preferredCurrency.code"
                value={profile?.preferredCurrency.code || ""}
                onChange={handleProfileChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 transition"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 🔹 Кнопка сохранения */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            ✅ Сохранить
          </button>
        </form>
      )}

      {activeTab === "phones" && (
        <div className="space-y-4">
          {/* 🔹 Кнопки управления */}
          <div className="flex flex-col sm:flex-row sm:space-x-2">
            <button
              onClick={handleAddPhone}
              className="w-full sm:w-auto bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
            >
              ➕ Добавить телефон
            </button>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              ✅ Сохранить
            </button>
            <button
              onClick={() => navigate(`/guser/addresses`)}
              className="w-full sm:w-auto bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              📍 Адресная книга
            </button>
          </div>

          {/* 🔹 Список телефонов */}
          <div className="space-y-3">
            {phones.map((phone) => (
              <div
                key={phone.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border p-3 rounded-lg shadow-md bg-white"
              >
                {/* Поле ввода номера */}
                <input
                  type="text"
                  value={phone.phoneNumber}
                  onChange={(e) =>
                    handlePhoneChange(phone.id, "phoneNumber", e.target.value)
                  }
                  placeholder="Введите номер телефона"
                  className="w-full sm:w-2/3 border p-2 rounded focus:ring-2 focus:ring-blue-500 transition"
                />

                {/* Чекбокс публичности */}
                <label className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <input
                    type="checkbox"
                    checked={phone.isPublic}
                    onChange={(e) =>
                      handlePhoneChange(phone.id, "isPublic", e.target.checked)
                    }
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
                  />
                  <span className="text-sm">Публичный</span>
                </label>

                {/* Кнопка удаления с подтверждением */}
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "❗ Вы уверены, что хотите удалить этот номер?"
                      )
                    ) {
                      handleDeletePhone(phone.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-800 transition mt-2 sm:mt-0"
                >
                  🗑 Удалить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 Вкладка "Социальные сети" */}
      {activeTab === "socials" && (
        <div>
          <label className="block text-sm font-medium mb-2">
            🔗 Социальные сети
          </label>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            ✅ Сохранить
          </button>
          {[
            { key: "website", label: "🌍 Веб-сайт" },
            { key: "instagram", label: "📷 Instagram" },
            { key: "email", label: "📧 Email" },
            { key: "telegram", label: "✈️ Telegram" },
          ].map(({ key, label }) => (
            <div
              key={key}
              className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-2"
            >
              <div className="w-full">
                <label htmlFor={key} className="block text-sm font-medium">
                  {label}
                </label>
                <input
                  id={key}
                  type="text"
                  name={key}
                  value={profile?.[key] || ""}
                  onChange={handleProfileChange}
                  placeholder={`Введите ${label}`}
                  title={label} // 🔹 Добавленный title
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={`${key}IsPublic`}
                  checked={profile?.[`${key}IsPublic`]}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      [e.target.name]: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
                />
                <span className="text-sm">Публичный</span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
