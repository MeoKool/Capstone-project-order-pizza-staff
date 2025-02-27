import { View, Text, TouchableOpacity } from "react-native";
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react-native";

const SAMPLE_REQUESTS = [
  {
    id: "1",
    currentShift: { date: "04/03/2024", time: "07:00 - 15:00" },
    requestedShift: { date: "05/03/2024", time: "15:00 - 23:00" },
    status: "pending",
  },
  {
    id: "2",
    currentShift: { date: "06/03/2024", time: "15:00 - 23:00" },
    requestedShift: { date: "07/03/2024", time: "07:00 - 15:00" },
    status: "approved",
  },
  {
    id: "3",
    currentShift: { date: "08/03/2024", time: "07:00 - 15:00" },
    requestedShift: { date: "09/03/2024", time: "15:00 - 23:00" },
    status: "rejected",
  },
];

const RequestItem = ({ item, onPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "approved":
        return "#4CAF50";
      case "rejected":
        return "#F44336";
      default:
        return "#6B7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AlertCircle size={16} color="#FFA500" />;
      case "approved":
        return <CheckCircle2 size={16} color="#4CAF50" />;
      case "rejected":
        return <AlertCircle size={16} color="#F44336" />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 shadow-md"
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-semibold text-gray-800 text-base">
          Yêu cầu đổi ca
        </Text>
        <View className="flex-row items-center">
          {getStatusIcon(item.status)}
          <Text
            className="ml-1 text-xs font-medium"
            style={{ color: getStatusColor(item.status) }}
          >
            {item.status === "pending"
              ? "Đang chờ duyệt"
              : item.status === "approved"
              ? "Đã duyệt"
              : "Từ chối"}
          </Text>
        </View>
      </View>
      <View className="space-y-2">
        <View className="bg-blue-50 rounded-lg p-2">
          <Text className="text-gray-600 text-xs mb-1">Ca hiện tại:</Text>
          <View className="flex-row items-center">
            <Clock size={12} color="#4facfe" />
            <Text className="text-gray-800 ml-1 text-sm">
              {item.currentShift.date} ({item.currentShift.time})
            </Text>
          </View>
        </View>
        <View className="items-center">
          <ChevronDown size={16} color="#4facfe" />
        </View>
        <View className="bg-green-50 rounded-lg p-2">
          <Text className="text-gray-600 text-xs mb-1">Ca muốn đổi:</Text>
          <View className="flex-row items-center">
            <Clock size={12} color="#4facfe" />
            <Text className="text-gray-800 ml-1 text-sm">
              {item.requestedShift.date} ({item.requestedShift.time})
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ShiftSwapRequestList() {
  const handleRequestPress = (item) => {
    console.log("Request pressed:", item);
    // Implement navigation or modal to show request details
  };

  return (
    <View>
      {SAMPLE_REQUESTS.map((item) => (
        <RequestItem
          key={item.id}
          item={item}
          onPress={() => handleRequestPress(item)}
        />
      ))}
      {SAMPLE_REQUESTS.length === 0 && (
        <View className="bg-white rounded-xl p-6 items-center justify-center shadow-md">
          <Text className="text-gray-500 text-center">
            Không có yêu cầu đổi ca nào
          </Text>
        </View>
      )}
    </View>
  );
}
