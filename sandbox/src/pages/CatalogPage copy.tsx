import React, { useEffect, useState } from "react";
import { CatalogNodeDto } from "../types/types";
import { fetchCatalogTree } from "../apidata/catalogApi";
import CatalogTree from "../pages/CatalogTree";

const CatalogPage: React.FC = () => {
  const [tree, setTree] = useState<CatalogNodeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeaf, setSelectedLeaf] = useState<CatalogNodeDto | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCatalogTree()
      .then(setTree)
      .catch(() => alert("Ошибка загрузки дерева"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">📚 Каталог</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Поиск по категориям..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading ? (
        <p className="text-blue-600">Загрузка...</p>
      ) : (
        <div className="bg-white rounded shadow p-4">
          <CatalogTree
            nodes={tree}
            filter={search}
            onSelectLeaf={(node) => setSelectedLeaf(node)}
          />
        </div>
      )}

      {selectedLeaf && (
        <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded">
          <p className="font-semibold">Вы выбрали:</p>
          <p>
            🔎 <strong>{selectedLeaf.title}</strong> (код: {selectedLeaf.id})
          </p>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
