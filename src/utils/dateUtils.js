export const getWeekDates = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday

  const monday = new Date(date.setDate(diff));
  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(monday);
    nextDate.setDate(monday.getDate() + i);
    weekDates.push(nextDate);
  }

  return weekDates;
};

export const formatDateKey = (date) => {
  return date.toISOString().split("T")[0];
};

export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const formatDate = (date) => {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return days[date.getDay()];
};
