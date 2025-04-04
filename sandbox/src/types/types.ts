export interface Country {
  countryCode: string;
  nameRu: string;
  nameKz: string;
  nameEn: string;
  isPublic: boolean;
}

export interface City {
  cityCode: string;
  nameRu: string;
  nameKz: string;
  nameEn: string;
  isPublic: boolean;
  countryCode: string;
}

export interface CategoryGroup {
  code: string;
  isPublic: boolean;
  nameRu: string;
  nameKz: string;
  nameEn: string;
  categoryCodes: string[];
}

export interface Category {
  code: string;
  isPublic: boolean;
  nameRu: string;
  nameKz: string;
  nameEn: string;
  groupCode: string;
}

export interface SubCategory {
  code: string;
  isPublic: boolean;
  nameRu: string;
  nameKz: string;
  nameEn: string;
  categoryCode: string;
}
export interface AttributeDto {
  code: string;
  nameRu: string;
  nameKz: string;
  nameEn: string;
  isPublic: boolean;
}

export interface AttributeValue {
  id: number;
  valueRu: string;
  valueKz: string;
  valueEn: string;
  attributeCode: string;
}

export interface Attribute {
  id: number;
  code: string;
  nameRu: string;
  nameKz: string;
  nameEn: string;
  isPublic: boolean;
  type: AttributeType;
}

export interface AttributeValue {
  id: number;
  attributeId: number;
  value: string;
  isPublic:
  boolean;
}

// Enum для типов атрибутов
export enum AttributeType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  ENUM = "ENUM",
  MULTISELECT = "MULTISELECT",
}

export interface Product {
  id: number;

  nameRu: string; // Название на русском
  nameKz: string; // Название на казахском
  nameEn: string; // Название на английском

  isPublic: boolean; // Флаг публичности

  categoryCode: string; // Код категории товара
  subCategoryCode?: string; // Код подкатегории (необязательно)

  productAttributes: ProductAttribute[]; // Список характеристик товара
}

// 🔹 Описание характеристик товара

export interface ProductAttribute {
  id: number;
  productId: number;
  attributeId: number;
  value: string;
  isPublic: boolean;
  attribute?: Attribute; // необязательно, для UI
}

export interface ProductAttributeDTO {
  id: number;
  productId: number;
  productInfo: string;
  attributeId: number;
  attributeInfo: string;
  value: string;
  isPublic: boolean;
}

export interface LanguageDTO {
  code: string;
  name: string;
}

export interface CurrencyDTO {
  code: string;
  name: string;
}

export interface PhoneContactDTO {
  id: number;
  phoneNumber: string;
  isPublic: boolean;
  type: string;
}

export interface ProfileDTO {
  id: string;
  profileName: string;
  isPublic: boolean;
  profilePhotoUrl?: string;
  website?: string;
  websiteIsPublic: boolean;
  instagram?: string;
  instagramIsPublic: boolean;
  email?: string;
  emailIsPublic: boolean;
  telegram?: string;
  telegramIsPublic: boolean;
  trial?: boolean;
  preferredLanguage: LanguageDTO;
  preferredCurrency: CurrencyDTO;
  userId: number;
  phoneContacts: PhoneContactDTO[];
  addresses: AddressDTO[];
  country?: CountryLocalDto;
}

export interface AddressDTO {
  id: number;
  isPublic: boolean;
  streetAddress: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  cityCode: string;
}

export interface CityLocalDto {
  cityCode: string;
  name: string;
}

export interface CountryLocalDto {
  code: string;
  name: string;
}

export interface CurrencyDTO {
  code: string;
  name: string;
  symbol?: string;
}

export interface LanguageDTO {
  code: string;
  name: string;
  shortName?: string; // ru / kz / en
}


export interface CityCoordinates {
  id?: number;
  cityCode: string;
  latitude: number;
  longitude: number;
}

export interface AddressCoordinatesDTO {
  id?: number;
  title?: string;
  citLatitude: number;
  citLongitude: number;
  latitude?: number;
  longitude?: number;
  edition?: boolean;
}

export interface CatalogNodeDto {
  id: string;
  title: string;
  action: boolean;
  children?: CatalogNodeDto[];
}



// src/types/types.ts

export interface OfferAttributeFormDTO {
  id: number;
  attributeId: number;
  attributeTitle?: string;
  productId: number;
  type: "STRING" | "NUMBER" | "ENUM" | "BOOLEAN" | "MULTISELECT"; // адаптируй под твои значения

  inputTextValue?: string;
  inputNumberValue?: number;
  numberLimit?: number;
  inputCheckValue?: boolean;

  inputSelectedValues?: string[];
  enumRangeList?: string[];
  multiSelectRangeList?: string[];
}



export interface OfferFormDTO {
  offerId: number;
  createdAt: string;
  updatedAt: string;
  offerPhotoUrl?: string;
  price: number;
  description?: string;
  productId: number;
  categoryCode: string;
  subCategoryCode?: string;
  preferredCurrency: "USD" | "KZT" | "RUB";
  status: "DRFT" | "ACTV" | "ARCH" | "PNDG" | "REJC";
  addressId: number;
  cityCode: string;
  profileId: string;
  offerAttributeFormList: OfferAttributeFormDTO[];
}

export interface AddressLocalDTO {
  id: number;
  title: string;
}

export interface OfferFilterRequest {
  cities?: CityLocalDto[];
  offerAttributeFormList?: OfferAttributeFormDTO[];
  exact?: boolean;
}



