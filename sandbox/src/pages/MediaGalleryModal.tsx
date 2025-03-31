import React from "react";
import { FaTimes } from "react-icons/fa";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MediaGalleryModal: React.FC<Props> = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
          title="Закрыть"
        >
          <FaTimes />
        </button>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default MediaGalleryModal;