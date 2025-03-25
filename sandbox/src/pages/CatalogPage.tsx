import React, { useEffect, useState } from "react";
import { CatalogNodeDto } from "../types/types";
import { fetchCatalogTree } from "../apidata/catalogApi";
import CatalogTree from "../pages/CatalogTree";
import { XMarkIcon } from "@heroicons/react/24/solid";
import OfferList from "../pages/OfferList"; // или путь куда положишь
import { generateOfferForm } from "../apidata/offerApi";
const CatalogPage: React.FC = () => {
  const [tree, setTree] = useState<CatalogNodeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeaf, setSelectedLeaf] = useState<CatalogNodeDto | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<"mine" | "others">("mine");
  
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

        {selectedLeaf && (
  <div className="mt-6">
    {selectedLeaf.action && (
      <button
        onClick={() =>
          generateOfferForm(Number(selectedLeaf.id)).then(() => {
            alert("✅ Оффер успешно создан");
            console.log("🔨 Оффер создан для productId:", selectedLeaf.id);
          })
        }
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mb-4"
      >
        ➕ Создать оффер
      </button>
    )}

    {/* Tabs */}
    <div>
      <div className="flex space-x-4 border-b mb-4">
        <button
          className={`pb-2 px-3 border-b-2 font-medium ${
            tab === "mine"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => {
            console.log("🧍‍♂️ Мои офферы | productId:", selectedLeaf.id);
            setTab("mine");
          }}
        >
          🧍‍♂️ Мои офферы
        </button>
        <button
          className={`pb-2 px-3 border-b-2 font-medium ${
            tab === "others"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => {
            console.log("🌍 Офферы других | productId:", selectedLeaf.id);
            setTab("others");
          }}
        >
          🌍 Офферы других
        </button>
      </div>

      <div>
        {tab === "mine" && (
          <OfferList productId={Number(selectedLeaf.id)} other={false} />
        )}
        {tab === "others" && (
          <OfferList productId={Number(selectedLeaf.id)} other={true} />
        )}
      </div>
    </div>
  </div>
)}




      </div>
    </div>
  );
};

export default CatalogPage;
