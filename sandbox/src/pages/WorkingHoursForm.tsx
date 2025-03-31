// 💡 Улучшенный WorkingHoursForm.tsx с цветными табами, тултипами, сбросом дня, адаптивностью
import React, { useEffect, useState } from "react";
import {
  fetchWorkingSchedule,
  saveWorkingSchedule,
  WorkingDayOfferDto,
  WorkingScheduleRequestDto,
  WorkingScheduleResponseDto,
} from "../apidata/apiSchedule";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Tooltip,
} from "@mui/material";

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
const dayColors: Record<string, string> = {
  Пн: "#2196f3",
  Вт: "#4caf50",
  Ср: "#9c27b0",
  Чт: "#ff9800",
  Пт: "#f44336",
  Сб: "#00bcd4",
  Вс: "#607d8b",
};
const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};
const minutesToTime = (min: number) => {
  const h = String(Math.floor(min / 60)).padStart(2, "0");
  const m = String(min % 60).padStart(2, "0");
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
interface WorkingHoursFormProps {
  offerId: number;
}

const WorkingHoursForm: React.FC<WorkingHoursFormProps> = ({ offerId }) => {
  const numericOfferId = Number(offerId ?? 0);
  const defaultBreak: Interval = { start: 780, end: 840 };
  const defaultWork: Interval = { start: 480, end: 1020 };

  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({});
  const [appointmentEnabled, setAppointmentEnabled] = useState(true);
  const [intervalLimit, setIntervalLimit] = useState(10);
  const [dailyAppointmentLimit, setDailyAppointmentLimit] = useState(45);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

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
          const isDayOff = dayDto.workStartHour === 0 && dayDto.workEndHour === 0 && dayDto.workStartMinute === 0 && dayDto.workEndMinute === 0;
          scheduleObj[day] = {
            work: {
              start: isDayOff ? 0 : dayDto.workStartHour * 60 + dayDto.workStartMinute,
              end: isDayOff ? 0 : dayDto.workEndHour * 60 + dayDto.workEndMinute,
            },
            break: !isDayOff && (dayDto.breakStartHour || dayDto.breakEndHour)
              ? {
                  start: dayDto.breakStartHour * 60 + dayDto.breakStartMinute,
                  end: dayDto.breakEndHour * 60 + dayDto.breakEndMinute,
                }
              : undefined,
            isDayOff,
          };
        }
        setSchedule(scheduleObj);
      } catch (error) {
        console.error("Ошибка загрузки расписания:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSchedule();
  }, [numericOfferId]);

  const handleChange = (day: string, type: "work" | "break", field: "start" | "end", value: string) => {
    const minutes = timeToMinutes(value);
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: {
          ...prev[day][type],
          [field]: minutes,
        },
      },
    }));
    setIsDirty(true);
  };

  const toggleBreak = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        break: prev[day].break ? undefined : { ...defaultBreak },
      },
    }));
    setIsDirty(true);
  };

  const toggleDayOff = (day: string) => {
    const current = schedule[day];
    const isNowDayOff = !current.isDayOff;
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...current,
        isDayOff: isNowDayOff,
        work: isNowDayOff ? { start: 0, end: 0 } : { ...defaultWork },
        break: isNowDayOff ? undefined : { ...defaultBreak },
      },
    }));
    setIsDirty(true);
  };

  const resetDay = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        work: { ...defaultWork },
        break: { ...defaultBreak },
        isDayOff: false,
      },
    }));
    setIsDirty(true);
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
        breakStartHour: isDayOff || !item.break ? 0 : Math.floor(item.break.start / 60),
        breakStartMinute: isDayOff || !item.break ? 0 : item.break.start % 60,
        breakEndHour: isDayOff || !item.break ? 0 : Math.floor(item.break.end / 60),
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

    try {
      await saveWorkingSchedule(payload);
      alert("✅ Расписание успешно сохранено!");
      setIsDirty(false);
    } catch (e) {
      console.error("Ошибка сохранения:", e);
      alert("❌ Ошибка при сохранении");
    }
  };

  if (loading) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;
  if (!numericOfferId) return <Alert severity="error">❌ Неверный offerId</Alert>;

  return (
    <Box maxWidth="md" mx="auto" p={2}>
      <Typography variant="h5" align="center" gutterBottom> </Typography>

      <FormControlLabel
        control={<Checkbox checked={appointmentEnabled} onChange={(e) => setAppointmentEnabled(e.target.checked)} />}
        label="Запись на прием активация"
      />

<Box textAlign="center" mt={4}>
        <Button variant="contained" color="success" size="large" onClick={handleSubmit}>
          💾 Сохранить график
        </Button>
      </Box>

      <Grid container spacing={2} mt={1} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="⏱ Интервал между"
            value={intervalLimit}
            onChange={(e) => setIntervalLimit(Number(e.target.value))}
          >
            {[5, 10, 15, 20, 30, 40, 50, 60, 90, 120].map((val) => (
              <MenuItem key={val} value={val}>{val} минут</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="📅 прием в минутах"
            value={dailyAppointmentLimit}
            onChange={(e) => setDailyAppointmentLimit(Number(e.target.value))}
          >
            {[...Array(24)].map((_, i) => (i + 1) * 5).concat([150, 180, 210, 240, 300]).map((val) => (
              <MenuItem key={val} value={val}>{val} минут</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {isDirty && <Typography variant="caption" color="warning.main" align="center" mt={2}>⚠️ Есть несохранённые изменения</Typography>}

      <Tabs
  value={activeTab}
  onChange={(_, val) => setActiveTab(val)}
  variant="scrollable"
  scrollButtons="auto"
  allowScrollButtonsMobile
  centered={false}
  sx={{ mt: 3 }}
>
  {daysOfWeek.map((day, index) => (
    <Tab
      key={day}
      label={day}
      id={`tab-${index}`}
      sx={{
        borderBottom: `3px solid ${dayColors[day]}`,
        textTransform: "none",
        fontWeight: activeTab === index ? "bold" : "normal",
        minWidth: 40, // уменьшает ширину
        fontSize: { xs: "0.75rem", sm: "0.875rem" }, // адаптивный размер текста
        px: { xs: 1, sm: 2 }, // padding по горизонтали
      }}
    />
  ))}
</Tabs>


      <Box mt={2}>
        {daysOfWeek.map((day, index) => {
          const item = schedule[day];
          if (activeTab !== index) return null;
          return (
            <Paper elevation={2} sx={{ p: 2, backgroundColor: item.isDayOff ? "#f8f9fa" : "white", borderLeft: `6px solid ${item.isDayOff ? '#ccc' : '#4caf50'}` }} key={day}>
              <Typography variant="h6">{day}</Typography>

              <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mt={1}>
                <Tooltip title="Обед необязателен">
                  <Button variant="contained" color={item.break ? "warning" : "info"} onClick={() => toggleBreak(day)} disabled={item.isDayOff}>
                    {item.break ? "Убрать обед" : "Добавить обед"}
                  </Button>
                </Tooltip>

                <Tooltip title="Отметить как выходной или вернуть обратно">
                  <Button variant="contained" color={item.isDayOff ? "secondary" : "error"} onClick={() => toggleDayOff(day)}>
                    {item.isDayOff ? "Сделать рабочим" : "Сделать выходным"}
                  </Button>
                </Tooltip>

                <Tooltip title="Сбросить значения для дня">
                  <Button variant="outlined" color="inherit" onClick={() => resetDay(day)}>
                    ♻️ Сбросить день
                  </Button>
                </Tooltip>
              </Box>

              {item.isDayOff ? (
                <Typography mt={2} color="text.secondary" fontStyle="italic">Выходной день</Typography>
              ) : (
                <Box mt={2} display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <TextField
                      type="time"
                      label="🕒 Начало работы"
                      value={minutesToTime(item.work.start)}
                      onChange={(e) => handleChange(day, "work", "start", e.target.value)}
                      sx={{ width: { xs: "100%", sm: "200px" } }}
                    />
                    <TextField
                      type="time"
                      label="🕒 Конец работы"
                      value={minutesToTime(item.work.end)}
                      onChange={(e) => handleChange(day, "work", "end", e.target.value)}
                      sx={{ width: { xs: "100%", sm: "200px" } }}
                    />
                  </Box>
                  {item.break && (
                    <Box display="flex" gap={2} flexWrap="wrap">
                      <TextField
                        type="time"
                        label="🍴 Начало обеда"
                        value={minutesToTime(item.break.start)}
                        onChange={(e) => handleChange(day, "break", "start", e.target.value)}
                        sx={{ width: { xs: "100%", sm: "200px" } }}
                      />
                      <TextField
                        type="time"
                        label="🍴 Конец обеда"
                        value={minutesToTime(item.break.end)}
                        onChange={(e) => handleChange(day, "break", "end", e.target.value)}
                        sx={{ width: { xs: "100%", sm: "200px" } }}
                      />
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
          );
        })}
      </Box>

    </Box>
  );
};

export default WorkingHoursForm;
