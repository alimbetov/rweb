import React from "react";
import { OfferAttributeFormDTO } from "../types/types";

interface Props {
  attributes: OfferAttributeFormDTO[];
  onChange: (updated: OfferAttributeFormDTO[]) => void;
}

const OfferFilterForm: React.FC<Props> = ({ attributes, onChange }) => {
  const updateAttribute = (id: number, updates: Partial<OfferAttributeFormDTO>) => {
    const updated = attributes.map(attr =>
      attr.id === id ? { ...attr, ...updates } : attr
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {attributes.map(attr => (
        <div key={attr.id} className="border-b pb-4">
          <label className="font-medium block mb-1">{attr.attributeTitle}</label>

          {attr.type === "STRING" && (
            <input
              type="text"
              value={attr.inputTextValue || ""}
              onChange={(e) =>
                updateAttribute(attr.id, { inputTextValue: e.target.value })
              }
              className="border px-3 py-1 rounded w-full"
            />
          )}

          {attr.type === "NUMBER" && (
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="От"
                value={attr.inputNumberValue ?? ""}
                onChange={(e) =>
                  updateAttribute(attr.id, {
                    inputNumberValue: Number(e.target.value),
                  })
                }
                className="border px-3 py-1 rounded w-1/2"
              />
              <input
                type="number"
                placeholder="До"
                value={attr.numberLimit ?? ""}
                onChange={(e) =>
                  updateAttribute(attr.id, {
                    numberLimit: Number(e.target.value),
                  })
                }
                className="border px-3 py-1 rounded w-1/2"
              />
            </div>
          )}

          {attr.type === "BOOLEAN" && (
            <input
              type="checkbox"
              checked={attr.inputCheckValue || false}
              onChange={(e) =>
                updateAttribute(attr.id, { inputCheckValue: e.target.checked })
              }
            />
          )}

          {attr.type === "ENUM" && attr.enumRangeList?.length && (
            <div className="space-y-1">
              {attr.enumRangeList.map((value) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={attr.inputSelectedValues?.includes(value) || false}
                    onChange={(e) => {
                      const selected = new Set(attr.inputSelectedValues || []);
                      e.target.checked ? selected.add(value) : selected.delete(value);
                      updateAttribute(attr.id, {
                        inputSelectedValues: Array.from(selected),
                      });
                    }}
                  />
                  {value}
                </label>
              ))}
            </div>
          )}

          {attr.type === "MULTISELECT" && attr.multiSelectRangeList?.length && (
            <div className="space-y-1">
              {attr.multiSelectRangeList.map((value) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={attr.inputSelectedValues?.includes(value) || false}
                    onChange={(e) => {
                      const selected = new Set(attr.inputSelectedValues || []);
                      e.target.checked ? selected.add(value) : selected.delete(value);
                      updateAttribute(attr.id, {
                        inputSelectedValues: Array.from(selected),
                      });
                    }}
                  />
                  {value}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OfferFilterForm;
