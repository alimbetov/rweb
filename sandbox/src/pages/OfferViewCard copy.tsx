import React from "react";
import { OfferFormDTO } from "../types/types";

interface Props {
  offer: OfferFormDTO;
}

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

const OfferViewCard: React.FC<Props> = ({ offer }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 space-y-4 text-sm">
      {/* Фото */}
      <div className="w-full aspect-video bg-gray-100 rounded overflow-hidden flex items-center justify-center">
        {offer.offerPhotoUrl ? (
          <img
            src={offer.offerPhotoUrl}
            alt="Фото оффера"
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-gray-400">📷 Без фото</span>
        )}
      </div>

      {/* Цена и статус */}
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold text-gray-800">
          {offer.price} {currencyMap[offer.preferredCurrency]}
        </div>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
          {statusMap[offer.status]}
        </span>
      </div>

      {/* Описание */}
      {offer.description && (
        <p className="text-gray-700 whitespace-pre-wrap">{offer.description}</p>
      )}

      {/* Атрибуты */}
      {offer.offerAttributeFormList.length > 0 && (
        <div className="border-t pt-3 mt-2">
          <h4 className="font-medium text-gray-800 mb-2">🧩 Характеристики:</h4>
          <ul className="space-y-1">
            {offer.offerAttributeFormList.map((attr) => (
              <li key={attr.id} className="flex justify-between text-gray-700">
                <span className="font-medium">{attr.attributeTitle || attr.attributeId}</span>
                <span className="text-right text-gray-600">
                  {renderAttributeValue(attr)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// 🔍 Функция для отображения значения атрибута
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
