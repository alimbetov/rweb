import apiClient from "./apiClient";
import { AxiosResponse } from "axios";

export interface DeliveryTypeDTO {
  code: string;
  name: string;
}

export interface PaymentTypeDTO {
  code: string;
  name: string;
}

/**
 * 🚚 Получить список типов доставки по offerId
 * @param offerId идентификатор оффера
 * @param exists true — только уже добавленные; false — только ещё доступные
 */
export const fetchDeliveryTypes = async (
  offerId: number,
  exists: boolean
): Promise<DeliveryTypeDTO[]> => {
  const response: AxiosResponse<DeliveryTypeDTO[]> = await apiClient.get(
    "/api/offer-types/delivery",
    {
      params: { offerId, exists },
    }
  );
  return response.data;
};

/**
 * 💾 Сохранить выбранные типы доставки по offerId
 */
export const saveDeliveryTypes = async (
  offerId: number,
  types: DeliveryTypeDTO[]
): Promise<void> => {
  await apiClient.put("/api/offer-types/delivery", types, {
    params: { offerId },
  });
};

/**
 * 💳 Получить список типов оплаты по offerId
 * @param offerId идентификатор оффера
 * @param exists true — только уже добавленные; false — только ещё доступные
 */
export const fetchPaymentTypes = async (
  offerId: number,
  exists: boolean
): Promise<PaymentTypeDTO[]> => {
  const response: AxiosResponse<PaymentTypeDTO[]> = await apiClient.get(
    "/api/offer-types/payment",
    {
      params: { offerId, exists },
    }
  );
  return response.data;
};

/**
 * 💾 Сохранить выбранные типы оплаты по offerId
 */
export const savePaymentTypes = async (
  offerId: number,
  types: PaymentTypeDTO[]
): Promise<void> => {
  await apiClient.put("/api/offer-types/payment", types, {
    params: { offerId },
  });
};
