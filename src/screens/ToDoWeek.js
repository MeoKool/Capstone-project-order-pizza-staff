"use client";

import { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  View,
  Text,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WeekCalendar from "../components/TodoWeek/WeekCalendar";
import WeeklySchedule from "../components/TodoWeek/WeeklySchedule";
import { getWeekDates, formatDateForAPI } from "../utils/dateUtils";
import Header from "../components/Header";
import WeekNavigation from "../components/TodoWeek/WeekNavigation";

export default function ToDoWeekScreen({ navigation }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [staffId, setStaffId] = useState(null);

  // Get staff ID from AsyncStorage
  useEffect(() => {
    const getStaffId = async () => {
      try {
        const id = await AsyncStorage.getItem("staffId");
        if (id) {
          setStaffId(id);
        } else {
          console.warn("Staff ID not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error getting staff ID:", error);
      }
    };

    getStaffId();
  }, []);

  // Update week dates when current date changes
  useEffect(() => {
    const dates = getWeekDates(currentDate);
    setWeekDates(dates);
  }, [currentDate]);

  // Fetch schedule data when week dates or staffId changes
  useEffect(() => {
    if (weekDates.length > 0 && staffId) {
      fetchScheduleData();
    }
  }, [weekDates, staffId]);

  // Fetch schedule data from API
  const fetchScheduleData = async () => {
    if (!staffId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://vietsac.id.vn/api/staff-zone-schedules?StaffId=${staffId}&IncludeProperties=WorkingSlot%2CZone`
      );
      const data = await response.json();

      if (data.success) {
        setScheduleData(data.result.items);
      } else {
        console.error("Failed to fetch schedule data:", data.message);
        Alert.alert("Lỗi", "Không thể tải lịch làm việc");
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Format schedule data for WeeklySchedule component
  const getScheduleForWeek = () => {
    return weekDates.map((date) => {
      const formattedDate = formatDateForAPI(date);

      // Filter schedule items for this date
      const daySchedule = scheduleData
        .filter((item) => item.workingDate === formattedDate)
        .map((item) => ({
          id: item.id,
          shift: item.workingSlot?.shiftName || "Ca làm việc",
          time: `${item.workingSlot?.shiftStart?.substring(0, 5) || ""} - ${
            item.workingSlot?.shiftEnd?.substring(0, 5) || ""
          }`,
          role: item.zone?.name || "Khu vực chưa xác định",
          color: getZoneColor(item.zone?.type),
          zoneType: item.zone?.type || "Unknown",
        }));

      return {
        date,
        schedule: daySchedule,
      };
    });
  };

  // Get color based on zone type
  const getZoneColor = (zoneType) => {
    switch (zoneType) {
      case "DininingArea":
        return "#4F46E5"; // Indigo
      case "Kitchen":
        return "#EF4444"; // Red
      case "Bar":
        return "#F59E0B"; // Amber
      case "Reception":
        return "#10B981"; // Emerald
      default:
        return "#6B7280"; // Gray
    }
  };

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
          <Header title="Lịch làm việc" navigation={navigation} />
          <WeekNavigation
            currentDate={currentDate}
            weekDates={weekDates}
            onPrevious={goToPreviousWeek}
            onNext={goToNextWeek}
          />
          <WeekCalendar weekDates={weekDates} />

          {loading ? (
            <View className="flex-1 items-center justify-center bg-white/10 mx-6 rounded-2xl">
              <ActivityIndicator size="large" color="white" />
              <Text className="mt-4 text-white">Đang tải lịch làm việc...</Text>
            </View>
          ) : (
            <WeeklySchedule weekSchedule={getScheduleForWeek()} />
          )}
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
