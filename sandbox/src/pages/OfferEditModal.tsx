import React, { useEffect, useState } from "react";
import { OfferFormDTO, OfferAttributeFormDTO, AddressLocalDTO } from "../types/types";
import { updateOfferForm, fetchUserLocalAddresses, fetchUserPubAddress } from "../apidata/offerApi";

import AttributeTabs from "./AttributeTabs";

interface Props {
  offer: OfferFormDTO;
  onClose: () => void;
  onSaved: (updated: OfferFormDTO) => void;
}

const OfferEditModal: React.FC<Props> = ({ offer, onClose, onSaved }) => {
  const [form, setForm] = useState<OfferFormDTO>(offer);
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState<AddressLocalDTO[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // 👇 Загрузка всех адресов + текущего (если его нет в списке)
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const data = await fetchUserLocalAddresses();
        let result = data;

        // Проверка: если текущий addressId не найден — подгрузи его отдельно
        const exists = data.find(addr => addr.id === offer.addressId);
        if (!exists && offer.addressId) {
          const single = await fetchUserPubAddress(offer.addressId);
          result = [...data, single];
        }

        setAddresses(result);
      } catch (e) {
        alert("⚠️ Ошибка загрузки адресов");
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [offer.addressId]);

  const handleAddressChange = (id: number) => {
    const selected = addresses.find((a) => a.id === id);
    if (!selected) return;
    setForm({ ...form, addressId: selected.id, addressTitle: selected.title });
  };

  const handleAttrChange = (index: number, updated: OfferAttributeFormDTO) => {
    const updatedAttrs = [...form.offerAttributeFormList];
    updatedAttrs[index] = updated;
    setForm({ ...form, offerAttributeFormList: updatedAttrs });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateOfferForm(form);
      alert("✅ Оффер обновлён");
      onSaved(updated);
      onClose();
    } catch (e) {
      alert("❌ Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-lg">
        <h2 className="text-xl font-semibold mb-4">📝 Редактирование оффера #{form.offerId}</h2>

        {/* Выбор адреса */}
        <div className="mb-3">
          <label className="block text-sm font-medium">Адрес размещения</label>
          <select
            value={form.addressId}
            onChange={(e) => handleAddressChange(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
            disabled={loadingAddresses}
          >
            <option value="" disabled>Выберите адрес...</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.title}
              </option>
            ))}
          </select>
        </div>

        {/* Описание */}
        <div className="mb-3">
          <label className="block text-sm font-medium">Описание</label>
          <textarea
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Цена + валюта */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Цена и валюта</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-2/3 border rounded px-3 py-2"
              placeholder="price"
            />
            <select
              value={form.preferredCurrency}
              onChange={(e) =>
                setForm({
                  ...form,
                  preferredCurrency: e.target.value as OfferFormDTO["preferredCurrency"],
                })
              }
              className="w-1/3 border rounded px-3 py-2 bg-white"
            >
              <option value="USD">💵 USD – Доллар</option>
              <option value="KZT">🇰🇿 KZT – Тенге</option>
              <option value="RUB">🇷🇺 RUB – Рубль</option>
            </select>
          </div>
        </div>

        {/* Статус */}
        <div className="mb-3">
          <label className="block text-sm font-medium">Статус</label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as OfferFormDTO["status"],
              })
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="DRFT">📝 Черновик</option>
            <option value="ACTV">✅ Активный</option>
            <option value="ARCH">📦 Архив</option>
            <option value="PNDG">⏳ На модерации</option>
            <option value="REJC">❌ Отклонён</option>
          </select>
        </div>

        {/* Атрибуты */}
        <AttributeTabs
          attributes={form.offerAttributeFormList}
          onChange={(updated, index) => {
            const newAttrs = [...form.offerAttributeFormList];
            newAttrs[index] = updated;
            setForm({ ...form, offerAttributeFormList: newAttrs });
          }}
        />

        {/* Кнопки */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            ❌ Закрыть
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            💾 {saving ? "Сохраняем..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferEditModal;
