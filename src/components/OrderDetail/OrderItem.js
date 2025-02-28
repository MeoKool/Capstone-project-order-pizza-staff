import { View, Text } from "react-native";

export default function OrderItem({ item }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
        return "#22c55e";
      default:
        return "#eab308";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Done":
        return "Hoàn thành";
      default:
        return "Chưa hoàn thành";
    }
  };

  return (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-md relative">
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
    </View>
  );
}
