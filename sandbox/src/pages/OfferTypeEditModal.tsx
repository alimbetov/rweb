import React, { useEffect, useState } from "react";
import {
  DeliveryTypeDTO,
  PaymentTypeDTO,
  fetchDeliveryTypes,
  fetchPaymentTypes,
  saveDeliveryTypes,
  savePaymentTypes,
} from "../apidata/offerTypeApi";

interface Props {
  offerId: number;
  onClose: () => void;
}

const OfferTypeEditModal: React.FC<Props> = ({ offerId, onClose }) => {
  const [tab, setTab] = useState<"DELIVERY" | "PAYMENT">("DELIVERY");
  const [deliveryAvailable, setDeliveryAvailable] = useState<DeliveryTypeDTO[]>([]);
  const [deliverySelected, setDeliverySelected] = useState<DeliveryTypeDTO[]>([]);
  const [paymentAvailable, setPaymentAvailable] = useState<PaymentTypeDTO[]>([]);
  const [paymentSelected, setPaymentSelected] = useState<PaymentTypeDTO[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [availableDelivery, selectedDelivery] = await Promise.all([
        fetchDeliveryTypes(offerId, false),
        fetchDeliveryTypes(offerId, true),
      ]);
      setDeliveryAvailable(availableDelivery);
      setDeliverySelected(selectedDelivery);

      const [availablePayment, selectedPayment] = await Promise.all([
        fetchPaymentTypes(offerId, false),
        fetchPaymentTypes(offerId, true),
      ]);
      setPaymentAvailable(availablePayment);
      setPaymentSelected(selectedPayment);
    };

    loadData();
  }, [offerId]);

  const handleToggle = (type: "delivery" | "payment", item: any) => {
    if (type === "delivery") {
      setDeliverySelected((prev) =>
        prev.some((d) => d.code === item.code)
          ? prev.filter((d) => d.code !== item.code)
          : [...prev, item]
      );
    } else {
      setPaymentSelected((prev) =>
        prev.some((p) => p.code === item.code)
          ? prev.filter((p) => p.code !== item.code)
          : [...prev, item]
      );
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveDeliveryTypes(offerId, deliverySelected);
      await savePaymentTypes(offerId, paymentSelected);
      alert("✅ Сохранено!");
      onClose();
    } catch (e) {
      alert("❌ Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  };

  const renderList = (items: any[], selected: any[], type: "delivery" | "payment") => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {[...items, ...selected.filter((i) => !items.find((a) => a.code === i.code))].map((item) => (
        <label
          key={item.code}
          className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${selected.some((s) => s.code === item.code)
            ? "bg-blue-100 border-blue-500"
            : "bg-white border-gray-300"
          }`}
        >
          <input
            type="checkbox"
            checked={selected.some((s) => s.code === item.code)}
            onChange={() => handleToggle(type, item)}
          />
          {item.name}
        </label>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">🚛 Виды доставки и оплаты</h2>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("DELIVERY")}
            className={`px-4 py-2 rounded ${tab === "DELIVERY" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            🚚 Виды доставки
          </button>
          <button
            onClick={() => setTab("PAYMENT")}
            className={`px-4 py-2 rounded ${tab === "PAYMENT" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            💳 Виды оплаты
          </button>
        </div>

        {tab === "DELIVERY"
          ? renderList(deliveryAvailable, deliverySelected, "delivery")
          : renderList(paymentAvailable, paymentSelected, "payment")}

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

export default OfferTypeEditModal;
