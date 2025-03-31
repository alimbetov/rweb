// src/components/OfferMediaTab.tsx
import React from "react";
import MediaGalleryInline from "./MediaGalleryInline"; // это "облегчённая" версия MediaGallery без заголовков, pagination, dropzone
interface Props {
  offerId: number;
}

const OfferMediaTab: React.FC<Props> = ({ offerId }) => {
  return (
    <div className="mt-4">
      <MediaGalleryInline linkedId={offerId} linkedType="PRODUCT_GALLERY" />
    </div>
  );
};

export default OfferMediaTab;
