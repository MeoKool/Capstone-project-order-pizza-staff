import { View, Text, TouchableOpacity } from "react-native";
import { Users } from "lucide-react-native";

const TableItem = ({ item, onPress, getStatusColor }) => {
  const statusColor = getStatusColor(item.status);

  const getStatusLabel = (status) => {
    switch (status) {
      case "Opening":
        return "Bàn mở";
      case "Closing":
        return "Bàn đóng";
      case "Reserved":
        return "Bàn đã đặt trước";
      case "Locked":
        return "Bàn đã khóa";
      default:
        return status;
    }
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 m-2 shadow-lg"
      style={{
        width: 180,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.8)",
      }}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      {/* Status Indicator */}
      <View className="flex-row justify-between items-center mb-3">
        <View
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: statusColor }}
        />
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: statusColor + "30" }}
        >
          <Text style={{ color: statusColor }} className="text-xs font-bold">
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      {/* Table Number */}
      <View
        className="items-center justify-center bg-gray-100 rounded-xl py-5 mb-3 shadow-inner"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 1,
        }}
      >
        <Text className="text-gray-500 text-xs font-medium mb-1">Bàn</Text>
        <Text className="text-gray-900 text-3xl font-bold">{item.code}</Text>
      </View>

      {/* Footer Info */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center bg-gray-200 px-3 py-1.5 rounded-lg">
          <Users size={14} color="#374151" />
          <Text className="text-gray-700 text-sm ml-1 font-bold">
            {item.capacity}
          </Text>
        </View>

        <View
          className="px-3 py-1.5 rounded-lg"
          style={{
            backgroundColor: item.currentOrderId ? "#FECDD3" : "#D1FAE5",
          }}
        >
          <Text
            style={{
              color: item.currentOrderId ? "#EF4444" : "#10B981",
            }}
            className="text-xs font-bold"
          >
            {item.currentOrderId ? "Có khách" : "Trống"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TableItem;
