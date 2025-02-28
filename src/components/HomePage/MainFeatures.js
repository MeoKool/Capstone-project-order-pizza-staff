import { View, Text, TouchableOpacity } from "react-native";
import { Calendar, Clock, RefreshCcw, ChevronRight } from "lucide-react-native";

const mainFeatures = [
  {
    icon: Calendar,
    label: "Lịch làm việc",
    color: "#4D96FF",
    bgColor: "#E8F1FF",
    screen: "ToDoWeek",
  },
  {
    icon: Clock,
    label: "Đăng ký giờ làm việc",
    color: "#FF6B6B",
    bgColor: "#FFE8E8",
    screen: "WorkSchedule",
  },
  {
    icon: RefreshCcw,
    label: "Đổi ca làm",
    color: "#6BCB77",
    bgColor: "#E8F8EA",
    screen: "SwapSchedule",
  },
];

const MainFeatures = ({ navigation }) => (
  <View className="px-6 mt-8">
    <Text className="text-white text-xl font-bold mb-4">Chức năng chính</Text>
    <View
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }}
    >
      {mainFeatures.map((feature, index) => (
        <TouchableOpacity
          key={index}
          className={`flex-row items-center p-4 ${
            index !== mainFeatures.length - 1 ? "border-b border-gray-100" : ""
          }`}
          onPress={() => navigation.navigate(feature.screen)}
          activeOpacity={0.7}
        >
          <View
            className={`w-12 h-12 rounded-full items-center justify-center`}
            style={{ backgroundColor: feature.bgColor }}
          >
            <feature.icon size={24} color={feature.color} />
          </View>
          <Text className="ml-4 flex-1 text-gray-800 font-semibold text-base">
            {feature.label}
          </Text>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default MainFeatures;
