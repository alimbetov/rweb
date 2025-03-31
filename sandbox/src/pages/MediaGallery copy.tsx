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




const renderPreview = (file: StoredFileDTO, onClick?: () => void) => {
  switch (file.mediaType) {
    case "IMAGE":
      return (
        <img
          src={file.previewUrl}
          alt="preview"
          className="w-full h-40 object-cover rounded-xl cursor-pointer"
          onClick={onClick}
        />
      );
    case "VIDEO":
      return (
        <video
          src={file.signedUrl ?? file.url}
          controls
          className="w-full h-40 rounded-xl cursor-pointer"
          onClick={onClick}
        />
      );
    case "DOCUMENT":
      return (
        <a
          href={file.signedUrl ?? file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Документ
        </a>
      );
    default:
      return (
        <a
          href={file.signedUrl ?? file.url}
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Скачать файл
        </a>
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



  useEffect(() => {
    if (!linkedId || !linkedType) return;
    setIsLoading(true);
    fetchLinkedMediaPaged(linkedType, Number(linkedId), page, 3) // можно 3 на странице
      .then((res) => {
        setFiles(res.content);
        setTotalPages(res.totalPages); // обновляем количество страниц
      })
      .finally(() => setIsLoading(false));
  }, [linkedId, linkedType, refresh, page]); // ⚠️ добавь `page` в зависимости!



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

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    await deleteMediaFile(id);
    setIsLoading(false);
    setRefresh((prev) => !prev);
  };

  const toggleIsPublic = (file: StoredFileDTO) => {
    alert(`Тут можно реализовать изменение isPublic для файла ID: ${file.id}`);
  };

  const isEditableGallery = files.some((file) => file.editable) || files.length === 0;

  const handlers = useSwipeable({
    onSwipedLeft: () => setModalIndex((prev) => (prev !== null && prev < files.length - 1 ? prev + 1 : prev)),
    onSwipedRight: () => setModalIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev)),
    trackMouse: true,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">Медиа галерея</h2>


      {totalPages > 1 && (
  <div className="flex justify-center mt-6 gap-2 items-center flex-wrap">
    <button
      onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
      disabled={page === 0}
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      ← Назад
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
      Вперёд →
    </button>
  </div>
)}


      {isEditableGallery && (
        <div
          className={`mb-6 border-2 border-dashed rounded-2xl p-6 text-center transition-colors duration-300 ${
            isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <p className="mb-3 text-base text-gray-600">Перетащите файлы сюда или выберите вручную:</p>
          <input type="file" multiple onChange={handleUpload} className="mx-auto block" />
        </div>
      )}

      {isLoading && <p className="text-center text-gray-500 mb-4">Загрузка...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
}
