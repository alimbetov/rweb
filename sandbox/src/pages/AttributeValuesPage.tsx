// src/pages/AttributeValuesPage.tsx
import React, { useEffect, useState } from "react";
import { AttributeValue } from "../types/types";
import {
  fetchAttributeValuesByAttributeCode,
  deleteAttributeValue,
} from "../apidata/attributeApi";
import { useParams } from "react-router-dom";

const AttributeValuesPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [values, setValues] = useState<AttributeValue[]>([]);

  useEffect(() => {
    if (code) {
      fetchAttributeValuesByAttributeCode(code).then(setValues);
    }
  }, [code]);

  const handleDelete = async (id: number) => {
    await deleteAttributeValue(id);
    setValues(values.filter((v) => v.id !== id));
  };

  return (
    <div>
      <h2>Значения атрибута: {code}</h2>
      <ul>
        {values.map((v) => (
          <li key={v.id}>
            {v.valueRu} / {v.valueKz} / {v.valueEn}
            <button onClick={() => handleDelete(v.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttributeValuesPage;
