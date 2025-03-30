import { View, ActivityIndicator, Text } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

// Configure the calendar locale
LocaleConfig.locales["vi"] = {
  monthNames: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  monthNamesShort: [
    "Th1",
    "Th2",
    "Th3",
    "Th4",
    "Th5",
    "Th6",
    "Th7",
    "Th8",
    "Th9",
    "Th10",
    "Th11",
    "Th12",
  ],
  dayNames: [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ],
  dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
};

// Set the default locale
LocaleConfig.defaultLocale = "vi";

export default function MonthCalendar({
  currentDate,
  markedDates,
  onDayPress,
  loading,
}) {
  return (
    <View>
      {loading ? (
        <View className="items-center justify-center py-10">
          <ActivityIndicator size="large" color="#ff7e5f" />
          <Text className="mt-4 text-gray-500">Đang tải lịch làm việc...</Text>
        </View>
      ) : (
        <Calendar
          current={currentDate}
          onDayPress={onDayPress}
          markedDates={markedDates}
          markingType="dot"
          firstDay={1}
          theme={{
            calendarBackground: "white",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#4D96FF",
            selectedDayTextColor: "white",
            todayTextColor: "#ff7e5f",
            dayTextColor: "#2d4150",
            textDisabledColor: "#d9e1e8",
            dotColor: "#4D96FF",
            selectedDotColor: "white",
            arrowColor: "#ff7e5f",
            monthTextColor: "#ff7e5f",
            indicatorColor: "#ff7e5f",
            textDayFontWeight: "300",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "300",
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
            "stylesheet.calendar.header": {
              header: {
                flexDirection: "row",
                justifyContent: "space-between",
                paddingLeft: 10,
                paddingRight: 10,
                marginTop: 6,
                alignItems: "center",
                height: 0,
                opacity: 0,
              },
            },
          }}
        />
      )}
    </View>
  );
}
