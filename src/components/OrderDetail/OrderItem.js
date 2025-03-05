import { View, Text, TouchableOpacity, Alert, Dimensions } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Trash2 } from "lucide-react-native";
import axios from "axios";

const API_URL = "https://vietsac.id.vn/pizza-service";
const { width } = Dimensions.get("window");

export default function OrderItem({ item, onRefresh }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
        return "#22c55e";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#eab308";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Done":
        return "Hoàn thành";
      case "Cancelled":
        return "Đã hủy";
      default:
        return "Chưa hoàn thành";
    }
  };

  const handleCancelItem = async () => {
    try {
      Alert.alert("Xác nhận", `Bạn có chắc muốn hủy "${item.name}"?`, [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: async () => {
            const response = await axios.put(
              `${API_URL}/api/order-items/cancelled/${item.id}`
            );

            if (response.data.success) {
              Alert.alert("Thành công", "Đã hủy món thành công");
              if (onRefresh) onRefresh();
            } else {
              throw new Error(response.data.message || "Hủy món thất bại");
            }
          },
        },
      ]);
    } catch (err) {
      Alert.alert("Lỗi", err.message || "Không thể hủy món. Vui lòng thử lại.");
    }
  };

  const renderItemContent = () => (
    <>
      {/* Status Badge */}
      <View
        className="absolute top-4 right-4 rounded-full px-3 py-1 flex-row items-center"
        style={{ backgroundColor: `${getStatusColor(item.orderItemStatus)}20` }}
      >
        <View
          className="w-2 h-2 rounded-full mr-1.5"
          style={{ backgroundColor: getStatusColor(item.orderItemStatus) }}
        />
        <Text
          className="text-sm font-medium"
          style={{ color: getStatusColor(item.orderItemStatus) }}
        >
          {getStatusText(item.orderItemStatus)}
        </Text>
      </View>

      {/* Main content */}
      <Text className="text-lg font-semibold text-gray-800 pr-32">
        {item.name}
      </Text>
      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-gray-600">Số lượng: {item.quantity}</Text>
        <Text className="text-sm text-gray-600">
          {item.price.toLocaleString("vi-VN")} VNĐ
        </Text>
      </View>

      {item.orderItemDetails && item.orderItemDetails.length > 0 && (
        <View className="mt-2">
          <Text className="text-sm font-medium text-gray-700">Tùy chọn:</Text>
          {item.orderItemDetails.map((detail) => (
            <View key={detail.id} className="flex-row justify-between mt-1">
              <Text className="text-xs text-gray-600">{detail.name}</Text>
              <Text className="text-xs text-gray-600">
                +{detail.additionalPrice.toLocaleString("vi-VN")} VNĐ
              </Text>
            </View>
          ))}
          <View className="h-px bg-gray-200 my-2" />
          <Text className="text-sm font-medium text-gray-700">
            Tổng: {item.totalPrice.toLocaleString("vi-VN")} VNĐ
          </Text>
        </View>
      )}
    </>
  );

  const renderRightActions = () => {
    // Only show delete action for incomplete items
    if (item.orderItemStatus === "Done") return null;

    return (
      <TouchableOpacity
        className="bg-red-500 justify-center items-center rounded-r-lg"
        style={{ width: 80 }}
        onPress={handleCancelItem}
      >
        <Trash2 size={24} color="white" />
      </TouchableOpacity>
    );
  };

  // Don't enable swipe for completed items
  if (item.orderItemStatus === "Done") {
    return (
      <View className="bg-white rounded-lg p-4 mb-3 shadow-md relative">
        {renderItemContent()}
      </View>
    );
  }

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      friction={2}
      overshootRight={false}
      containerStyle={{ marginBottom: 12 }}
    >
      <View className="bg-white rounded-l-lg p-4 shadow-md relative">
        {renderItemContent()}
      </View>
    </Swipeable>
  );
}
