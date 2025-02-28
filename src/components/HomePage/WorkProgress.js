import { View, Text, TouchableOpacity } from "react-native";
import { Calendar, Clock, RefreshCcw } from "lucide-react-native";

const workStats = [
  {
    value: "6",
    label: "Số ngày làm việc",
    icon: Calendar,
    color: "#FF6B6B",
    bgColor: "#FFE8E8",
  },
  {
    value: "30",
    label: "Số giờ làm việc",
    icon: Clock,
    color: "#4D96FF",
    bgColor: "#E8F1FF",
  },
  {
    value: "80%",
    label: "Tiến độ",
    icon: RefreshCcw,
    color: "#6BCB77",
    bgColor: "#E8F8EA",
  },
];

const WorkProgress = () => (
  <View className="px-6 mt-2">
    <Text className="text-white text-xl font-bold mb-4">Tiến độ công việc</Text>
    <View className="flex-row justify-between">
      {workStats.map((stat, index) => (
        <TouchableOpacity
          key={index}
          className="bg-white rounded-2xl p-4 w-[31%]"
          style={{
            elevation: 8,
            shadowColor: stat.color,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}
          activeOpacity={0.9}
        >
          <View
            className={`w-10 h-10 rounded-full items-center justify-center mb-3`}
            style={{ backgroundColor: stat.bgColor }}
          >
            <stat.icon size={20} color={stat.color} />
          </View>
          <Text className="text-2xl font-bold" style={{ color: stat.color }}>
            {stat.value}
          </Text>
          <Text className="text-gray-600 text-xs mt-1 leading-tight">
            {stat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default WorkProgress;
