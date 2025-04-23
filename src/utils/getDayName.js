// Get Vietnamese day name from day index
export const getDayName = (dayIndex) => {
  const days = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  return days[dayIndex];
};

// Format date as DD/MM
export const formatDate = (date) => {
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

// Format time from 24-hour format to 12-hour format
export const formatTime = (time) => {
  if (!time) return "";
  return time.substring(0, 5); // Just take HH:MM part
};

// Format date to YYYY-MM-DD
export const formatDateForAPI = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
