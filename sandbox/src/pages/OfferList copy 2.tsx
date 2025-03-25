import React, { useEffect, useState } from "react";
import { OfferFormDTO, CityLocalDto } from "../types/types";
import { fetchFilteredOffers } from "../apidata/offerApi";
import { fetchCities } from "../apidata/profileApi";
import OfferEditModal from "./OfferEditModal";

interface Props {
  productId: number;
  other: boolean;
}

const OfferList: React.FC<Props> = ({ productId, other }) => {
  const [offers, setOffers] = useState<OfferFormDTO[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [editingOffer, setEditingOffer] = useState<OfferFormDTO | null>(null);

  const [sortField, setSortField] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [cities, setCities] = useState<CityLocalDto[]>([]);
  const [selectedCityCodes, setSelectedCityCodes] = useState<string[]>([]);
  const [pendingCityCodes, setPendingCityCodes] = useState<string[]>([]);

  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    fetchCities().then(setCities).catch(console.error);
  }, []);

  useEffect(() => {
    loadOffers();
  }, [productId, other, page, sortField, sortOrder, selectedCityCodes, status]);

  const loadOffers = () => {
    setLoading(true);

    const selectedCities: CityLocalDto[] = cities.filter((c) =>
      selectedCityCodes.includes(c.cityCode)
    );

    fetchFilteredOffers({
      productId,
      other,
      page,
      size: 5,
      sort: `${sortField},${sortOrder}`,
      status: status || undefined,
      cities: selectedCities,
    })
      .then((res) => {
        setOffers(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(() => alert("❌ Ошибка загрузки офферов"))
      .finally(() => setLoading(false));
  };

  const handleSaved = (updated: OfferFormDTO) => {
    setOffers((prev) =>
      prev.map((o) => (o.offerId === updated.offerId ? updated : o))
    );
  };

  return (
    <div>
      {/* 📦 Фильтры */}
      <div className="mb-4 flex flex-col gap-4 items-start md:flex-row md:items-center md:justify-between">
        {/* 🔽 Сортировка */}
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium text-gray-700">Сортировка:</label>
          <select
            value={`${sortField},${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split(",");
              setSortField(field);
              setSortOrder(order as "asc" | "desc");
              setPage(0);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="updatedAt,desc">🕒 По дате (новые → старые)</option>
            <option value="updatedAt,asc">🕒 По дате (старые → новые)</option>
            <option value="price,asc">💰 Цена (по возрастанию)</option>
            <option value="price,desc">💰 Цена (по убыванию)</option>
          </select>
        </div>

        {/* 🏷️ Статус */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Статус:</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Все</option>
            <option value="ACTV">✅ Активные</option>
            <option value="DRFT">📝 Черновики</option>
            <option value="ARCH">📦 Архив</option>
          </select>
        </div>

        {/* 🏙️ Города (чекбоксы) */}
        <div className="w-full max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Фильтр по городам:
          </label>
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
                      e.target.checked
                        ? [...prev, code]
                        : prev.filter((c) => c !== code)
                    );
                  }}
                />
                {city.name}
              </label>
            ))}
          </div>

          <div className="mt-2 flex gap-2">
            <button
              onClick={() => {
                setSelectedCityCodes(pendingCityCodes);
                setPage(0);
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              🔍 Применить фильтр
            </button>

            <button
              onClick={() => {
                setPendingCityCodes([]);
                setSelectedCityCodes([]);
                setStatus("");
                setPage(0);
              }}
              className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
            >
              🔄 Сбросить фильтр
            </button>
          </div>
        </div>
      </div>

      {/* 📃 Список офферов */}
      {loading ? (
        <p className="text-sm text-blue-500">Загрузка офферов...</p>
      ) : offers.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Офферы не найдены</p>
      ) : (
        <ul className="space-y-2">
          {offers.map((offer) => (
            <li
              key={offer.offerId}
              className="p-3 border rounded shadow-sm bg-white hover:bg-gray-50 cursor-pointer"
              onClick={() => setEditingOffer(offer)}
            >
              💰 <strong>{offer.price} {offer.preferredCurrency}</strong><br />
              📝 {offer.description || "Без описания"}
            </li>
          ))}
        </ul>
      )}

      {/* 📄 Пагинация */}
      {totalPages > 1 && (
        <div className="mt-4 flex gap-2 flex-wrap">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-3 py-1 rounded ${
                i === page ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* ✏ Модалка редактирования */}
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
