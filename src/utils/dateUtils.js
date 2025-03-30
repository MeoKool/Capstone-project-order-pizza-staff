// Get dates for the current week (Sunday to Saturday)
export const getWeekDates = (currentDate) => {
  const dates = [];
  const firstDayOfWeek = new Date(currentDate);
  const day = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Set to the first day of the week (Sunday)
  firstDayOfWeek.setDate(currentDate.getDate() - day);

  // Generate 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDayOfWeek);
    date.setDate(firstDayOfWeek.getDate() + i);
    dates.push(date);
  }

  return dates;
};

// Format date as DD/MM
export const formatDate = (date) => {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return days[date.getDay()];
};

// Check if a date is today
export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Format date as YYYY-MM-DD for API
export const formatDateForAPI = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Format date as MM-DD for keys
export const formatDateKey = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
};
