import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { ChevronDown, ChevronUp, X } from "lucide-react-native";
import OrderItem from "./OrderItem";
import axios from "axios";

export default function OrderItemList({
  orderItems,
  error,
  onRetry,
  tableId,
  navigation,
}) {
  const [expandedSections, setExpandedSections] = useState({
    "Chưa hoàn thành": true,
    "Hoàn thành": true,
  });
  const [closingTable, setClosingTable] = useState(false);

  const sections = [
    {
      title: "Chưa hoàn thành",
      data: orderItems.filter((item) => item.orderItemStatus !== "Done"),
      count: orderItems.filter((item) => item.orderItemStatus !== "Done")
        .length,
      color: "#f97316",
    },
    {
      title: "Hoàn thành",
      data: orderItems.filter((item) => item.orderItemStatus === "Done"),
      count: orderItems.filter((item) => item.orderItemStatus === "Done")
        .length,
      color: "#10b981",
    },
  ];

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const renderSectionHeader = ({ section: { title, count, color } }) => (
    <TouchableOpacity
      onPress={() => toggleSection(title)}
      className="bg-white px-4 py-2 mb-2 rounded-lg flex-row justify-between items-center"
      style={{ borderLeftWidth: 4, borderLeftColor: color }}
    >
      <Text className="font-bold text-lg" style={{ color: color }}>
        {title} ({count})
      </Text>
      {expandedSections[title] ? (
        <ChevronUp size={24} color={color} />
      ) : (
        <ChevronDown size={24} color={color} />
      )}
    </TouchableOpacity>
  );

  const handleCloseTable = async () => {
    if (!tableId) return;

    try {
      setClosingTable(true);
      const response = await axios.put(
        `https://vietsac.id.vn/api/tables/close-table/${tableId}`
      );

      if (response.data && response.data.success) {
        navigation && navigation.goBack();
      } else {
        throw new Error(response.data?.error?.message || "Không thể đóng bàn");
      }
    } catch (err) {
      console.error("Error closing table:", err);
    } finally {
      setClosingTable(false);
    }
  };

  // Show error message with retry button
  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-white text-lg text-center mb-4">{error}</Text>

        {/* Add Close Table button when there are no orders */}
        {tableId && (
          <View className="mt-4">
            <TouchableOpacity
              className="bg-red-500 rounded-xl py-3 px-6 shadow-lg flex-row items-center mb-4"
              onPress={handleCloseTable}
              disabled={closingTable}
              activeOpacity={0.7}
            >
              <X size={18} color="white" className="mr-2" />
              <Text className="text-white font-bold">
                {closingTable ? "Đang đóng bàn..." : "Đóng bàn"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

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

  // If there are no order items, show empty message with close table button
  if (orderItems.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        {tableId && (
          <TouchableOpacity
            className="bg-red-500 rounded-xl py-3 px-6 shadow-lg flex-row items-center"
            onPress={handleCloseTable}
            disabled={closingTable}
            activeOpacity={0.7}
          >
            <X size={18} color="white" className="mr-2" />
            <Text className="text-white font-bold">
              {closingTable ? "Đang đóng bàn..." : "Đóng bàn"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // If there are order items, show the sections
  return (
    <FlatList
      data={sections}
      renderItem={({ item }) => (
        <View>
          {renderSectionHeader({ section: item })}
          {expandedSections[item.title] &&
            item.data.map((orderItem) => (
              <OrderItem
                key={orderItem.id}
                item={orderItem}
                onRefresh={onRetry}
              />
            ))}
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 100,
      }}
    />
  );
}
