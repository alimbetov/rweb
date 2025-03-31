
import apiClient from "./apiClient";
import { AxiosResponse } from "axios";

export interface WorkingDayOfferDto {
  dayCode: string; // MON, TUE, etc.
  workStartHour?: number;
  workStartMinute?: number;
  workEndHour?: number;
  workEndMinute?: number;
  breakStartHour?: number;
  breakStartMinute?: number;
  breakEndHour?: number;
  breakEndMinute?: number;
}

export interface WorkingScheduleRequestDto {
  offerId: number;
  appointmentEnabled?: boolean;
  intervalLimit?: number;
  dailyAppointmentLimit?: number;
  days?: WorkingDayOfferDto[];
}

export interface WorkingScheduleResponseDto {
  offerId: number;
  appointmentEnabled?: boolean;
  intervalLimit?: number;
  dailyAppointmentLimit?: number;
  edition?: boolean;
  days?: WorkingDayOfferDto[];
}


apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


/**
 * 🔄 Получение расписания по offerId
 */
export const fetchWorkingSchedule = async (
  offerId: number
): Promise<WorkingScheduleResponseDto> => {
  const response: AxiosResponse<WorkingScheduleResponseDto> = await apiClient.get(
    `/api/offers/working-schedule/${offerId}`
  );
  return response.data;
};

/**
 * 💾 Сохранение расписания
 */
export const saveWorkingSchedule = async (
  dto: WorkingScheduleRequestDto
): Promise<void> => {
  await apiClient.put("/api/offers/working-schedule", dto);
};
