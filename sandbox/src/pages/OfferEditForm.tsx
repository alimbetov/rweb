import React, { useState } from "react";
import { OfferFormDTO, OfferAttributeFormDTO } from "../types/types";
import { updateOfferForm } from "../apidata/offerApi";
import OfferAttributeEditor from "./OfferAttributeEditor";

interface Props {
  offer: OfferFormDTO;
  onClose: () => void;
  onSaved: (updated: OfferFormDTO) => void;
}

const OfferEditForm: React.FC<Props> = ({ offer, onClose, onSaved }) => {
  const [form, setForm] = useState<OfferFormDTO>(offer);

  const handleAttrChange = (index: number, updated: OfferAttributeFormDTO) => {
    const updatedAttrs = [...form.offerAttributeFormList];
    updatedAttrs[index] = updated;
    setForm({ ...form, offerAttributeFormList: updatedAttrs });
  };

  const handleSave = async () => {
    try {
      const updated = await updateOfferForm(form);
      alert("✅ Сохранено!");
      onSaved(updated);
      onClose();
    } catch (e) {
      alert("❌ Ошибка при сохранении");
    }
  };

  return (
    <div className="border p-4 rounded bg-white shadow-md mt-4">
      <h2 className="text-lg font-semibold mb-3">📝 Редактирование оффера #{form.offerId}</h2>

      <div className="mb-3">
        <label className="block text-sm font-medium">Описание</label>
        <textarea
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Цена</label>
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Атрибуты */}


<div className="max-h-[60vh] overflow-y-auto space-y-3 border p-3 rounded bg-gray-50">
  {form.offerAttributeFormList.map((attr, index) => (
    <OfferAttributeEditor
      key={attr.id}
      attribute={attr}
      onChange={(updated) => handleAttrChange(index, updated)}
    />
  ))}
</div>


      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          💾 Сохранить
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          ❌ Отмена
        </button>
      </div>
    </div>
  );
};

export default OfferEditForm;
