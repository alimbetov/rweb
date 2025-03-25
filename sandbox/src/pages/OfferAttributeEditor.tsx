import React from "react";
import { OfferAttributeFormDTO } from "../types/types";

interface Props {
  attribute: OfferAttributeFormDTO;
  onChange: (updated: OfferAttributeFormDTO) => void;
}

const OfferAttributeEditor: React.FC<Props> = ({ attribute, onChange }) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...attribute, inputTextValue: e.target.value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= (attribute.numberLimit ?? Infinity)) {
      onChange({ ...attribute, inputNumberValue: value });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...attribute, inputCheckValue: e.target.checked });
  };

  const handleEnumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...attribute, inputSelectedValues: [e.target.value] });
  };

  const handleMultiSelectChange = (value: string) => {
    const current = attribute.inputSelectedValues || [];
    const newValues = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    onChange({ ...attribute, inputSelectedValues: newValues });
  };

  const typeLabelMap: Record<string, string> = {
    STRING: "✍️ Дополнения",
    NUMBER: "📏 Метрики",
    BOOLEAN: "⚙️ Параметры",
    ENUM: "🎯 Фокус",
    MULTISELECT: "🎛️ Вариации",
  };

  const renderField = () => {
    switch (attribute.type) {
      case "STRING":
        return (
          <>
            <p className="font-medium text-sm text-gray-700">{typeLabelMap["STRING"]}</p>
            <input
              type="text"
              value={attribute.inputTextValue || ""}
              onChange={handleTextChange}
              className="border px-2 py-1 w-full rounded mt-1"
              placeholder="Введите текст"
            />
          </>
        );

      case "NUMBER":
        return (
          <div className="flex items-center gap-4">
            <p className="font-medium text-gray-700 min-w-[160px]">📏 {attribute.attributeTitle}</p>
            <input
              type="number"
              value={attribute.inputNumberValue ?? ""}
              onChange={handleNumberChange}
              className="border px-2 py-1 rounded flex-1"
              placeholder={`Макс: ${attribute.numberLimit}`}
              max={attribute.numberLimit}
            />
          </div>
        );

      case "BOOLEAN":
        return (
          <div className="flex items-center gap-4">
            <p className="font-medium text-gray-700 min-w-[160px]">⚙️ {attribute.attributeTitle}</p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={attribute.inputCheckValue ?? false}
                onChange={handleCheckboxChange}
              />
              <span>Да / Нет</span>
            </label>
          </div>
        );

      case "ENUM":
        return (
          <div className="flex items-center gap-4">
            <p className="font-medium text-gray-700 min-w-[160px]">🎯 {attribute.attributeTitle}</p>
            <select
              value={attribute.inputSelectedValues?.[0] || ""}
              onChange={handleEnumChange}
              className="border px-2 py-1 rounded flex-1"
            >
              <option value="">-- Выбрать --</option>
              {attribute.enumRangeList?.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        );

      case "MULTISELECT":
        return (
          <>
            <p className="font-medium text-sm text-gray-700 mb-2">🎛️ {attribute.attributeTitle}</p>
            <fieldset className="flex flex-wrap gap-3">
              {attribute.multiSelectRangeList?.map((val) => (
                <label key={val} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={attribute.inputSelectedValues?.includes(val) ?? false}
                    onChange={() => handleMultiSelectChange(val)}
                  />
                  {val}
                </label>
              ))}
            </fieldset>
          </>
        );

      default:
        return <p>Тип не поддерживается</p>;
    }
  };

  return (
    <div className="mb-5 p-4 border rounded bg-white shadow-sm">
      {renderField()}
    </div>
  );
};

export default OfferAttributeEditor;
