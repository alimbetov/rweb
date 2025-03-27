import React, { useEffect, useState } from "react";
import { CatalogNodeDto, OfferFilterRequest } from "../types/types";
import { fetchCatalogTree } from "../apidata/catalogApi";
import CatalogTree from "../pages/CatalogTree";
import OfferList from "../pages/OfferList";
import { generateOfferForm, queryBuilderOffer } from "../apidata/offerApi";

const CatalogPage: React.FC = () => {
  const [tree, setTree] = useState<CatalogNodeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeaf, setSelectedLeaf] = useState<CatalogNodeDto | null>(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"mine" | "others">("mine");
  const [filterModel, setFilterModel] = useState<OfferFilterRequest | null>(null);
  
  
  useEffect(() => {
    fetchCatalogTree()
      .then(setTree)
      .catch(() => alert("❌ Ошибка загрузки дерева"))
      .finally(() => setLoading(false));
  }, []);



  const handleSelectLeaf = async (node: CatalogNodeDto) => {
    setSelectedLeaf(node);
    try {
      const filter = await queryBuilderOffer(Number(node.id));
      setFilterModel(filter);
    } catch (e) {
      console.error("Ошибка загрузки фильтра:", e);
      setFilterModel(null);
    }
  };


  const handleCreateOffer = async () => {
    if (!selectedLeaf) return;
    const confirmed = window.confirm(`Создать оффер для "${selectedLeaf.title}"?`);
    if (!confirmed) return;

    try {
      await generateOfferForm(Number(selectedLeaf.id));
      alert("✅ Оффер успешно создан");
      console.log("🔨 Оффер создан для productId:", selectedLeaf.id);
      // При необходимости: обнови список офферов здесь
    } catch (e) {
      alert("❌ Ошибка при создании оффера");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-6">
      {/* 🔍 Поиск */}
      <div className="w-full max-w-xl mb-6">
        <input
          type="text"
          placeholder="🔍 Поиск по каталогу..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-full px-5 py-2 text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Основной контент */}
      <div className="w-full flex flex-col md:flex-row gap-6 max-w-7xl">
        {/* 🌳 Каталог */}
        <div className="md:w-1/3 w-full bg-white rounded shadow p-4 max-h-[70vh] overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-700 mb-4">📂 Каталог</h2>

          {loading ? (
            <p className="text-blue-500 text-sm">Загрузка...</p>
          ) : (
            <CatalogTree
              nodes={tree}
              filter={search}
              onSelectLeaf={handleSelectLeaf}
            />
          )}
        </div>

        {/* 📄 Контент офферов */}
        <div className="md:w-2/3 w-full bg-white rounded shadow p-4">
          {!selectedLeaf ? (
            <p className="text-gray-400 text-center">⬅️ Выберите элемент из каталога</p>
          ) : (
            <>
              {/* Tabs */}
              <div className="mb-4 border-b flex justify-between items-center">
                <div className="space-x-2">
                  <button
                    className={`pb-2 px-3 border-b-2 font-medium ${
                      tab === "mine"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-blue-500"
                    }`}
                    onClick={() => setTab("mine")}
                  >
                    🧍‍♂️ Мои офферы
                  </button>
                  <button
                    className={`pb-2 px-3 border-b-2 font-medium ${
                      tab === "others"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-blue-500"
                    }`}
                    onClick={() => setTab("others")}
                  >
                    🌍 Офферы других
                  </button>
                </div>

                {/* Кнопка ➕ "Создать оффер" для вкладки "Мои офферы" */}
                {tab === "mine" && selectedLeaf?.action && (
                  <button
                    onClick={handleCreateOffer}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    ➕ Создать оффер
                  </button>
                )}
              </div>

              {/* Контент вкладок */}
              {tab === "mine" && (
                <OfferList
                  productId={Number(selectedLeaf.id)}
                  other={false}
                  showStatusFilter={true}
                />
              )}
              {tab === "others" && (
                <OfferList
                  productId={Number(selectedLeaf.id)}
                  other={true}
                  showStatusFilter={false}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
