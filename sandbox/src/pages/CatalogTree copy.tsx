import React from "react";
import { CatalogNodeDto } from "../types/types";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface CatalogTreeProps {
  nodes: CatalogNodeDto[];
  level?: number;
  onSelectLeaf?: (node: CatalogNodeDto) => void;
  filter?: string;
}

const CatalogTree: React.FC<CatalogTreeProps> = ({
  nodes,
  level = 0,
  onSelectLeaf,
  filter = "",
}) => {
  const [openIds, setOpenIds] = React.useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const matchesFilter = (text: string) =>
    text.toLowerCase().includes(filter.toLowerCase());

  const renderNode = (node: CatalogNodeDto): React.ReactNode => {
    const isLeaf = node.action || !node.children?.length;
    const isOpen = openIds.has(node.id);

    const hasMatch =
      matchesFilter(node.title) ||
      node.children?.some((child) => matchesFilter(child.title));

    if (filter && !hasMatch) return null;

    return (
      <li key={node.id}>
        <div
          className={`flex items-center gap-2 cursor-pointer rounded px-3 py-2 
            transition-all hover:bg-blue-50 ${
              isLeaf ? "pl-6" : ""
            } ${matchesFilter(node.title) ? "bg-yellow-100" : ""}`}
          onClick={() => (isLeaf ? onSelectLeaf?.(node) : toggle(node.id))}
        >
          {!isLeaf && (
            <>
              {isOpen ? (
                <ChevronDownIcon className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-gray-600" />
              )}
            </>
          )}
          <span
            className={`text-gray-800 font-medium truncate ${
              isLeaf ? "text-blue-600" : ""
            }`}
          >
            {node.title}
          </span>
        </div>

        {isOpen && node.children && (
          <div className="ml-4 border-l pl-4 border-gray-200">
            <CatalogTree
              nodes={node.children}
              level={level + 1}
              onSelectLeaf={onSelectLeaf}
              filter={filter}
            />
          </div>
        )}
      </li>
    );
  };

  return <ul className="space-y-1">{nodes.map(renderNode)}</ul>;
};

export default CatalogTree;
