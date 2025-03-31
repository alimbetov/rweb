import React, { useEffect, useState } from "react";
import {
  fetchWorkingSchedule,
  saveWorkingSchedule,
  WorkingDayOfferDto,
  WorkingScheduleRequestDto,
  WorkingScheduleResponseDto,
} from "../apidata/apiSchedule";
import { useParams } from "react-router-dom";

const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const dayCodeMap: Record<string, string> = {
  Пн: "MON",
  Вт: "TUE",
  Ср: "WED",
  Чт: "THU",
  Пт: "FRI",
  Сб: "SAT",
  Вс: "SUN",
};

const reverseDayCodeMap = Object.fromEntries(
  Object.entries(dayCodeMap).map(([k, v]) => [v, k])
);

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (min: number) => {
  const h = Math.floor(min / 60)
    .toString()
    .padStart(2, "0");
  const m = (min % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

interface Interval {
  start: number;
  end: number;
}

interface DaySchedule {
  work: Interval;
  break?: Interval;
  isDayOff?: boolean;
}

const WorkingHoursForm: React.FC = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const numericOfferId = Number(offerId ?? 0);

  if (isNaN(numericOfferId) || numericOfferId <= 0) {
    return <div>❌ Неверный offerId в URL</div>;
  }

  const defaultBreak: Interval = { start: 780, end: 840 }; // 13:00–14:00
  const defaultWork: Interval = { start: 480, end: 1020 }; // 8:00–17:00

  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({});
  const [appointmentEnabled, setAppointmentEnabled] = useState(true);
  const [intervalLimit, setIntervalLimit] = useState(10);
  const [dailyAppointmentLimit, setDailyAppointmentLimit] = useState(45);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const data: WorkingScheduleResponseDto = await fetchWorkingSchedule(numericOfferId);
        setAppointmentEnabled(data.appointmentEnabled ?? true);
        setIntervalLimit(data.intervalLimit ?? 10);
        setDailyAppointmentLimit(data.dailyAppointmentLimit ?? 45);

        const scheduleObj: Record<string, DaySchedule> = {};
        for (const dayDto of data.days ?? []) {
          const day = reverseDayCodeMap[dayDto.dayCode] || dayDto.dayCode;
          const isDayOff =
            dayDto.workStartHour === 0 &&
            dayDto.workEndHour === 0 &&
            dayDto.workStartMinute === 0 &&
            dayDto.workEndMinute === 0;

          scheduleObj[day] = {
            work: {
              start: isDayOff ? 0 : dayDto.workStartHour * 60 + dayDto.workStartMinute,
              end: isDayOff ? 0 : dayDto.workEndHour * 60 + dayDto.workEndMinute,
            },
            break:
              isDayOff || (dayDto.breakStartHour === 0 && dayDto.breakEndHour === 0)
                ? undefined
                : {
                    start: dayDto.breakStartHour * 60 + dayDto.breakStartMinute,
                    end: dayDto.breakEndHour * 60 + dayDto.breakEndMinute,
                  },
            isDayOff,
          };
        }
        setSchedule(scheduleObj);
      } catch (e) {
        console.error("❌ Ошибка загрузки расписания:", e);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [numericOfferId]);

  const handleChange = (
    day: string,
    type: "work" | "break",
    field: "start" | "end",
    value: string
  ) => {
    const minutes = timeToMinutes(value);
    setSchedule((prev) => {
      const current = prev[day];
      const updated = {
        ...current,
        [type]: {
          ...current[type],
          [field]: minutes,
        },
      };
      return { ...prev, [day]: updated };
    });
  };

  const toggleBreak = (day: string) => {
    setSchedule((prev) => {
      const current = prev[day];
      const updated = {
        ...current,
        break: current.break ? undefined : { ...defaultBreak },
      };
      return { ...prev, [day]: updated };
    });
  };

  const toggleDayOff = (day: string) => {
    setSchedule((prev) => {
      const current = prev[day];
      const isNowDayOff = !current.isDayOff;
      const updated = {
        ...current,
        isDayOff: isNowDayOff,
        work: isNowDayOff ? { start: 0, end: 0 } : { ...defaultWork },
        break: isNowDayOff ? undefined : { ...defaultBreak },
      };
      return { ...prev, [day]: updated };
    });
  };

  const handleSubmit = async () => {
    const days: WorkingDayOfferDto[] = daysOfWeek.map((day) => {
      const item = schedule[day];
      const isDayOff = item.isDayOff;

      return {
        dayCode: dayCodeMap[day],
        workStartHour: isDayOff ? 0 : Math.floor(item.work.start / 60),
        workStartMinute: isDayOff ? 0 : item.work.start % 60,
        workEndHour: isDayOff ? 0 : Math.floor(item.work.end / 60),
        workEndMinute: isDayOff ? 0 : item.work.end % 60,
        breakStartHour:
          isDayOff || !item.break ? 0 : Math.floor(item.break.start / 60),
        breakStartMinute: isDayOff || !item.break ? 0 : item.break.start % 60,
        breakEndHour:
          isDayOff || !item.break ? 0 : Math.floor(item.break.end / 60),
        breakEndMinute: isDayOff || !item.break ? 0 : item.break.end % 60,
      };
    });

    const payload: WorkingScheduleRequestDto = {
      offerId: numericOfferId,
      appointmentEnabled,
      intervalLimit,
      dailyAppointmentLimit,
      days,
    };

    console.log("📤 Отправка:", payload);

    try {
      await saveWorkingSchedule(payload);
      alert("✅ Расписание успешно сохранено!");
    } catch (e) {
      console.error("❌ Ошибка сохранения:", e);
      alert("Ошибка при сохранении");
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-center mb-4">🕒 График работы</h2>

      <div className="mb-4 space-y-2">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={appointmentEnabled}
            onChange={(e) => setAppointmentEnabled(e.target.checked)}
            className="accent-blue-600"
          />
          <span className="text-sm font-medium">Услуга по записи</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">⏱ Интервал записи</label>
            <select
              value={intervalLimit}
              onChange={(e) => setIntervalLimit(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full"
            >
              {[5, 10, 15, 20, 30, 40, 50, 60, 90, 120].map((v) => (
                <option key={v} value={v}>
                  {v} минут
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">📅 Лимит приёмов в день</label>
            <select
              value={dailyAppointmentLimit}
              onChange={(e) => setDailyAppointmentLimit(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full"
            >
              {[...Array(60)].map((_, i) => i * 5 + 5).filter(v => v <= 120)
                .concat([150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300])
                .map((v) => (
                  <option key={v} value={v}>
                    {v} приёмов
                  </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {daysOfWeek.map((day) => {
          const item = schedule[day];
          return (
            <div
              key={day}
              className={`border rounded p-4 space-y-2 ${
                item.isDayOff ? "bg-gray-50" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">{day}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleBreak(day)}
                    className="text-xs px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    disabled={item.isDayOff}
                  >
                    {item.break ? "Убрать обед" : "Добавить обед"}
                  </button>
                  <button
                    onClick={() => toggleDayOff(day)}
                    className={`text-xs px-2 py-1 rounded ${
                      item.isDayOff ? "bg-gray-500" : "bg-red-500"
                    } text-white hover:opacity-90`}
                  >
                    {item.isDayOff ? "Рабочий день" : "Выходной"}
                  </button>
                </div>
              </div>
              {!item.isDayOff && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <span>Работа:</span>
                    <input
                      type="time"
                      value={minutesToTime(item.work.start)}
                      onChange={(e) =>
                        handleChange(day, "work", "start", e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    />
                    <span>—</span>
                    <input
                      type="time"
                      value={minutesToTime(item.work.end)}
                      onChange={(e) =>
                        handleChange(day, "work", "end", e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    />
                  </div>
                  {item.break && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>Обед:</span>
                      <input
                        type="time"
                        value={minutesToTime(item.break.start)}
                        onChange={(e) =>
                          handleChange(day, "break", "start", e.target.value)
                        }
                        className="border px-2 py-1 rounded"
                      />
                      <span>—</span>
                      <input
                        type="time"
                        value={minutesToTime(item.break.end)}
                        onChange={(e) =>
                          handleChange(day, "break", "end", e.target.value)
                        }
                        className="border px-2 py-1 rounded"
                      />
                    </div>
                  )}
                </>
              )}
              {item.isDayOff && (
                <p className="text-sm text-gray-500 italic">Выходной день</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          💾 Сохранить график
        </button>
      </div>
    </div>
  );
};

export default WorkingHoursForm;
