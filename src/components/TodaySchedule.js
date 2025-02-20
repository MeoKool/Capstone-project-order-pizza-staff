import { View, Text } from "react-native";
import { Clock } from "lucide-react-native";

const scheduleData = [
  { time: "08:00 - 12:00", task: "Ca sáng" },
  { time: "12:00 - 13:00", task: "Nghỉ trưa" },
  { time: "13:00 - 17:00", task: "Ca chiều" },
];

export default function TodaySchedule() {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-lg">
      {scheduleData.map((item, index) => (
        <View key={index} className="flex-row items-center mb-3">
          <View className="flex-row items-center w-30">
            <Clock size={16} color="#ff7e5f" />
            <Text className="ml-2 text-sm font-semibold text-[#ff7e5f]">
              {item.time}
            </Text>
          </View>
          <View className="flex-1 bg-[#fff5f1] p-2 rounded-lg">
            <Text className="text-sm font-medium text-[#1F2937]">
              {item.task}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
