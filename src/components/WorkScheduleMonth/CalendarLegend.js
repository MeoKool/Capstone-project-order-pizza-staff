import { View, Text } from "react-native";

export default function CalendarLegend() {
  return (
    <View className="flex-row items-center justify-center mt-6 mb-4">
      <View className="flex-row items-center mr-4">
        <View className="w-3 h-3 rounded-full bg-[#4D96FF] mr-2" />
        <Text className="text-gray-600">Có lịch làm việc</Text>
      </View>
      <View className="flex-row items-center">
        <View className="w-3 h-3 rounded-full bg-[#ff7e5f] mr-2" />
        <Text className="text-gray-600">Hôm nay</Text>
      </View>
    </View>
  );
}
