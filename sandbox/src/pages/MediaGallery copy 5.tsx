import React, { useEffect, useState } from "react";
import {
  uploadFile,
  uploadMultipleFiles,
  fetchLinkedMediaPaged,
  deleteMediaFile,
} from "../apidata/mediaApi";
import type { StoredFileDTO } from "../apidata/mediaApi";
import { useParams } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { FaImage, FaVideo, FaFileAlt, FaDownload, FaTrash, FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
          <a
            href={file.signedUrl ?? file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Документ
          </a>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-2 text-blue-600">
          <FaDownload />
          <a
            href={file.signedUrl ?? file.url}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Скачать файл
          </a>
        </div>
      );
  }
};

export default function MediaGallery() {
  const { linkedId, linkedType } = useParams<{ linkedId: string; linkedType: string }>();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [files, setFiles] = useState<StoredFileDTO[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [showUploadButton, setShowUploadButton] = useState(true);

  useEffect(() => {
    if (!linkedId || !linkedType) return;
    setIsLoading(true);
    fetchLinkedMediaPaged(linkedType, Number(linkedId), page, 3)
      .then((res) => {
        setFiles(res.content);
        setTotalPages(res.totalPages);
        const hasEditable = res.content.length === 0 || res.content.some((file: StoredFileDTO) => file.editable);
        setShowUploadButton(hasEditable);
      })
      .finally(() => setIsLoading(false));
  }, [linkedId, linkedType, refresh, page]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !linkedId) return;
    const filesArray = Array.from(event.target.files);
    setIsLoading(true);
    if (filesArray.length === 1) {
      await uploadFile(filesArray[0], linkedType, Number(linkedId));
    } else {
      await uploadMultipleFiles(filesArray, linkedType, Number(linkedId));
    }
    setIsLoading(false);
    setRefresh((prev) => !prev);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (!linkedId) return;
    const filesArray = Array.from(event.dataTransfer.files);
    setIsLoading(true);
    await uploadMultipleFiles(filesArray, linkedType, Number(linkedId));
    setIsLoading(false);
    setRefresh((prev) => !prev);
  };

  const toggleIsPublic = (file: StoredFileDTO) => {
    alert(`Тут можно реализовать изменение isPublic для файла ID: ${file.id}`);
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    await deleteMediaFile(id);
    setIsLoading(false);
    setRefresh((prev) => !prev);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => setModalIndex((prev) => (prev !== null && prev < files.length - 1 ? prev + 1 : prev)),
    onSwipedRight: () => setModalIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev)),
    trackMouse: true,
  });

  const isEditableGallery = files.some((file) => file.editable) || files.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">Медиа галерея</h2>

      <div
        className={`mb-6 border-2 border-dashed rounded-2xl p-6 text-center transition-colors duration-300 ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"}`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        {showUploadButton && (
          <>
            <p className="mb-3 text-base text-gray-600">Перетащите файлы сюда или выберите вручную:</p>
            <input type="file" multiple onChange={handleUpload} className="mx-auto block mb-4" />
          </>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 items-center flex-wrap mt-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              ←
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-3 py-1 rounded ${i === page ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              →
            </button>
          </div>
        )}
      </div>

      {isLoading && <p className="text-center text-gray-500 mb-4">Загрузка...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto">
        {files.map((file, index) => (
          <div
            key={file.id}
            className="border rounded-2xl shadow p-4 bg-white flex flex-col gap-3 hover:shadow-md transition-shadow"
          >
            {renderPreview(file, () => setModalIndex(index))}

            {file.editable && (
              <>
                <label className="flex items-center gap-2 text-sm mt-2">
                  <input
                    type="checkbox"
                    checked={file.signedUrl == null}
                    onChange={() => toggleIsPublic(file)}
                  />
                  <span>Публичный доступ</span>
                </label>

                <button
                  onClick={() => handleDelete(file.id)}
                  className="text-red-600 text-sm hover:underline mt-1"
                >
                  Удалить
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {files.length === 0 && !isLoading && !isEditableGallery && (
        <div className="mt-10 text-center text-gray-500 text-sm">Нет доступных файлов для отображения</div>
      )}

      {modalIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div {...handlers} className="relative max-w-full max-h-full">
            <button
              onClick={() => setModalIndex(null)}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              ✕
            </button>
            <button
              onClick={() => setModalIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-3xl"
            >
              ‹
            </button>
            <button
              onClick={() => setModalIndex((prev) => (prev !== null && prev < files.length - 1 ? prev + 1 : prev))}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-3xl"
            >
              ›
            </button>

            {files[modalIndex].mediaType === "IMAGE" && (
              <img
                src={files[modalIndex].url}
                alt="full"
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
              />
            )}
            {files[modalIndex].mediaType === "VIDEO" && (
              <video
                src={files[modalIndex].signedUrl ?? files[modalIndex].url}
                controls
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
              />
            )}
          </div>
        </div>
      )}

<div
        className={`mb-6 border-2 border-dashed rounded-2xl p-6 text-center transition-colors duration-300 ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"}`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
  

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 items-center flex-wrap mt-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              ←
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-3 py-1 rounded ${i === page ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              →
            </button>
          </div>
        )}
      </div>

    </div>
  );
}