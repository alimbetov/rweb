// src/pages/CreateAttributePage.tsx
import React, { useState } from "react";
import { AttributeDto } from "../types/types";
import { createAttribute } from "../apidata/attributeApi"; // предполагаемый API
import { useNavigate } from "react-router-dom";

const CreateAttributePage: React.FC = () => {
  const navigate = useNavigate();
  const [attribute, setAttribute] = useState<AttributeDto>({
    code: "",
    nameRu: "",
    nameKz: "",
    nameEn: "",
    isPublic: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAttribute((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAttribute(attribute);
    navigate("/attributes"); // или куда тебе нужно
  };

  return (
    <div>
      <h2>Создание атрибута</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="code"
          placeholder="Код"
          value={attribute.code}
          onChange={handleChange}
          required
        />
        <input
          name="nameRu"
          placeholder="Название RU"
          value={attribute.nameRu}
          onChange={handleChange}
          required
        />
        <input
          name="nameKz"
          placeholder="Название KZ"
          value={attribute.nameKz}
          onChange={handleChange}
          required
        />
        <input
          name="nameEn"
          placeholder="Название EN"
          value={attribute.nameEn}
          onChange={handleChange}
          required
        />
        <button type="submit">Создать</button>
      </form>
    </div>
  );
};

export default CreateAttributePage;
