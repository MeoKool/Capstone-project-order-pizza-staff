"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  SafeAreaView,
  StatusBar,
  Animated,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Info, ClipboardList } from "lucide-react-native";
import BottomBar from "../components/BottomBar";
import Header from "../components/Header";
import WeekCalendar from "../components/RegisterWork/WeekCalendar";
import TimeSlotSelector from "../components/RegisterWork/TimeSlotSelector";
import RegistrationSummary from "../components/RegisterWork/RegistrationSummary";
import SubmitButton from "../components/RegisterWork/SubmitButton";
import ConfirmationModal from "../components/RegisterWork/ConfirmationModal";
import { getDayName, formatDateForAPI } from "../utils/getDayName";

export default function WorkScheduleScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState({});
  const [weekDates, setWeekDates] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [availableSlots, setAvailableSlots] = useState([]);
  const [allAvailableSlots, setAllAvailableSlots] = useState([]); // Store all slots for all days
  const [registeredSlots, setRegisteredSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [staffId, setStaffId] = useState(null);
  const [staffStatus, setStaffStatus] = useState("");
  const [configs, setConfigs] = useState({
    registrationWeekLimit: 1,
    registrationCutoffDay: 1,
  });
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState({
    title: "",
    message: "",
  });

  // Check staff status on component mount
  useEffect(() => {
    const checkStaffStatus = async () => {
      try {
        const status = await AsyncStorage.getItem("staffStatus");
        if (status) {
          setStaffStatus(status.toLowerCase());

          // If staff is fullTime, show alert and navigate back
          if (status.toLowerCase() === "fulltime") {
            setConfirmModalData({
              title: "Thông báo",
              message:
                "Nhân viên toàn thời gian không cần đăng ký giờ làm việc.",
            });
            setConfirmModalVisible(true);
          }
        }
      } catch (error) {
        console.error("Error checking staff status:", error);
      }
    };

    checkStaffStatus();
  }, [navigation]);

  // Get staff ID from AsyncStorage
  useEffect(() => {
    const getStaffId = async () => {
      try {
        const id = await AsyncStorage.getItem("staffId");
        if (id) {
          setStaffId(id);
          // Fetch registered slots once we have the staffId
          fetchRegisteredSlots(id);
        } else {
          console.warn("Staff ID not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error getting staff ID:", error);
      }
    };

    getStaffId();
  }, []);

  // Fetch configuration data
  useEffect(() => {
    fetchConfigs();
  }, []);

  // Fetch registered slots when date changes
  useEffect(() => {
    if (staffId) {
      fetchRegisteredSlots(staffId);
    }
  }, [selectedDate, staffId]);

  // Fetch configuration data from API
  const fetchConfigs = async () => {
    try {
      const response = await fetch("https://vietsac.id.vn/api/configs");
      const data = await response.json();

      if (data.success) {
        const configItems = data.result.items;

        // Find registration week limit
        const weekLimitConfig = configItems.find(
          (item) =>
            item.configType === "REGISTRATION_WEEK_LIMIT" ||
            item.key === "REGISTRATION_WEEK_LIMIT"
        );

        // Find registration cutoff day
        const cutoffDayConfig = configItems.find(
          (item) =>
            item.configType === "REGISTRATION_CUTOFF_DAY" ||
            item.key === "REGISTRATION_CUTOFF_DAY"
        );

        const weekLimit = weekLimitConfig
          ? Number.parseInt(weekLimitConfig.value)
          : 1;
        const cutoffDay = cutoffDayConfig
          ? Number.parseInt(cutoffDayConfig.value)
          : 1;

        setConfigs({
          registrationWeekLimit: weekLimit,
          registrationCutoffDay: cutoffDay,
        });

        // Generate dates based on the configuration
        generateDatesBasedOnConfig(weekLimit, cutoffDay);
      }
    } catch (error) {
      console.error("Error fetching configs:", error);
      // Use default values if config fetch fails
      generateDatesBasedOnConfig(1, 1);
    }
  };

  // Generate dates based on configuration
  const generateDatesBasedOnConfig = (weekLimit, cutoffDay) => {
    const dates = [];
    const today = new Date();

    // Add cutoff days to today to get the start date
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + cutoffDay);

    // Calculate how many days to show (weekLimit * 7)
    const daysToShow = weekLimit * 7;

    // Generate dates
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }

    setWeekDates(dates);
    setSelectedDate(dates[0]); // Select the first available date
  };

  // Fetch registered slots from API
  const fetchRegisteredSlots = async (staffId) => {
    if (!staffId) return;

    try {
      const response = await fetch(
        `https://vietsac.id.vn/api/working-slot-registers?year=0&month=0&day=0&dayOfWeek=0&StaffId=${staffId}`
      );
      const data = await response.json();

      if (data.success) {
        setRegisteredSlots(data.result.items);
      } else {
        console.error("Failed to fetch registered slots:", data.message);
      }
    } catch (error) {
      console.error("Error fetching registered slots:", error);
    }
  };

  // Navigate to registered shifts screen
  const navigateToRegisteredShifts = () => {
    navigation.navigate("RegisteredShifts", {
      staffId,
      registrationWeekLimit: configs.registrationWeekLimit,
      registrationCutoffDay: configs.registrationCutoffDay,
    });
  };

  // Fetch all available slots once
  useEffect(() => {
    fetchAllAvailableSlots();
  }, []);

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate && allAvailableSlots.length > 0) {
      filterAvailableSlots();
    }
  }, [selectedDate, allAvailableSlots]);

  // Fetch all available slots from API
  const fetchAllAvailableSlots = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://vietsac.id.vn/api/working-slots");
      const data = await response.json();

      if (data.success) {
        setAllAvailableSlots(data.result.items);
        // Initial filter for the current selected date
        filterAvailableSlots(data.result.items);
      } else {
        setConfirmModalData({
          title: "Lỗi",
          message: "Không thể tải ca làm việc",
        });
        setConfirmModalVisible(true);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      setConfirmModalData({
        title: "Lỗi",
        message: "Không thể kết nối đến máy chủ",
      });
      setConfirmModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Filter available slots based on selected date
  const filterAvailableSlots = (slots = allAvailableSlots) => {
    if (!selectedDate || slots.length === 0) return;

    const dayName = getDayName(selectedDate.getDay());

    const filteredSlots = slots.filter((slot) => slot.dayName === dayName);
    setAvailableSlots(filteredSlots);
  };

  // Check if a slot is already registered
  const isSlotRegistered = (date, slotId) => {
    const formattedDate = formatDateForAPI(date);
    return registeredSlots.some(
      (slot) =>
        slot.workingDate === formattedDate && slot.workingSlotId === slotId
    );
  };

  // Get registration status for a slot
  const getSlotRegistrationStatus = (date, slotId) => {
    const formattedDate = formatDateForAPI(date);
    const registeredSlot = registeredSlots.find(
      (slot) =>
        slot.workingDate === formattedDate && slot.workingSlotId === slotId
    );
    return registeredSlot ? registeredSlot.status : null;
  };

  // Toggle selection of a time slot for a specific date
  const toggleTimeSlot = (date, slotId) => {
    // Check if the slot is already registered
    if (isSlotRegistered(date, slotId)) {
      const status = getSlotRegistrationStatus(date, slotId);
      setConfirmModalData({
        title: "Thông báo",
        message: `Bạn đã đăng ký ca làm việc này (Trạng thái: ${status})`,
      });
      setConfirmModalVisible(true);
      return;
    }

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

  // Calculate total hours from selected slots
  const getTotalHours = useCallback(() => {
    let total = 0;

    Object.entries(selectedSlots).forEach(([dateStr, slotIds]) => {
      slotIds.forEach((slotId) => {
        // Find the slot in allAvailableSlots instead of availableSlots
        const slot = allAvailableSlots.find((s) => s.id === slotId);
        if (slot) {
          const start = new Date(`2000-01-01T${slot.shiftStart}`);
          const end = new Date(`2000-01-01T${slot.shiftEnd}`);
          const hours = (end - start) / (1000 * 60 * 60);
          total += hours;
        }
      });
    });

    return total.toFixed(1);
  }, [selectedSlots, allAvailableSlots]);

  // Register for selected slots
  const registerSlots = async () => {
    if (!staffId) {
      setConfirmModalData({
        title: "Lỗi",
        message: "Không tìm thấy ID nhân viên",
      });
      setConfirmModalVisible(true);
      return;
    }

    const registrations = [];

    Object.entries(selectedSlots).forEach(([dateStr, slotIds]) => {
      const date = new Date(dateStr);
      const formattedDate = formatDateForAPI(date);

      slotIds.forEach((slotId) => {
        registrations.push({
          workingDate: formattedDate,
          staffId: staffId,
          workingSlotId: slotId,
        });
      });
    });

    try {
      setLoading(true);

      // Register each selected slot
      for (const registration of registrations) {
        const response = await fetch(
          "https://vietsac.id.vn/api/working-slot-registers",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(registration),
          }
        );

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error.message || "Đăng ký không thành công");
        }
      }

      setConfirmModalData({
        title: "Thành công",
        message: "Đăng ký lịch làm việc thành công!",
      });
      setConfirmModalVisible(true);
      setSelectedSlots({});

      fetchRegisteredSlots(staffId);
      filterAvailableSlots();
    } catch (error) {
      setConfirmModalData({
        title: "Lỗi",
        message: error.message || "Không thể đăng ký ca làm việc",
      });
      setConfirmModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Submit the work schedule
  const handleSubmit = () => {
    if (Object.keys(selectedSlots).length === 0) {
      setConfirmModalData({
        title: "Thông báo",
        message: "Vui lòng chọn ít nhất một ca làm việc",
      });
      setConfirmModalVisible(true);
      return;
    }

    // Format the selected slots for display
    const formattedSchedule = Object.entries(selectedSlots)
      .map(([dateStr, slotIds]) => {
        const date = new Date(dateStr);
        const dayName = getDayName(date.getDay());
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;

        const timeSlots = slotIds
          .map((slotId) => {
            // Find the slot in allAvailableSlots instead of availableSlots
            const slot = allAvailableSlots.find((s) => s.id === slotId);
            if (slot) {
              return `${slot.shiftStart.substring(
                0,
                5
              )} - ${slot.shiftEnd.substring(0, 5)}`;
            }
            return "";
          })
          .filter(Boolean)
          .join(", ");

        return `${dayName} (${formattedDate}): ${timeSlots}`;
      })
      .join("\n");

    setConfirmModalData({
      title: "Xác nhận đăng ký",
      message: `Lịch làm việc của bạn:\n\n${formattedSchedule}\n\nTổng số giờ: ${getTotalHours()} giờ`,
    });
    setConfirmModalVisible(true);
  };

  const { height } = Dimensions.get("window");
  const headerHeight = height * 0.1;

  // Handle confirmation modal actions
  const handleConfirmModalConfirm = () => {
    if (confirmModalData.title === "Xác nhận đăng ký") {
      registerSlots();
    } else if (
      confirmModalData.title === "Thông báo" &&
      staffStatus === "fulltime"
    ) {
      navigation.goBack();
    }
    setConfirmModalVisible(false);
  };

  const handleConfirmModalCancel = () => {
    setConfirmModalVisible(false);
  };

  // Update the setSelectedDate function to ensure it creates a new Date object
  const handleDateSelection = (date) => {
    // Create a new Date object to ensure state update is triggered
    setSelectedDate(new Date(date.getTime()));
  };

  // Only render the component if staff is not fullTime
  if (staffStatus === "fulltime") {
    return (
      <LinearGradient
        colors={["#ff7e5f", "#feb47b"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView className="flex-1 justify-center items-center">
          <ConfirmationModal
            visible={confirmModalVisible}
            title={confirmModalData.title}
            message={confirmModalData.message}
            onConfirm={handleConfirmModalConfirm}
          />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Original return statement for non-fullTime staff
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

            {/* Registration Info */}
            <View className="px-6 mt-2 mb-2">
              <View className="bg-white/20 rounded-xl p-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Info size={18} color="white" />
                    <Text className="text-white ml-2 font-medium">
                      Thông tin đăng ký
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={navigateToRegisteredShifts}
                    className="flex-row items-center bg-white/30 px-3 py-1 rounded-full"
                  >
                    <ClipboardList size={16} color="white" />
                    <Text className="text-white ml-1 font-medium text-sm">
                      Lịch đã đăng ký
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text className="text-white mt-1 opacity-90">
                  Bạn có thể đăng ký lịch làm việc trước{" "}
                  {configs.registrationWeekLimit} tuần
                </Text>
                <Text className="text-white opacity-90">
                  Thời gian đăng ký trước {configs.registrationCutoffDay} ngày
                </Text>
              </View>
            </View>

            {/* Week Calendar Component */}
            <WeekCalendar
              weekDates={weekDates}
              selectedDate={selectedDate}
              setSelectedDate={handleDateSelection}
            />

            {/* Time Slots Component */}
            <TimeSlotSelector
              key={selectedDate.toDateString()}
              selectedDate={selectedDate}
              selectedSlots={selectedSlots}
              toggleTimeSlot={toggleTimeSlot}
              availableSlots={availableSlots}
              registeredSlots={registeredSlots}
              isSlotRegistered={isSlotRegistered}
              getSlotRegistrationStatus={getSlotRegistrationStatus}
              loading={loading}
            />

            {/* Registration Summary Component */}
            <RegistrationSummary
              key="registration-summary"
              selectedSlots={selectedSlots}
              getTotalHours={getTotalHours}
              availableSlots={allAvailableSlots}
            />

            {/* Submit Button Component */}
            <SubmitButton onPress={handleSubmit} disabled={loading} />
          </Animated.ScrollView>

          <BottomBar
            activeTab={activeTab}
            onTabPress={(tabKey) => {
              setActiveTab(tabKey);
            }}
          />

          {/* Confirmation Modal */}
          <ConfirmationModal
            visible={confirmModalVisible}
            title={confirmModalData.title}
            message={confirmModalData.message}
            onConfirm={handleConfirmModalConfirm}
            onCancel={handleConfirmModalCancel}
          />
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
