// components/OfferEditModal.tsx
import React, { useEffect } from "react";
import { OfferFormDTO, OfferAttributeFormDTO } from "../types/types";
import { updateOfferForm } from "../apidata/offerApi";
//import OfferAttributeEditor from "./OfferAttributeEditor";
import AttributeTabs from "./AttributeTabs"; // 👈 добавить
interface Props {
  offer: OfferFormDTO;
  onClose: () => void;
  onSaved: (updated: OfferFormDTO) => void;
}

const OfferEditModal: React.FC<Props> = ({ offer, onClose, onSaved }) => {
  const [form, setForm] = React.useState<OfferFormDTO>(offer);
  const [saving, setSaving] = React.useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

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

        <div className="mb-3">
          <label className="block text-sm font-medium">Описание</label>
          <textarea
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        
        <div className="mb-3">
  <label className="block text-sm font-medium mb-1">Цена и валюта</label>
  <div className="flex gap-2">
    {/* Ввод цены */}
    <input
      type="number"
      value={form.price}
      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
      className="w-2/3 border rounded px-3 py-2"
      placeholder="Введите цену"
    />

    {/* Выбор валюты с иконками */}
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


{/*
  <div className="space-y-4">
    {form.offerAttributeFormList.map((attr, index) => (
      <OfferAttributeEditor
        key={attr.id}
        attribute={attr}
        onChange={(updated) => handleAttrChange(index, updated)}
      />
    ))}
  </div>
*/}

<AttributeTabs
  attributes={form.offerAttributeFormList}
  onChange={(updated, index) => {
    const newAttrs = [...form.offerAttributeFormList];
    newAttrs[index] = updated;
    setForm({ ...form, offerAttributeFormList: newAttrs });
  }}
/>


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
