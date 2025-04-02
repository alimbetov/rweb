import React, { useState , useEffect} from "react";
import { OfferFormDTO } from "../types/types";
import OfferMediaTab from "./OfferMediaTab"; // 👈 подключаем
import { fetchUserPubAddress } from "../apidata/offerApi";

interface Props {
  offer: OfferFormDTO;
}

const OfferViewCard: React.FC<Props> = ({ offer }) => {
  const [activeTab, setActiveTab] = useState<"DETAILS" | "MEDIA">("DETAILS");

  const [addressTitle, setAddressTitle] = useState<string | null>(null);

  useEffect(() => {
    const loadAddress = async () => {
      try {
        const data = await fetchUserPubAddress(offer.addressId);
        setAddressTitle(data.title);
      } catch (e) {
        console.warn("Не удалось загрузить адрес", e);
      }
    };

    if (offer.addressId) {
      loadAddress();
    }
  }, [offer.addressId]);



  function formatPrice(price) {
    return Number(price)
      .toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
  }
  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-sm space-y-4">
      <div className="flex gap-4 border-b mb-4 pb-2">

        
        <button
          onClick={() => setActiveTab("DETAILS")}
          className={`px-3 py-1 rounded ${activeTab === "DETAILS" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          📋 Подробности
        </button>
        <button
          onClick={() => setActiveTab("MEDIA")}
          className={`px-3 py-1 rounded ${activeTab === "MEDIA" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          🖼️ Медиа
        </button>
      </div>

      {activeTab === "DETAILS" && (
        <>
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold text-gray-800">
            <strong>{formatPrice(offer.price)} {currencyMap[offer.preferredCurrency]}</strong>
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
        </>
      )}

      {activeTab === "MEDIA" && (
        <OfferMediaTab offerId={offer.offerId} />
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
