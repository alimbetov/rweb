import React, { useEffect, useState } from "react";
import {
  uploadFile,
  uploadMultipleFiles,
  fetchLinkedMediaPaged,
  deleteMediaFile,
  setFilePublic,
  setFileAsMain,
} from "../apidata/mediaApi";
import type { StoredFileDTO } from "../apidata/mediaApi";
import { useSwipeable } from "react-swipeable";
import {
  FaImage,
  FaVideo,
  FaFileAlt,
  FaDownload,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
} from "react-icons/fa";

interface Props {
  linkedId: number;
  linkedType: string;
  hideHeader?: boolean;
  hideUploader?: boolean;
}

const renderPreview = (file: StoredFileDTO, onClick?: () => void) => {
  switch (file.mediaType) {
    case "IMAGE":
      return (
        <div onClick={onClick} className="relative cursor-pointer">
          <FaImage className="absolute top-2 left-2 text-white drop-shadow" />
          <img
            src={file.previewUrl}
            alt="preview"
            className="w-full h-40 object-cover rounded-xl"
          />
        </div>
      );
    case "VIDEO":
      return (
        <div onClick={onClick} className="relative cursor-pointer">
          <FaVideo className="absolute top-2 left-2 text-white drop-shadow" />
          <video
            src={file.signedUrl ?? file.url}
            controls
            className="w-full h-40 rounded-xl"
          />
        </div>
      );
    case "DOCUMENT":
      return (
        <div className="flex items-center gap-2 text-blue-600">
          <FaFileAlt />
          <a href={file.signedUrl ?? file.url} target="_blank" rel="noopener noreferrer" className="underline">
            Документ
          </a>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-2 text-blue-600">
          <FaDownload />
          <a href={file.signedUrl ?? file.url} className="underline" target="_blank" rel="noopener noreferrer">
            Скачать файл
          </a>
        </div>
      );
  }
};

const MediaGalleryInline: React.FC<Props> = ({
  linkedId,
  linkedType,
  hideHeader = false,
  hideUploader = false,
}) => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [files, setFiles] = useState<StoredFileDTO[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!linkedId || !linkedType) return;
    setIsLoading(true);
    fetchLinkedMediaPaged(linkedType, linkedId, page, 6)
      .then((res) => {
        setFiles(res.content);
        setTotalPages(res.totalPages);
      })
      .finally(() => setIsLoading(false));
  }, [linkedId, linkedType, refresh, page]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const filesArray = Array.from(event.target.files);
    setIsLoading(true);
    if (filesArray.length === 1) {
      await uploadFile(filesArray[0], linkedType, linkedId);
    } else {
      await uploadMultipleFiles(filesArray, linkedType, linkedId);
    }
    setIsLoading(false);
    setRefresh((prev) => !prev);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const filesArray = Array.from(event.dataTransfer.files);
    setIsLoading(true);
    await uploadMultipleFiles(filesArray, linkedType, linkedId);
    setIsLoading(false);
    setRefresh((prev) => !prev);
  };

  const toggleIsPublic = async (file: StoredFileDTO) => {
    try {
      const newPublicState = file.signedUrl !== null;
      await setFilePublic(file.id, newPublicState);
      setRefresh((prev) => !prev);
    } catch (error) {
      alert("Не удалось изменить статус публичности.");
    }
  };

  const setAsMainImage = async (file: StoredFileDTO) => {
    try {
      await setFileAsMain(file.id);
      alert("Установлено как главное изображение.");
    } catch (error) {
      alert("Не удалось установить как главное. Убедитесь, что файл публичный.");
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => setModalIndex((prev) => (prev !== null && prev < files.length - 1 ? prev + 1 : prev)),
    onSwipedRight: () => setModalIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev)),
    trackMouse: true,
  });

  return (
    <div>
      {!hideHeader && <h3 className="text-lg font-semibold mb-4">🖼 Медиа</h3>}

      {!hideUploader && (
        <div
          className={`border-2 border-dashed rounded-xl p-4 text-center mb-4 transition-colors ${
            isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
        >
          <p className="text-gray-600 text-sm mb-2">Перетащите файлы или выберите вручную</p>
          <input type="file" multiple onChange={handleUpload} className="mx-auto block" />
        </div>
      )}

      {isLoading && <p className="text-sm text-center text-gray-500">Загрузка...</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file, index) => (
          <div
            key={file.id}
            className="bg-white border rounded-xl shadow p-2 flex flex-col gap-2"
          >
            {renderPreview(file, () => setModalIndex(index))}
            {file.editable && (
              <div className="space-y-2 mt-1">
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={file.signedUrl == null}
                    onChange={() => toggleIsPublic(file)}
                  />
                  <span>Публичный</span>
                </label>
                <button
                  onClick={() => setAsMainImage(file)}
                  className="text-xs text-yellow-600 hover:underline"
                >
                  ⭐ Сделать главным
                </button>
                <button
                  onClick={() => {
                    setConfirmDeleteId(file.id);
                    setIsConfirmOpen(true);
                  }}
                  className="text-xs text-red-600 hover:underline"
                >
                  🗑 Удалить
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Модальное окно для просмотра файла */}
      {modalIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div {...handlers} className="relative max-w-full max-h-full">
            <button onClick={() => setModalIndex(null)} className="absolute top-4 right-4 text-white text-2xl">✕</button>
            <button onClick={() => setModalIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-3xl">‹</button>
            <button onClick={() => setModalIndex((prev) => (prev !== null && prev < files.length - 1 ? prev + 1 : prev))} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-3xl">›</button>
            {files[modalIndex].mediaType === "IMAGE" && (
              <img src={files[modalIndex].url} alt="full" className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg" />
            )}
            {files[modalIndex].mediaType === "VIDEO" && (
              <video src={files[modalIndex].signedUrl ?? files[modalIndex].url} controls className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg" />
            )}
          </div>
        </div>
      )}

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Удалить файл?</h3>
            <p className="text-sm text-gray-600 mb-6">Это действие необратимо.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setIsConfirmOpen(false)} className="px-4 py-2 text-sm bg-gray-200 rounded-lg">
                Отмена
              </button>
              <button
                onClick={async () => {
                  if (confirmDeleteId !== null) {
                    await deleteMediaFile(confirmDeleteId);
                    setRefresh((prev) => !prev);
                    setIsConfirmOpen(false);
                    setConfirmDeleteId(null);
                  }
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGalleryInline;
