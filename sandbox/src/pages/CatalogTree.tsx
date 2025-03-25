import React from "react";
import { CatalogNodeDto } from "../types/types";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface CatalogTreeProps {
  nodes: CatalogNodeDto[];
  level?: number;
  onSelectLeaf?: (node: CatalogNodeDto) => void;
  filter?: string;
}

const levelColors = [
  "bg-blue-50",
  "bg-green-50",
  "bg-gray-50",
  "bg-purple-50",
  "bg-pink-50",
  "bg-yellow-50",
  "bg-orange-50",
];

const CatalogTree: React.FC<CatalogTreeProps> = ({
  nodes,
  level = 0,
  onSelectLeaf,
  filter = "",
}) => {
  const [openIds, setOpenIds] = React.useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const matchesFilter = (text: string) =>
    text.toLowerCase().includes(filter.toLowerCase());

  const shouldShowNode = (node: CatalogNodeDto): boolean => {
    if (matchesFilter(node.title)) return true;
    if (!node.children) return false;
    return node.children.some((child) => shouldShowNode(child));
  };

  // Автоматически раскрывать узлы при фильтрации
  React.useEffect(() => {
    if (!filter) return;
    const newOpen = new Set<string>();

    const traverse = (node: CatalogNodeDto): boolean => {
      const isMatch = matchesFilter(node.title);
      if (!node.children) return isMatch;

      const hasMatchingChild = node.children.map(traverse).some(Boolean);
      if (isMatch || hasMatchingChild) {
        newOpen.add(node.id);
      }
      return isMatch || hasMatchingChild;
    };

    nodes.forEach(traverse);
    setOpenIds(newOpen);
  }, [filter, nodes]);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const renderNode = React.useCallback(
    (node: CatalogNodeDto): React.ReactNode => {
      const isLeaf = node.action || !node.children?.length;
      const isOpen = openIds.has(node.id);
      const show = shouldShowNode(node);

      if (filter && !show) return null;

      const color = levelColors[level % levelColors.length];

      return (
        <li key={node.id}>
          <div
            role="treeitem"
            aria-expanded={isOpen}
            tabIndex={0}
            className={`flex items-center gap-2 cursor-pointer rounded px-3 py-2 transition-all duration-150 ease-in-out ${
              isLeaf ? "pl-6" : ""
            } ${matchesFilter(node.title) ? "bg-yellow-100" : color}`}
            onClick={() => {
              if (isLeaf) {
                setSelectedId(node.id);
                onSelectLeaf?.(node);
              } else {
                toggle(node.id);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (isLeaf) {
                  setSelectedId(node.id);
                  onSelectLeaf?.(node);
                } else {
                  toggle(node.id);
                }
              }
            }}
          >
            {!isLeaf &&
              (isOpen ? (
                <ChevronDownIcon className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-gray-600" />
              ))}
            <span
              className={`text-sm font-medium truncate ${
                isLeaf
                  ? selectedId === node.id
                    ? "text-white bg-blue-600 px-2 py-1 rounded"
                    : "text-blue-600 hover:underline"
                  : "text-gray-800"
              }`}
            >
              {node.title}
            </span>
          </div>

          {isOpen && node.children && (
            <ul className="ml-4 border-l pl-3 border-gray-200 space-y-1 transition-all duration-200 ease-in-out">
              <CatalogTree
                nodes={node.children}
                level={level + 1}
                onSelectLeaf={onSelectLeaf}
                filter={filter}
              />
            </ul>
          )}
        </li>
      );
    },
    [openIds, selectedId, filter, onSelectLeaf, level]
  );

  return <ul className="space-y-1" role="tree">{nodes.map(renderNode)}</ul>;
};

export default CatalogTree;
