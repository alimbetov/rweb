import React, { useState } from "react";
import OfferAttributeEditor from "./OfferAttributeEditor";
import { OfferAttributeFormDTO } from "../types/types";

interface Props {
  attributes: OfferAttributeFormDTO[];
  onChange: (updated: OfferAttributeFormDTO, index: number) => void;
}

// Соответствие типа и отображаемого названия
const tabLabels: Record<string, string> = {
  STRING: "Дополнения",
  NUMBER: "Метрики",
  BOOLEAN: "Параметры",
  ENUM: "Фокус",
  MULTISELECT: "Вариации",
};

const TABS = Object.keys(tabLabels) as (keyof typeof tabLabels)[];

const AttributeTabs: React.FC<Props> = ({ attributes = [], onChange }) => {
  const [activeTab, setActiveTab] = useState<keyof typeof tabLabels>("STRING");

  const groupByType = (type: string) =>
    attributes?.filter((attr) => attr.type === type) || [];

  const renderTab = (type: keyof typeof tabLabels) => {
    const items = groupByType(type);
    if (items.length === 0)
      return <p className="text-gray-500 text-sm">Нет атрибутов</p>;

    return (
      <div className="space-y-3 mt-4">
        {items.map((attr) => (
          <OfferAttributeEditor
            key={attr.id}
            attribute={attr}
            onChange={(updated) => {
              const realIndex = attributes.findIndex((a) => a.id === attr.id);
              onChange(updated, realIndex);
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>
      <div>{renderTab(activeTab)}</div>
    </div>
  );
};

export default AttributeTabs;
