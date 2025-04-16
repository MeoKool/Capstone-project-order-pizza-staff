"use client";

import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import OrderItem from "./OrderItem";

export default function OrderItemList({ orderItems, error, onRetry }) {
  const [expandedSections, setExpandedSections] = useState({
    "Chưa hoàn thành": true,
    "Hoàn thành": true,
  });

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
