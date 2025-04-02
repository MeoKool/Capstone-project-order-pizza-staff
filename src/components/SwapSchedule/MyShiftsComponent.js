import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Calendar, Clock, MapPin } from "lucide-react-native";

export default function MyShiftsComponent({ shifts, onShiftSelect }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderShiftItem = ({ item }) => (
    <TouchableOpacity
      className="bg-white/90 rounded-xl p-4 mb-3 shadow-sm"
      onPress={() => onShiftSelect(item)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <Calendar size={16} color="#ff7e5f" />
          <Text className="text-gray-800 font-medium ml-2">
            {formatDate(item.workingDate)} ({item.workingSlot?.dayName})
          </Text>
        </View>
      </View>
      <View className="space-y-2">
        <View className="flex-row items-center">
          <MapPin size={16} color="#6B7280" />
          <Text className="text-gray-700 ml-2">Khu vực: {item.zoneName}</Text>
        </View>
        <View className="flex-row items-center">
          <Clock size={16} color="#6B7280" />
          <Text className="text-gray-700 ml-2">
            Ca: {item.workingSlot?.shiftName} ({item.workingSlot?.shiftStart} -{" "}
            {item.workingSlot?.shiftEnd})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      {shifts.length > 0 ? (
        <FlatList
          data={shifts}
          renderItem={renderShiftItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      ) : (
        <View className="bg-white/20 rounded-xl p-6 items-center">
          <Text className="text-white text-center">
            Bạn không có ca làm việc nào
          </Text>
        </View>
      )}
    </View>
  );
}
