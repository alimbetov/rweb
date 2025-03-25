import React, { useEffect, useState } from "react";
import { OfferFormDTO } from "../types/types";
import { fetchFilteredOffers } from "../apidata/offerApi";
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



  useEffect(() => {
    setPage(0);
    loadOffers();
  }, [productId, other, page, sortField, sortOrder]);

  const loadOffers = () => {
    setLoading(true);
    fetchFilteredOffers({
      productId,
      other,
      page,
      size: 5,
      sort: `${sortField},${sortOrder}`,
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
      {loading ? (
        <p className="text-sm text-blue-500">Загрузка офферов...</p>
      ) : offers.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Офферы не найдены</p>
      ) : (

        <div>
<div className="mb-4 flex gap-2 items-center">
  <label className="text-sm font-medium text-gray-700">Сортировка:</label>
  <select
    value={`${sortField},${sortOrder}`}
    onChange={(e) => {
      const [field, order] = e.target.value.split(",");
      setSortField(field);
      setSortOrder(order as "asc" | "desc");
    }}
    className="border rounded px-2 py-1 text-sm"
  >
    <option value="updatedAt,desc">🕒 По дате (новые → старые)</option>
    <option value="updatedAt,asc">🕒 По дате (старые → новые)</option>
    <option value="price,asc">💰 Цена (по возрастанию)</option>
    <option value="price,desc">💰 Цена (по убыванию)</option>
  </select>
</div>
<div>
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
</div>
        </div>

  

      )}

      {totalPages > 1 && (
        <div className="mt-4 flex gap-2">
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
