"use client";

import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import TableItem from "./TableItem";
import { useState, useRef } from "react";

const ZoneItem = ({ zone, tables, onTablePress, getStatusColor }) => {
  const zoneTables = tables.filter((table) => table.zoneId === zone.id);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const flatListRef = useRef(null);

  if (zoneTables.length === 0) return null;

  const scrollToNextItem = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: 200,
        animated: true,
      });
    }
  };

  const scrollToPreviousItem = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: -200,
        animated: true,
      });
    }
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const contentWidth = event.nativeEvent.contentSize.width;
    const layoutWidth = event.nativeEvent.layoutMeasurement.width;

    setShowLeftButton(contentOffset > 10);
    setShowRightButton(contentOffset < contentWidth - layoutWidth - 10);
  };

  return (
    <View className="mb-6">
      <View className="flex-row items-center mb-3 px-2">
        <View className="w-1.5 h-6 bg-white rounded-full mr-2" />
        <Text className="text-white text-xl font-bold">{zone.name}</Text>
        <Text className="text-white ml-2">({zoneTables.length} bàn)</Text>
      </View>
      <View className="relative">
        {showLeftButton && (
          <TouchableOpacity
            onPress={scrollToPreviousItem}
            className="absolute left-2 top-1/2 z-10 w-8 h-8 bg-white/90 rounded-full items-center justify-center"
            style={{
              transform: [{ translateY: -16 }],
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
            }}
          >
            <ChevronLeft size={24} color="#f26b0f" />
          </TouchableOpacity>
        )}
        {showRightButton && (
          <TouchableOpacity
            onPress={scrollToNextItem}
            className="absolute right-2 top-1/2 z-10 w-8 h-8 bg-white/90 rounded-full items-center justify-center"
            style={{
              transform: [{ translateY: -16 }],
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
            }}
          >
            <ChevronRight size={24} color="#f26b0f" />
          </TouchableOpacity>
        )}
        <FlatList
          ref={flatListRef}
          data={zoneTables}
          renderItem={({ item }) => (
            <TableItem
              item={item}
              onPress={onTablePress}
              getStatusColor={getStatusColor}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 6 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View className="flex items-center justify-center p-4 mx-2 bg-white/20 rounded-xl">
              <Text className="text-white text-center">
                Không tìm thấy bàn!
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default ZoneItem;
