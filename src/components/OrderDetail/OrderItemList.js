import { View, Text, FlatList, TouchableOpacity } from "react-native";
import OrderItem from "./OrderItem";

export default function OrderItemList({ orderItems, error, onRetry }) {
  const sections = [
    {
      title: "Chưa hoàn thành",
      data: orderItems.filter((item) => item.orderItemStatus !== "Done"),
      count: orderItems.filter((item) => item.orderItemStatus !== "Done")
        .length,
      color: "#f97316", // Changed to a more vibrant orange
    },
    {
      title: "Hoàn thành",
      data: orderItems.filter((item) => item.orderItemStatus === "Done"),
      count: orderItems.filter((item) => item.orderItemStatus === "Done")
        .length,
      color: "#10b981", // Changed to a more vibrant green
    },
  ];

  const renderSectionHeader = ({ section: { title, count, color } }) => (
    <View
      className="bg-white px-4 py-2 mb-2 rounded-lg"
      style={{ borderLeftWidth: 4, borderLeftColor: color }}
    >
      <Text className="font-bold text-lg" style={{ color: color }}>
        {title} ({count})
      </Text>
    </View>
  );

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-white text-lg text-center mb-4">{error}</Text>
        <TouchableOpacity
          className="bg-white rounded-xl py-3 px-6 shadow-lg"
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Text className="text-[#ff7e5f] font-bold">Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={sections}
      renderItem={({ item }) => (
        <View>
          {renderSectionHeader({ section: item })}
          {item.data.map((orderItem) => (
            <OrderItem key={orderItem.id} item={orderItem} />
          ))}
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 100,
      }}
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-white text-lg text-center mb-4">
            Bàn chưa có đơn hàng nào!
          </Text>
        </View>
      }
    />
  );
}
