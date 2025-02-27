"use client";

import { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, Animated, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomBar from "../components/BottomBar";
import Header from "../components/RegisterWork/Header";
import WeekCalendar from "../components/RegisterWork/WeekCalendar";
import TimeSlotSelector from "../components/RegisterWork/TimeSlotSelector";
import RegistrationSummary from "../components/RegisterWork/RegistrationSummary";
import SubmitButton from "../components/RegisterWork/SubmitButton";

// Days of the week in Vietnamese
const DAYS_OF_WEEK = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

// Time slot options for morning, afternoon, and evening shifts
const TIME_SLOTS = [
  { id: 1, time: "07:00 - 11:00", period: "Sáng" },
  { id: 2, time: "11:00 - 15:00", period: "Trưa" },
  { id: 3, time: "15:00 - 19:00", period: "Chiều" },
  { id: 4, time: "19:00 - 23:00", period: "Tối" },
];

export default function WorkScheduleScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState({});
  const [weekDates, setWeekDates] = useState([]);
  const [scrollY] = useState(new Animated.Value(0));

  // Generate dates for the current week
  useEffect(() => {
    const dates = [];
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate the first day of the week (Sunday)
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - day);

    // Generate 7 days starting from the first day of the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + i);
      dates.push(date);
    }

    setWeekDates(dates);
    setSelectedDate(today);
  }, []);

  // Toggle selection of a time slot for a specific date
  const toggleTimeSlot = (date, slotId) => {
    const dateStr = date.toDateString();

    setSelectedSlots((prev) => {
      const newSlots = { ...prev };

      if (!newSlots[dateStr]) {
        newSlots[dateStr] = [slotId];
      } else if (newSlots[dateStr].includes(slotId)) {
        newSlots[dateStr] = newSlots[dateStr].filter((id) => id !== slotId);
        if (newSlots[dateStr].length === 0) {
          delete newSlots[dateStr];
        }
      } else {
        newSlots[dateStr] = [...newSlots[dateStr], slotId];
      }

      return newSlots;
    });
  };

  // Count total selected hours
  const getTotalHours = () => {
    let total = 0;
    Object.values(selectedSlots).forEach((slots) => {
      total += slots.length * 4; // Each slot is 4 hours
    });
    return total;
  };

  // Submit the work schedule
  const handleSubmit = () => {
    if (Object.keys(selectedSlots).length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một ca làm việc");
      return;
    }

    // Format the selected slots for display
    const formattedSchedule = Object.entries(selectedSlots)
      .map(([dateStr, slots]) => {
        const date = new Date(dateStr);
        const dayName = DAYS_OF_WEEK[date.getDay()];
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
        const timeSlots = slots
          .map((slotId) => TIME_SLOTS.find((slot) => slot.id === slotId).time)
          .join(", ");

        return `${dayName} (${formattedDate}): ${timeSlots}`;
      })
      .join("\n");

    Alert.alert(
      "Xác nhận đăng ký",
      `Lịch làm việc của bạn:\n\n${formattedSchedule}\n\nTổng số giờ: ${getTotalHours()} giờ`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => {
            Alert.alert("Thành công", "Đăng ký lịch làm việc thành công!");
            navigation.navigate("Home");
          },
        },
      ]
    );
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [90, 80],
    extrapolate: "clamp",
  });

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <LinearGradient
        colors={["#ff7e5f", "#feb47b"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView className="flex-1">
          <Animated.ScrollView
            className="flex-1"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            {/* Header Component */}
            <Header
              navigation={navigation}
              title="Đăng ký giờ làm việc"
              headerHeight={headerHeight}
            />

            {/* Week Calendar Component */}
            <WeekCalendar
              weekDates={weekDates}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            {/* Time Slots Component */}
            <TimeSlotSelector
              selectedDate={selectedDate}
              selectedSlots={selectedSlots}
              toggleTimeSlot={toggleTimeSlot}
            />

            {/* Registration Summary Component */}
            <RegistrationSummary
              selectedSlots={selectedSlots}
              getTotalHours={getTotalHours}
            />

            {/* Submit Button Component */}
            <SubmitButton onPress={handleSubmit} />
          </Animated.ScrollView>

          <BottomBar
            activeTab={activeTab}
            onTabPress={(tabKey) => {
              setActiveTab(tabKey);
            }}
          />
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
