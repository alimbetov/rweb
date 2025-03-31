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

const renderPreview = (file: StoredFileDTO) => {
  switch (file.mediaType) {
    case "IMAGE":
      return <img src={file.previewUrl} alt="preview" className="w-full h-full object-cover rounded-xl" />;
    case "VIDEO":
      return <video src={file.signedUrl ?? file.url} controls className="w-full h-full rounded-xl" />;
    case "DOCUMENT":
      return <a href={file.signedUrl ?? file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Документ</a>;
    default:
      return <a href={file.signedUrl ?? file.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Скачать файл</a>;
  }
};

export default function MediaGallery() {
  const { linkedId, linkedType } = useParams<{ linkedId: string; linkedType: string }>();
  const [files, setFiles] = useState<StoredFileDTO[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => setActiveIndex((prev) => Math.min(prev + 1, files.length - 1)),
    onSwipedRight: () => setActiveIndex((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
  });

  useEffect(() => {
    if (!linkedId || !linkedType) return;
    setIsLoading(true);
    fetchLinkedMediaPaged(linkedType, Number(linkedId), 0, 100)
      .then((res) => setFiles(res.content))
      .finally(() => setIsLoading(false));
  }, [linkedId, linkedType, refresh]);

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

  const handleDragLeave = () => setIsDragging(false);

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    await deleteMediaFile(id);
    setIsLoading(false);
    setRefresh((prev) => !prev);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">Медиа галерея</h2>

      <div
        className={`mb-6 border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center transition-colors duration-300 ${
          isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <p className="mb-2 sm:mb-3 text-sm sm:text-base text-gray-600">
          Перетащите файлы сюда или выберите вручную:
        </p>
        <label className="cursor-pointer inline-block bg-blue-600 text-white text-sm sm:text-base px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          📁 Выбрать файлы
          <input type="file" multiple onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Загрузка...</p>
      ) : files.length === 0 ? (
        <p className="text-center text-gray-500">Нет файлов</p>
      ) : (
        <div className="relative">
          <div className="flex items-center justify-between mb-4 gap-4">
            <button
              onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
              disabled={activeIndex === 0}
              className="text-3xl px-3 py-1 text-gray-700 disabled:text-gray-300"
            >
              ←
            </button>

            <div className="flex gap-4 overflow-x-auto px-2 py-2 w-full justify-center items-center" {...handlers}>
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className={`transition-transform duration-300 ease-in-out cursor-pointer flex-shrink-0 rounded-xl overflow-hidden shadow relative ${
    index === activeIndex ? "w-96 h-72 scale-100 z-20 border-2 border-blue-500" : "w-32 h-24 scale-90 opacity-70 z-10"
  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  {renderPreview(file)}
                  {file.editable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded shadow"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveIndex((prev) => Math.min(prev + 1, files.length - 1))}
              disabled={activeIndex === files.length - 1}
              className="text-3xl px-3 py-1 text-gray-700 disabled:text-gray-300"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
