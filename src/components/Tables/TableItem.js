import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Table2, Users, Circle } from "lucide-react-native";

const TableItem = ({ item, onPress, getStatusColor }) => (
  <Animated.View>
    <TouchableOpacity
      className={`bg-white rounded-2xl p-5 m-2 shadow-lg ${
        false ? "border-2 border-[#f26b0f]" : "border border-gray-100"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        width: 180,
      }}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center mb-3">
        <View className="bg-[#f26b0f]/10 p-2 rounded-lg mr-3">
          <Table2 size={20} color="#f26b0f" />
        </View>
        <Text className="text-lg font-bold text-gray-800">Bàn {item.code}</Text>
      </View>

      <View className="flex-row items-center mb-3">
        <Users size={16} color="#6b7280" className="mr-2" />
        <Text className="text-sm text-gray-600">Capacity: {item.capacity}</Text>
      </View>

      <View className="flex-row items-center">
        <Circle
          size={8}
          fill={getStatusColor(item.status)}
          color={getStatusColor(item.status)}
          className="mr-2"
        />
        <Text
          className="text-sm font-medium"
          style={{ color: getStatusColor(item.status) }}
        >
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  </Animated.View>
);

export default TableItem;
