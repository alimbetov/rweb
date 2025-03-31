import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OfferFormDTO } from "../types/types";
import { fetchOfferById } from "../apidata/offerApi";
import OfferViewCard from "../pages/OfferViewCard";

const OfferViewPage: React.FC = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<OfferFormDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!offerId) return;
    fetchOfferById(Number(offerId))
      .then(setOffer)
      .catch(() => alert("❌ Не удалось загрузить оффер"))
      .finally(() => setLoading(false));
  }, [offerId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow text-center">Загрузка...</div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow text-center text-red-500">Оффер не найден</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
        <div className="p-6">
          <OfferViewCard offer={offer} />
        </div>
      </div>
    </div>
  );
};

export default OfferViewPage;
