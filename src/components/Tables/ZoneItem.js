"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, Animated } from "react-native";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react-native";
import TableItem from "./TableItem";

const ZoneItem = ({
  zone,
  tables,
  onTablePress,
  getStatusColor,
  isStaffZone,
}) => {
  const zoneTables = tables.filter((table) => table.zoneId === zone.id);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Move all hooks before any conditional returns
  const itemWidth = useMemo(() => 200, []);

  const scrollToOffset = useCallback((offset) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: offset,
        animated: true,
      });
    }
  }, []);

  const scrollToNextItem = useCallback(() => {
    const newOffset = Math.min(
      (zoneTables.length - 1) * itemWidth,
      scrollX._value + itemWidth
    );
    scrollToOffset(newOffset);
  }, [zoneTables.length, itemWidth, scrollX, scrollToOffset]);

  const scrollToPreviousItem = useCallback(() => {
    const newOffset = Math.max(0, scrollX._value - itemWidth);
    scrollToOffset(newOffset);
  }, [itemWidth, scrollX, scrollToOffset]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const contentWidth = event.nativeEvent.contentSize.width;
        const layoutWidth = event.nativeEvent.layoutMeasurement.width;

        setShowLeftButton(contentOffset > 10);
        setShowRightButton(contentOffset < contentWidth - layoutWidth - 10);
      },
    }
  );

  const renderTableItem = useCallback(
    ({ item }) => (
      <TableItem
        item={item}
        onPress={onTablePress}
        getStatusColor={getStatusColor}
      />
    ),
    [onTablePress, getStatusColor]
  );

  // Now we can safely have a conditional return after all hooks are defined
  if (zoneTables.length === 0) return null;

  return (
    <View className="mb-8">
      <View
        className={`mx-4 rounded-t-2xl p-4 ${
          isStaffZone ? "bg-yellow-500/10" : "bg-white/10"
        }`}
        style={{
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: isStaffZone
            ? "rgba(234, 179, 8, 0.3)"
            : "rgba(255, 255, 255, 0.2)",
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            {isStaffZone ? (
              <View className="bg-yellow-500/20 p-2 rounded-full mr-3">
                <Star size={20} color="#FFD700" fill="#FFD700" />
              </View>
            ) : (
              <View className="bg-white/10 p-2 rounded-full mr-3">
                <MapPin size={20} color="white" />
              </View>
            )}
            <View>
              <Text className="text-white text-xl font-bold">{zone.name}</Text>
              <Text className="text-white/70 text-sm">
                {zoneTables.length} {zoneTables.length === 1 ? "bàn" : "bàn"}
              </Text>
            </View>
          </View>

          {isStaffZone && (
            <View className="bg-yellow-500/20 rounded-full px-3 py-1.5">
              <Text className="text-yellow-300 text-sm font-bold">
                Khu vực của bạn
              </Text>
            </View>
          )}
        </View>
      </View>

      <View
        className={`relative mx-4 rounded-b-2xl pb-4 ${
          isStaffZone ? "bg-yellow-500/10" : "bg-white/10"
        }`}
        style={{
          borderBottomWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: isStaffZone
            ? "rgba(234, 179, 8, 0.3)"
            : "rgba(255, 255, 255, 0.2)",
        }}
      >
        {showLeftButton && (
          <TouchableOpacity
            onPress={scrollToPreviousItem}
            className="absolute left-2 top-1/2 z-10 w-10 h-10 bg-white rounded-full items-center justify-center"
            style={{
              transform: [{ translateY: -20 }],
              elevation: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
            }}
          >
            <ChevronLeft size={24} color="#f26b0f" />
          </TouchableOpacity>
        )}
        {showRightButton && (
          <TouchableOpacity
            onPress={scrollToNextItem}
            className="absolute right-2 top-1/2 z-10 w-10 h-10 bg-white rounded-full items-center justify-center"
            style={{
              transform: [{ translateY: -20 }],
              elevation: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
            }}
          >
            <ChevronRight size={24} color="#f26b0f" />
          </TouchableOpacity>
        )}
        <FlatList
          ref={flatListRef}
          data={zoneTables}
          renderItem={renderTableItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={itemWidth}
          snapToAlignment="start"
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
