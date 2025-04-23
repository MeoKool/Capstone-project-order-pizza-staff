"use client";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { useRef, useEffect } from "react";
import { Calendar } from "lucide-react-native";

const DAYS_OF_WEEK = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const FULL_DAYS = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

const WeekCalendar = ({ weekDates, selectedDate, setSelectedDate }) => {
  const scrollViewRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animate calendar on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Format date as DD/MM
  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if a date is selected
  const isDateSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  // Handle date selection with animation
  const handleDateSelect = (date) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedDate(date);
  };

  return (
    <Animated.View className="px-6 mt-2" style={{ opacity: fadeAnim }}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white text-xl font-bold">Chọn ngày làm việc</Text>
        <View className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-full">
          <Calendar size={16} color="white" />
          <Text className="text-white ml-1.5 text-sm font-medium">
            {FULL_DAYS[selectedDate.getDay()]}, {selectedDate.getDate()}/
            {selectedDate.getMonth() + 1}
          </Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
        contentContainerStyle={{ paddingRight: 20 }}
        decelerationRate="fast"
        snapToInterval={90} // Approximate width of each date item
        snapToAlignment="start"
      >
        {weekDates.map((date, index) => {
          const isSelected = isDateSelected(date);
          const today = isToday(date);

          return (
            <Animated.View
              key={index}
              style={{
                transform: isSelected ? [{ scale: scaleAnim }] : [{ scale: 1 }],
              }}
            >
              <TouchableOpacity
                onPress={() => handleDateSelect(date)}
                className={`mr-3 items-center justify-center px-4 py-3.5 rounded-xl ${
                  isSelected
                    ? "bg-white"
                    : today
                    ? "bg-white/30"
                    : "bg-white/20"
                }`}
                style={{
                  minWidth: 85,
                  shadowColor: isSelected ? "#000" : "transparent",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 6,
                  elevation: isSelected ? 4 : 0,
                }}
              >
                <Text
                  className={`font-medium ${
                    isSelected ? "text-orange-500" : "text-white"
                  }`}
                >
                  {DAYS_OF_WEEK[date.getDay()]}
                </Text>
                <Text
                  className={`text-xl font-bold mt-1 ${
                    isSelected ? "text-orange-500" : "text-white"
                  }`}
                >
                  {formatDate(date)}
                </Text>
                {today && (
                  <View
                    className={`w-2 h-2 rounded-full mt-1.5 ${
                      isSelected ? "bg-orange-500" : "bg-white"
                    }`}
                  />
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

export default WeekCalendar;
