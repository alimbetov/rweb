import React, { useEffect, useState } from "react";
import { CatalogNodeDto } from "../types/types";
import { fetchCatalogTree } from "../apidata/catalogApi";
import CatalogTree from "../pages/CatalogTree";
import { XMarkIcon } from "@heroicons/react/24/solid";

const CatalogPage: React.FC = () => {
  const [tree, setTree] = useState<CatalogNodeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeaf, setSelectedLeaf] = useState<CatalogNodeDto | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchCatalogTree()
      .then(setTree)
      .catch(() => alert("❌ Ошибка загрузки дерева"))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectLeaf = (node: CatalogNodeDto) => {
    setSelectedLeaf(node);
    if (window.innerWidth < 768) {
      setSidebarOpen(false); // Закрываем меню на мобилке
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`fixed md:static z-40 md:z-auto top-0 left-0 w-72 h-full bg-white shadow-lg p-4 transition-transform duration-300 transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-700">📂 Каталог</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-600 hover:text-red-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {loading ? (
          <p className="text-blue-500 text-sm">Загрузка...</p>
        ) : (
          <div className="overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
            <CatalogTree
              nodes={tree}
              filter={search}
              onSelectLeaf={handleSelectLeaf}
            />
          </div>
        )}
      </div>

      {/* Overlay для мобилки */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between md:hidden mb-4">
          <h1 className="text-2xl font-bold">📚 Каталог</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
          >
            Открыть меню
          </button>
        </div>

        {selectedLeaf ? (
          <div className="bg-blue-100 text-blue-800 p-4 rounded shadow">
            <p className="text-sm font-semibold">Выбранный элемент:</p>
            <p className="text-lg mt-1">
              🔎 <strong>{selectedLeaf.title}</strong> <br />
              🆔 Код: <code>{selectedLeaf.id}</code>
            </p>
          </div>
        ) : (
          <div className="text-gray-500 text-sm">Выберите подкатегорию, чтобы продолжить</div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
