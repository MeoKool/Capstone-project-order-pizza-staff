import { View, Text, Dimensions } from "react-native";
import { formatDate, isToday } from "../../utils/dateUtils";

const { width } = Dimensions.get("window");

export default function WeekCalendar({ weekDates }) {
  return (
    <View className="px-4 flex-row justify-between mb-4">
      {weekDates.map((date, index) => {
        const today = isToday(date);
        return (
          <View
            key={index}
            className={`items-center justify-center p-2 rounded-full ${
              today ? "bg-white" : "bg-white/20"
            }`}
            style={{ width: (width - 48) / 7 }}
          >
            <Text
              className={`text-xs font-medium ${
                today ? "text-orange-500" : "text-white"
              }`}
            >
              {formatDate(date)}
            </Text>
            <Text
              className={`text-base font-bold mt-1 ${
                today ? "text-orange-500" : "text-white"
              }`}
            >
              {date.getDate()}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
