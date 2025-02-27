import { View, Text, TouchableOpacity, ScrollView } from "react-native";

const DAYS_OF_WEEK = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

const WeekCalendar = ({ weekDates, selectedDate, setSelectedDate }) => {
  // Format date as DD/MM
  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if a date is selected
  const isDateSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <View className="px-6 mt-2">
      <Text className="text-white text-xl font-bold mb-4">
        Chọn ngày làm việc
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        {weekDates.map((date, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedDate(date)}
            className={`mr-3 items-center justify-center px-4 py-3 rounded-xl ${
              isDateSelected(date) ? "bg-white" : "bg-white/20"
            }`}
          >
            <Text
              className={`font-medium ${
                isDateSelected(date) ? "text-orange-500" : "text-white"
              }`}
            >
              {DAYS_OF_WEEK[date.getDay()].substring(0, 5)}
            </Text>
            <Text
              className={`text-lg font-bold mt-1 ${
                isDateSelected(date) ? "text-orange-500" : "text-white"
              }`}
            >
              {formatDate(date)}
            </Text>
            {isToday(date) && (
              <View
                className={`w-2 h-2 rounded-full mt-1 ${
                  isDateSelected(date) ? "bg-orange-500" : "bg-white"
                }`}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default WeekCalendar;
