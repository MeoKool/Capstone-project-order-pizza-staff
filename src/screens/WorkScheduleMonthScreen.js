import { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import components
import Header from "../components/WorkScheduleMonth/Header";
import MonthNavigation from "../components/WorkScheduleMonth/MonthNavigation";
import MonthCalendar from "../components/WorkScheduleMonth/MonthCalendar";
import CalendarLegend from "../components/WorkScheduleMonth/CalendarLegend";
import Instructions from "../components/WorkScheduleMonth/Instructions";
import DayScheduleModal from "../components/WorkScheduleMonth/DayScheduleModal";

// Import utilities
import {
  formatDateForAPI,
  getMonthRange,
  formatDateForDisplay,
} from "../utils/dateUtils";

export default function WorkScheduleMonthScreen({ navigation }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const [staffId, setStaffId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [daySchedule, setDaySchedule] = useState([]);
  const [loadingDaySchedule, setLoadingDaySchedule] = useState(false);

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

  // Fetch schedule data for the current month when staffId changes
  useEffect(() => {
    if (staffId) {
      fetchMonthSchedule();
    }
  }, [currentMonth, staffId]);

  // Fetch schedule data for the current month
  const fetchMonthSchedule = async () => {
    if (!staffId) return;

    try {
      setLoading(true);
      const { firstDay, lastDay } = getMonthRange(currentMonth);

      // In a real implementation, you would fetch all schedules for the month
      // For now, we'll simulate by marking some dates

      // This is a placeholder. In a real app, you would fetch data for the entire month
      // and mark dates accordingly
      const response = await fetch(
        `https://vietsac.id.vn/api/staff-zone-schedules?StaffId=${staffId}&IncludeProperties=WorkingSlot%2CZone`
      );
      const data = await response.json();

      if (data.success) {
        const newMarkedDates = {};

        // Process the data to mark dates with schedules
        data.result.items.forEach((item) => {
          const date = item.workingDate;
          newMarkedDates[date] = {
            marked: true,
            dotColor: "#4D96FF",
            selected: date === selectedDate,
            selectedColor: date === selectedDate ? "#4D96FF" : undefined,
          };
        });

        setMarkedDates(newMarkedDates);
      }
    } catch (error) {
      console.error("Error fetching month schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch schedule for a specific day
  const fetchDaySchedule = async (date) => {
    if (!staffId) return;

    try {
      setLoadingDaySchedule(true);
      const response = await fetch(
        `https://vietsac.id.vn/api/staff-zone-schedules?WorkingDate=${date}&StaffId=${staffId}&IncludeProperties=WorkingSlot%2CZone`
      );
      const data = await response.json();

      if (data.success) {
        setDaySchedule(data.result.items);
      } else {
        setDaySchedule([]);
      }
    } catch (error) {
      console.error("Error fetching day schedule:", error);
      setDaySchedule([]);
    } finally {
      setLoadingDaySchedule(false);
    }
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    // Update selected date in markedDates
    const updatedMarkedDates = { ...markedDates };

    // Remove selection from previously selected date
    if (selectedDate && updatedMarkedDates[selectedDate]) {
      updatedMarkedDates[selectedDate] = {
        ...updatedMarkedDates[selectedDate],
        selected: false,
        selectedColor: undefined,
      };
    }

    // Mark the new selected date
    updatedMarkedDates[date.dateString] = {
      ...(updatedMarkedDates[date.dateString] || {}),
      marked: updatedMarkedDates[date.dateString]?.marked || false,
      dotColor: updatedMarkedDates[date.dateString]?.dotColor || "#4D96FF",
      selected: true,
      selectedColor: "#4D96FF",
    };

    setSelectedDate(date.dateString);
    setMarkedDates(updatedMarkedDates);

    // Fetch schedule for the selected date
    fetchDaySchedule(date.dateString);
    setModalVisible(true);
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <LinearGradient
        colors={["#ff7e5f", "#feb47b"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView className="flex-1 pt-10">
          {/* Header */}
          <Header navigation={navigation} title="Lịch làm việc tháng" />

          {/* Month Navigation */}
          <MonthNavigation
            currentMonth={currentMonth}
            onPrevious={goToPreviousMonth}
            onNext={goToNextMonth}
          />

          {/* Calendar */}
          <View className="bg-white rounded-t-3xl flex-1 mt-4 px-4 pt-6">
            <MonthCalendar
              currentDate={formatDateForAPI(currentMonth)}
              markedDates={markedDates}
              onDayPress={handleDateSelect}
              loading={loading}
            />

            {/* Legend */}
            <CalendarLegend />

            {/* Instructions */}
            <Instructions />
          </View>

          {/* Day Schedule Modal */}
          <DayScheduleModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            selectedDate={selectedDate}
            daySchedule={daySchedule}
            loading={loadingDaySchedule}
            formatDateForDisplay={formatDateForDisplay}
          />
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
