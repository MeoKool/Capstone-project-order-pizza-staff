import { View, Text } from "react-native";
import { Info } from "lucide-react-native";

const RegistrationSummary = ({ selectedSlots, getTotalHours }) => {
  return (
    <View className="px-6 mt-2 mb-8">
      <View
        className="bg-white rounded-2xl p-4"
        style={{
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }}
      >
        <View className="flex-row items-center mb-3">
          <Info size={20} color="#4D96FF" />
          <Text className="ml-2 text-gray-800 font-semibold">
            Thông tin đăng ký
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Số ca đăng ký:</Text>
          <Text className="font-semibold text-gray-800">
            {Object.values(selectedSlots).reduce(
              (acc, slots) => acc + slots.length,
              0
            )}{" "}
            ca
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Tổng số giờ:</Text>
          <Text className="font-semibold text-gray-800">
            {getTotalHours()} giờ
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-gray-600">Trạng thái:</Text>
          <Text className="font-semibold text-blue-500">Chờ xác nhận</Text>
        </View>
      </View>
    </View>
  );
};

export default RegistrationSummary;
