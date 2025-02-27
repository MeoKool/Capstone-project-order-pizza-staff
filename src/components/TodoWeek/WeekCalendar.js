import { View, Text, Dimensions } from "react-native";
import { formatDate, isToday } from "../../utils/dateUtils";

const { width } = Dimensions.get("window");

export default function WeekCalendar({ weekDates }) {
  return (
    <View className="px-4 flex-row justify-between mb-4">
      {weekDates.map((date, index) => (
        <View
          key={index}
          className={`items-center justify-center p-2 rounded-full ${
            isToday(date) ? "bg-white/30" : "bg-transparent"
          }`}
          style={{ width: (width - 48) / 7 }}
        >
          <Text className="text-xs font-medium text-white">
            {formatDate(date)}
          </Text>
          <Text className="text-base font-bold mt-1 text-white">
            {date.getDate()}
          </Text>
        </View>
      ))}
    </View>
  );
}
