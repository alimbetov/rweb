import React, { useState, useEffect } from "react";
import { OfferFormDTO } from "../types/types";
import { fetchUserPubAddress } from "../apidata/offerApi";
import OfferMediaTab from "./OfferMediaTab";
import {
  fetchDeliveryTypes,
  fetchPaymentTypes,
  DeliveryTypeDTO,
  PaymentTypeDTO,
} from "../apidata/offerTypeApi";

interface Props {
  offer: OfferFormDTO;
}

const OfferViewCard: React.FC<Props> = ({ offer }) => {
  const [activeTab, setActiveTab] = useState<"DETAILS" | "HIDDEN">("DETAILS");
  const [addressTitle, setAddressTitle] = useState<string | null>(null);
  const [deliveryTypes, setDeliveryTypes] = useState<DeliveryTypeDTO[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentTypeDTO[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [address, deliveries, payments] = await Promise.all([
          fetchUserPubAddress(offer.addressId),
          fetchDeliveryTypes(offer.offerId, true),
          fetchPaymentTypes(offer.offerId, true),
        ]);
        setAddressTitle(address.title);
        setDeliveryTypes(deliveries);
        setPaymentTypes(payments);
      } catch (e) {
        console.warn("Ошибка при загрузке данных:", e);
      }
    };

    loadData();
  }, [offer.addressId, offer.offerId]);

  function formatPrice(price: number) {
    return Number(price).toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-sm space-y-4">
      {/* 🖼️ Медиа */}
      <OfferMediaTab offerId={offer.offerId} />

      {/* Табы */}
      <div className="flex gap-4 border-b mb-4 pb-2">
        <button
          onClick={() => setActiveTab(activeTab === "DETAILS" ? "HIDDEN" : "DETAILS")}
          className={`px-3 py-1 rounded ${activeTab === "DETAILS" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          📋 Подробности
        </button>
      </div>

      {/* 📋 Детали оффера */}
      {activeTab === "DETAILS" && (
        <>
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold text-gray-800">
              <strong>
                {formatPrice(offer.price)} {currencyMap[offer.preferredCurrency]}
              </strong>
            </div>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
              {statusMap[offer.status]}
            </span>
          </div>

          {offer.description && (
            <p className="text-gray-700 whitespace-pre-wrap">{offer.description}</p>
          )}

          {addressTitle && (
            <div className="text-gray-600">
              <span className="font-medium">📍 Адрес размещения:</span> {addressTitle}
            </div>
          )}

          {/* 🧩 Характеристики */}
          {offer.offerAttributeFormList.length > 0 && (
            <div className="border-t pt-3 mt-2">
              <h4 className="font-medium text-gray-800 mb-2">🧩 Характеристики:</h4>
              <ul className="space-y-1">
                {offer.offerAttributeFormList.map((attr) => (
                  <li key={attr.id} className="flex justify-between text-gray-700">
                    <span className="font-medium">{attr.attributeTitle || attr.attributeId}</span>
                    <span className="text-right text-gray-600">{renderAttributeValue(attr)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 🚚 Виды доставки */}
          {deliveryTypes.length > 0 && (
            <div className="border-t pt-3 mt-2">
              <h4 className="font-medium text-gray-800 mb-2">🚚 Доставка:</h4>
              <ul className="list-disc list-inside text-gray-700">
                {deliveryTypes.map((dt) => (
                  <li key={dt.code}>{dt.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 💳 Виды оплаты */}
          {paymentTypes.length > 0 && (
            <div className="border-t pt-3 mt-2">
              <h4 className="font-medium text-gray-800 mb-2">💳 Оплата:</h4>
              <ul className="list-disc list-inside text-gray-700">
                {paymentTypes.map((pt) => (
                  <li key={pt.code}>{pt.name}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const currencyMap: Record<string, string> = {
  USD: "$",
  KZT: "₸",
  RUB: "₽",
};

const statusMap: Record<string, string> = {
  DRFT: "📝 Черновик",
  ACTV: "✅ Активен",
  ARCH: "📦 Архив",
  PNDG: "⏳ На модерации",
  REJC: "❌ Отклонён",
};

function renderAttributeValue(attr: OfferFormDTO["offerAttributeFormList"][number]) {
  switch (attr.type) {
    case "STRING":
      return attr.inputTextValue || "-";
    case "NUMBER":
      return attr.inputNumberValue?.toString() ?? "-";
    case "BOOLEAN":
      return attr.inputCheckValue ? "✅ Да" : "❌ Нет";
    case "ENUM":
      return attr.inputSelectedValues?.[0] || "-";
    case "MULTISELECT":
      return attr.inputSelectedValues?.join(", ") || "-";
    default:
      return "-";
  }
}

export default OfferViewCard;