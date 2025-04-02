import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react-native";

// This is a placeholder component - in a real app, you would fetch actual swap requests
export default function ShiftSwapRequestList() {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  // In a real app, you would fetch the actual swap requests here
  useEffect(() => {
    // Placeholder for demonstration
    setRequests([]);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const RequestItem = ({ item }) => {
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
      <View className="bg-white rounded-xl p-4 mb-3 shadow-md">
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
              <Calendar size={12} color="#4facfe" />
              <Text className="text-gray-800 ml-1 text-sm">
                {formatDate(item.fromShift.workingDate)} (
                {item.fromShift.workingSlot?.dayName})
              </Text>
            </View>
            <View className="flex-row items-center mt-1">
              <MapPin size={12} color="#4facfe" />
              <Text className="text-gray-800 ml-1 text-sm">
                {item.fromShift.zoneName}
              </Text>
            </View>
            <View className="flex-row items-center mt-1">
              <Clock size={12} color="#4facfe" />
              <Text className="text-gray-800 ml-1 text-sm">
                {item.fromShift.workingSlot?.shiftName} (
                {item.fromShift.workingSlot?.shiftStart} -{" "}
                {item.fromShift.workingSlot?.shiftEnd})
              </Text>
            </View>
          </View>

          <View className="items-center">
            <ChevronDown size={16} color="#4facfe" />
          </View>

          <View className="bg-green-50 rounded-lg p-2">
            <Text className="text-gray-600 text-xs mb-1">Ca muốn đổi:</Text>
            <View className="flex-row items-center">
              <Calendar size={12} color="#4facfe" />
              <Text className="text-gray-800 ml-1 text-sm">
                {formatDate(item.toShift.workingDate)} (
                {item.toShift.workingSlot?.dayName})
              </Text>
            </View>
            <View className="flex-row items-center mt-1">
              <MapPin size={12} color="#4facfe" />
              <Text className="text-gray-800 ml-1 text-sm">
                {item.toShift.zoneName}
              </Text>
            </View>
            <View className="flex-row items-center mt-1">
              <Clock size={12} color="#4facfe" />
              <Text className="text-gray-800 ml-1 text-sm">
                {item.toShift.workingSlot?.shiftName} (
                {item.toShift.workingSlot?.shiftStart} -{" "}
                {item.toShift.workingSlot?.shiftEnd})
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="bg-white rounded-xl p-6 items-center justify-center shadow-md">
        <ActivityIndicator color="#ff7e5f" />
      </View>
    );
  }

  return (
    <View>
      {requests.map((item) => (
        <RequestItem key={item.id} item={item} />
      ))}
      {requests.length === 0 && (
        <View className="bg-white rounded-xl p-6 items-center justify-center shadow-md">
          <Text className="text-gray-500 text-center">
            Không có yêu cầu đổi ca nào
          </Text>
        </View>
      )}
    </View>
  );
}
