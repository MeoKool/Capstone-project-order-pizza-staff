import { View, Text, TouchableOpacity } from "react-native";
import { Clock, MapPin, Users } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const TodaySchedule = () => {
  const navigation = useNavigation();

  return (
    <View className="bg-white rounded-2xl p-6 shadow-lg">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Clock size={24} color="#4D96FF" />
          <Text className="text-gray-800 font-bold text-xl ml-2">
            Ca làm việc hôm nay
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("ToDoWeek")}>
          <Text className="text-[#4D96FF] font-semibold">Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-gray-600 text-base mb-1">Thời gian</Text>
          <Text className="text-gray-800 font-semibold text-lg">
            08:00 - 17:00
          </Text>
        </View>
        <View>
          <Text className="text-gray-600 text-base mb-1">Vị trí</Text>
          <View className="flex-row items-center">
            <MapPin size={16} color="#4D96FF" />
            <Text className="text-gray-800 font-semibold text-lg ml-1">
              Khu vực ban công
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TodaySchedule;
