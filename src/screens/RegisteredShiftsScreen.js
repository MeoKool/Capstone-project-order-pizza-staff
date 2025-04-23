"use client";

import { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
} from "lucide-react-native";

export default function RegisteredShiftsScreen({ navigation, route }) {
  const {
    staffId,
    registrationWeekLimit = 1,
    registrationCutoffDay = 1,
  } = route.params;

  const [registeredShifts, setRegisteredShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedShifts, setGroupedShifts] = useState({});
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  useEffect(() => {
    // Calculate date range based on config
    calculateDateRange();
    fetchRegisteredShifts();
  }, []);

  // Calculate date range based on config
  const calculateDateRange = () => {
    const today = new Date();

    // Find the next Sunday (day 0)
    const startDate = new Date(today);
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.

    // Calculate days until next Sunday
    // If today is Sunday, we still want to show next Sunday, so we add 7
    const daysUntilNextSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
    startDate.setDate(today.getDate() + daysUntilNextSunday);

    // End date is start date + (weeks * 7 days - 1)
    // Subtract 1 to include exactly the number of weeks specified
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + registrationWeekLimit * 7 - 1);

    setDateRange({ start: startDate, end: endDate });

    console.log(
      `Date range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    );
  };

  // Fetch registered shifts from API
  const fetchRegisteredShifts = async () => {
    if (!staffId) {
      navigation.goBack();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://vietsac.id.vn/api/working-slot-registers?StaffId=${staffId}&IncludeProperties=WorkingSlot`
      );
      const data = await response.json();

      if (data.success) {
        const shifts = data.result.items;

        // Filter shifts based on date range
        const filteredShifts = filterShiftsByDateRange(shifts);
        setRegisteredShifts(filteredShifts);

        // Group shifts by date
        const grouped = groupShiftsByDate(filteredShifts);
        setGroupedShifts(grouped);
      } else {
        console.error("Failed to fetch registered shifts:", data.message);
      }
    } catch (error) {
      console.error("Error fetching registered shifts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter shifts by date range
  const filterShiftsByDateRange = (shifts) => {
    if (!dateRange.start || !dateRange.end) return shifts;

    return shifts.filter((shift) => {
      const shiftDate = new Date(shift.workingDate);
      return shiftDate >= dateRange.start && shiftDate <= dateRange.end;
    });
  };

  // Group shifts by date
  const groupShiftsByDate = (shifts) => {
    const grouped = {};

    shifts.forEach((shift) => {
      const date = shift.workingDate;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(shift);
    });

    return grouped;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const dayOfWeek = getDayName(date.getDay());

    return `${dayOfWeek}, ${day}/${month}/${year}`;
  };

  // Get Vietnamese day name
  const getDayName = (dayIndex) => {
    const days = [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ];
    return days[dayIndex];
  };

  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange.start || !dateRange.end) return "";

    const formatDateShort = (date) => {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    return `${formatDateShort(dateRange.start)} - ${formatDateShort(
      dateRange.end
    )}`;
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case "Approved":
        return {
          icon: <CheckCircle size={20} color="#10B981" />,
          color: "text-green-600",
          text: "Đã duyệt",
        };
      case "Pending":
        return {
          icon: <AlertCircle size={20} color="#F59E0B" />,
          color: "text-yellow-600",
          text: "Chờ duyệt",
        };
      case "Rejected":
        return {
          icon: <XCircle size={20} color="#EF4444" />,
          color: "text-red-600",
          text: "Từ chối",
        };
      default:
        return {
          icon: <AlertCircle size={20} color="#6B7280" />,
          color: "text-gray-600",
          text: status,
        };
    }
  };

  // Render a date section
  const renderDateSection = ({ item }) => {
    const date = item;
    const shifts = groupedShifts[date];

    return (
      <View className="mb-6">
        <View className="flex-row items-center mb-2">
          <Calendar size={20} color="#FF6B6B" />
          <Text className="ml-2 text-gray-800 font-bold text-lg">
            {formatDate(date)}
          </Text>
        </View>

        <View
          className="bg-white rounded-xl overflow-hidden"
          style={{
            elevation: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          {shifts.map((shift, index) => {
            const statusInfo = getStatusInfo(shift.status);

            return (
              <View
                key={shift.id}
                className={`p-4 ${
                  index !== shifts.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <View className="flex-row items-center justify-between mb-1">
                  <View className="flex-row items-center">
                    <Clock size={18} color="#6B7280" />
                    <Text className="ml-2 font-semibold text-gray-800">
                      {shift.workingSlot?.shiftName || "Ca làm việc"}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    {statusInfo.icon}
                    <Text className={`ml-1 ${statusInfo.color}`}>
                      {statusInfo.text}
                    </Text>
                  </View>
                </View>

                <View className="ml-6">
                  {shift.workingSlot ? (
                    <Text className="text-gray-600">
                      {shift.workingSlot.shiftStart?.substring(0, 5)} -{" "}
                      {shift.workingSlot.shiftEnd?.substring(0, 5)}
                    </Text>
                  ) : (
                    <Text className="text-gray-500 italic">
                      Thông tin ca làm việc không có sẵn
                    </Text>
                  )}
                </View>
                <Text className="text-gray-500 text-sm mt-1">
                  Đăng ký:{" "}
                  {new Date(shift.registerDate).toLocaleString("vi-VN")}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
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
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center px-4 pt-12 pb-4">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            >
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
            <Text className="ml-4 text-white text-xl font-bold">
              Lịch làm việc đã đăng ký
            </Text>
          </View>

          {/* Date Range Info */}
          <View className="mx-4 mb-4 bg-white/20 rounded-xl p-3">
            <View className="flex-row items-center">
              <Info size={18} color="white" />
              <Text className="text-white ml-2 font-medium">
                Khoảng thời gian
              </Text>
            </View>
            <Text className="text-white mt-1 opacity-90">
              Hiển thị lịch làm việc từ Chủ nhật tới ({registrationWeekLimit}{" "}
              tuần)
            </Text>
            <Text className="text-white opacity-90">{formatDateRange()}</Text>
          </View>

          {/* Content */}
          <View className="flex-1 bg-gray-50 rounded-t-3xl px-4 pt-6">
            {loading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text className="mt-4 text-gray-500">Đang tải dữ liệu...</Text>
              </View>
            ) : registeredShifts.length === 0 ? (
              <View className="flex-1 items-center justify-center">
                <Calendar size={64} color="#D1D5DB" />
                <Text className="mt-4 text-gray-500 text-lg text-center">
                  Bạn chưa đăng ký ca làm việc nào từ Chủ nhật tới (
                  {registrationWeekLimit} tuần)
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="mt-4 bg-orange-500 px-6 py-3 rounded-xl"
                >
                  <Text className="text-white font-semibold">Đăng ký ngay</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={Object.keys(groupedShifts).sort(
                  (a, b) => new Date(a) - new Date(b)
                )}
                renderItem={renderDateSection}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
