import React, { useEffect, useState } from "react";
import { OfferFormDTO, CityLocalDto } from "../types/types";
import { fetchFilteredOffers } from "../apidata/offerApi";
import { fetchCities } from "../apidata/profileApi";
import OfferEditModal from "./OfferEditModal";
import { useNavigate } from "react-router-dom";

interface Props {
  productId: number;
  other: boolean;
  customFilter?: {
    cities?: string[];
    offerAttributeFormList?: any[];
  };
  showStatusFilter?: boolean;
}

const OfferList: React.FC<Props> = ({ productId, other, showStatusFilter, customFilter }) => {
  const [offers, setOffers] = useState<OfferFormDTO[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const [editingOffer, setEditingOffer] = useState<OfferFormDTO | null>(null);

  const [sortField, setSortField] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [cities, setCities] = useState<CityLocalDto[]>([]);
  const [pendingCityCodes, setPendingCityCodes] = useState<string[]>([]);
  const [pendingStatus, setPendingStatus] = useState<string>("");

  const [appliedCityCodes, setAppliedCityCodes] = useState<string[]>([]);
  const [appliedStatus, setAppliedStatus] = useState<string>("");

  useEffect(() => {
    fetchCities().then(setCities).catch(console.error);
  }, []);

  useEffect(() => {
    loadOffers();
  }, [productId, other, page, sortField, sortOrder, appliedCityCodes, appliedStatus, customFilter]);

  const loadOffers = () => {
    setLoading(true);

    fetchFilteredOffers({
      productId,
      other,
      page,
      size: 5,
      sort: `${sortField},${sortOrder}`,
      status: appliedStatus,
      cities: appliedCityCodes,
      ...customFilter,
    })
      .then((res) => {
        setOffers(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(() => alert("❌ Ошибка загрузки офферов"))
      .finally(() => setLoading(false));
  };

  const handleSaved = (updated: OfferFormDTO) => {
    setOffers((prev) => prev.map((o) => (o.offerId === updated.offerId ? updated : o)));
  };

  const handleApplyFilters = () => {
    setAppliedCityCodes(pendingCityCodes);
    setAppliedStatus(pendingStatus);
    setPage(0);
  };

  const handleResetFilters = () => {
    setPendingCityCodes([]);
    setPendingStatus("");
    setAppliedCityCodes([]);
    setAppliedStatus("");
    setPage(0);
  };

  return (
    <div>
      {/* 📦 Фильтры */}
      <div className="flex flex-col gap-4 mb-4">
        <details className="border rounded bg-white shadow p-3" open>
          <summary className="cursor-pointer text-sm font-medium text-blue-600">🔽 Сортировка</summary>
          <div className="mt-2">
            <label className="text-sm font-medium text-gray-700">Выберите:</label>
            <select
              value={`${sortField},${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split(",");
                setSortField(field);
                setSortOrder(order as "asc" | "desc");
                setPage(0);
              }}
              className="border rounded px-2 py-1 text-sm mt-1"
            >
              <option value="updatedAt,desc">🕒 По дате (новые → старые)</option>
              <option value="updatedAt,asc">🕒 По дате (старые → новые)</option>
              <option value="price,asc">💰 Цена (по возрастанию)</option>
              <option value="price,desc">💰 Цена (по убыванию)</option>
            </select>
          </div>
        </details>

        <details className="border rounded bg-white shadow p-3">
          <summary className="cursor-pointer text-sm font-medium text-blue-600">🏙️ Города и Статус</summary>
          <div className="mt-2 flex flex-col gap-3">
            {showStatusFilter && (
              <div>
                <label className="text-sm font-medium text-gray-700">Статус:</label>
                <select
                  value={pendingStatus}
                  onChange={(e) => setPendingStatus(e.target.value)}
                  className="border rounded px-2 py-1 text-sm mt-1"
                >
                  <option value="">Все</option>
                  <option value="ACTV">✅ Активные</option>
                  <option value="DRFT">📝 Черновики</option>
                  <option value="ARCH">📦 Архив</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Города:</label>
              <div className="border rounded p-2 max-h-[150px] overflow-y-auto flex flex-col gap-1 bg-gray-50">
                {cities.map((city) => (
                  <label key={city.cityCode} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      value={city.cityCode}
                      checked={pendingCityCodes.includes(city.cityCode)}
                      onChange={(e) => {
                        const code = e.target.value;
                        setPendingCityCodes((prev) =>
                          e.target.checked ? [...prev, code] : prev.filter((c) => c !== code)
                        );
                      }}
                    />
                    {city.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleApplyFilters}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                🔍 Применить
              </button>
              <button
                onClick={handleResetFilters}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
              >
                🧹 Сбросить
              </button>
            </div>
          </div>
        </details>
      </div>

      {loading ? (
        <p className="text-sm text-blue-500">Загрузка офферов...</p>
      ) : offers.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Офферы не найдены</p>
      ) : (
        <ul className="space-y-2">
          {offers.map((offer) => (
 <li
 key={offer.offerId}
 className="p-3 border rounded shadow-sm bg-white hover:bg-gray-50"
>
 <div className="flex justify-between items-start">
   <div className="flex-1 cursor-pointer" onClick={() => setEditingOffer(offer)}>
     💰 <strong>{offer.price} {offer.preferredCurrency}</strong><br />
     📝 {offer.description || "Без описания"}
   </div>

   <button
     onClick={() => navigate(`/guser/media/${offer.offerId}/PRODUCT_GALLERY`)}
     className="ml-4 text-sm text-blue-600 hover:underline whitespace-nowrap"
     title="Открыть медиа"
   >
     📷 Медиа
   </button>
 </div>
</li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex gap-2 flex-wrap">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-3 py-1 rounded ${i === page ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {editingOffer && (
        <OfferEditModal
          offer={editingOffer}
          onClose={() => setEditingOffer(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default OfferList;
