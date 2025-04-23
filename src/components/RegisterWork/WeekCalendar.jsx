import { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { Calendar } from "lucide-react-native";
import { formatDate, isToday } from "../../utils/getDayName";

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
  const [fadeAnim] = useState(new Animated.Value(0));

  // Animate calendar on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Check if a date is selected
  const isDateSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    // Create a new Date object to ensure state update is triggered
    const newDate = new Date(date.getTime());
    setSelectedDate(newDate);
  };

  // Scroll to selected date when weekDates change
  useEffect(() => {
    if (weekDates.length > 0 && scrollViewRef.current) {
      // Find the index of the selected date in weekDates
      const selectedIndex = weekDates.findIndex(
        (date) => date.toDateString() === selectedDate.toDateString()
      );

      if (selectedIndex >= 0) {
        // Scroll to the selected date with animation
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: selectedIndex * 90, // Approximate width of each date item
            animated: true,
          });
        }, 100);
      }
    }
  }, [weekDates, selectedDate]);

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
            <View key={index}>
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
                activeOpacity={0.7}
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
            </View>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

export default WeekCalendar;
