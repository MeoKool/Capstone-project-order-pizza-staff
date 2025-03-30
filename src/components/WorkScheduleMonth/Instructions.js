import { View, Text } from "react-native";
import { Calendar } from "lucide-react-native";

export default function Instructions() {
  return (
    <View className="bg-gray-50 rounded-xl p-4 mb-6">
      <View className="flex-row items-center">
        <Calendar size={20} color="#ff7e5f" />
        <Text className="ml-2 text-gray-700 font-medium">Hướng dẫn</Text>
      </View>
      <Text className="text-gray-600 mt-2">
        Nhấn vào ngày để xem chi tiết lịch làm việc. Các ngày có dấu chấm xanh
        là những ngày bạn có lịch làm việc.
      </Text>
    </View>
  );
}
