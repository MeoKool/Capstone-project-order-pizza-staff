"use client";

import { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Search,
  Calendar,
  Users,
  MapPin,
  CheckCircle,
  ArrowLeft,
  Clock,
} from "lucide-react-native";
import { format } from "date-fns";

export default function ReservationCheckInScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  const checkReservation = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại hợp lệ");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://vietsac.id.vn/api/reservations/check?PhoneNumber=${phoneNumber}&BookingStatus=Confirmed`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();

      // Check if the API call was successful and extract the items array
      if (
        responseData.success &&
        responseData.result &&
        responseData.result.items
      ) {
        // Filter to only show future reservations
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureReservations = responseData.result.items.filter(
          (res) => new Date(res.bookingTime) >= today
        );

        setReservations(futureReservations);

        if (futureReservations.length === 0) {
          Alert.alert(
            "Thông báo",
            "Không tìm thấy đặt bàn nào cho số điện thoại này hoặc đã quá hạn"
          );
        }
      } else {
        // Handle case where API call was successful but no items were returned
        setReservations([]);
        Alert.alert(
          "Thông báo",
          responseData.message || "Không tìm thấy đặt bàn nào"
        );
      }
    } catch (error) {
      console.error("Error checking reservation:", error);
      Alert.alert("Lỗi", "Không thể kiểm tra đặt bàn. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (reservationId) => {
    setCheckingIn(true);
    try {
      const response = await fetch(
        "https://vietsac.id.vn/api/reservations/check-in",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reservationId: reservationId,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        // Extract error message from the response
        const errorMessage =
          responseData.error.message ||
          "Không thể check-in. Vui lòng thử lại sau.";
        throw new Error(errorMessage);
      }

      // Update local state to reflect the check-in
      setReservations((prevReservations) =>
        prevReservations.map((res) =>
          res.id === reservationId ? { ...res, status: "Checkedin" } : res
        )
      );

      Alert.alert("Thành công", "Check-in thành công!");
    } catch (error) {
      console.error("Error checking in:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Không thể check-in. Vui lòng thử lại sau."
      );
    } finally {
      setCheckingIn(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Created":
        return "#FFA500"; // Orange
      case "Reserved":
        return "#4D96FF"; // Blue
      case "Checkedin":
        return "#6BCB77"; // Green
      case "OpeningAttachment":
        return "#9370DB"; // Purple
      default:
        return "#6c757d"; // Gray
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Created":
        return "Đã đặt trước ";
      case "Reserved":
        return "Đã đặt";
      case "Checkedin":
        return "Đã check-in";
      case "OpeningAttachment":
        return "Đang mở";
      default:
        return status;
    }
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return format(date, "dd/MM/yyyy HH:mm");
  };

  const formatDate = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return format(date, "dd/MM/yyyy");
  };

  const formatTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return format(date, "HH:mm");
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const renderReservationItem = ({ item }) => {
    const bookingDate = new Date(item.bookingTime);
    const isToday = new Date().toDateString() === bookingDate.toDateString();

    return (
      <View
        className="bg-white rounded-2xl mb-5 overflow-hidden shadow-lg"
        style={{
          shadowColor: getStatusColor(item.status),
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        {/* Header with customer info and status */}
        <View className="px-5 pt-5 pb-3 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: `${getStatusColor(item.status)}15` }}
            >
              <Text
                className="text-lg font-bold"
                style={{ color: getStatusColor(item.status) }}
              >
                {getInitials(item.customerName)}
              </Text>
            </View>
            <View>
              <Text className="text-lg font-bold text-gray-800">
                {item.customerName}
              </Text>
              <Text className="text-sm text-gray-500">{item.phoneNumber}</Text>
            </View>
          </View>
          <View
            className="px-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${getStatusColor(item.status)}15` }}
          >
            <Text
              style={{
                color: getStatusColor(item.status),
                fontWeight: "600",
                fontSize: 12,
              }}
            >
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-gray-100 mx-5" />

        {/* Booking details */}
        <View className="p-5">
          <View className="flex-row items-center mb-3 bg-gray-50 p-3 rounded-xl">
            <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
              <Calendar size={18} color="#FF7E5F" />
            </View>
            <View>
              <Text className="text-xs text-gray-500 mb-0.5">Ngày đặt bàn</Text>
              <View className="flex-row items-center">
                <Text className="text-base font-semibold text-gray-800 mr-2">
                  {isToday ? "Hôm nay" : formatDate(item.bookingTime)}
                </Text>
                <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded-md">
                  <Clock size={12} color="#6c757d" className="mr-1" />
                  <Text className="text-xs text-gray-600">
                    {formatTime(item.bookingTime)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="flex-row mb-4">
            <View className="flex-1 flex-row items-center bg-gray-50 p-3 rounded-xl mr-2">
              <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-2">
                <Users size={18} color="#4D96FF" />
              </View>
              <View>
                <Text className="text-xs text-gray-500 mb-0.5">Số người</Text>
                <Text className="text-base font-semibold text-gray-800">
                  {item.numberOfPeople}
                </Text>
              </View>
            </View>

            {item.table && (
              <View className="flex-1 flex-row items-center bg-gray-50 p-3 rounded-xl">
                <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-2">
                  <MapPin size={18} color="#9370DB" />
                </View>
                <View>
                  <Text className="text-xs text-gray-500 mb-0.5">Bàn</Text>
                  <Text className="text-base font-semibold text-gray-800">
                    {item.table.code}{" "}
                    {item.table.zone?.name ? `- ${item.table.zone.name}` : ""}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {item.status !== "Checkedin" && (
            <TouchableOpacity
              className="rounded-xl overflow-hidden mt-1"
              onPress={() => handleCheckIn(item.id)}
              disabled={checkingIn}
            >
              <LinearGradient
                colors={["#ff7e5f", "#feb47b"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-5 items-center"
              >
                <View className="flex-row items-center justify-center">
                  <CheckCircle size={22} color="white" className="mr-3" />
                  <Text className="text-white font-bold text-lg">Check-in</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {item.status === "Checkedin" && (
            <View className="bg-green-50 p-3 rounded-xl flex-row items-center justify-center">
              <CheckCircle size={16} color="#6BCB77" className="mr-2" />
              <Text className="text-green-600 font-medium">
                Đã check-in thành công
              </Text>
            </View>
          )}
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
          <View className="px-6 pt-12 pb-4">
            <View className="flex-row items-center mb-4">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4"
              >
                <ArrowLeft color="white" size={20} />
              </TouchableOpacity>
              <Text className="text-white text-2xl font-bold">
                Check-in Đặt Bàn
              </Text>
            </View>
            <Text className="text-white opacity-80 mb-4">
              Nhập số điện thoại để kiểm tra thông tin đặt bàn
            </Text>

            <View className="flex-row items-center bg-white/20 rounded-xl p-2 mb-6">
              <TextInput
                className="flex-1 text-white text-lg py-2 px-3"
                placeholder="Nhập số điện thoại..."
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
              <TouchableOpacity
                className="bg-white rounded-lg p-3"
                onPress={checkReservation}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ff7e5f" />
                ) : (
                  <Search size={24} color="#ff7e5f" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-1 bg-gray-100 rounded-t-3xl px-6 pt-6">
            <Text className="text-gray-800 text-lg font-bold mb-4">
              {reservations.length > 0
                ? "Danh sách đặt bàn"
                : "Nhập số điện thoại để tìm kiếm đặt bàn"}
            </Text>

            <FlatList
              data={reservations}
              renderItem={renderReservationItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                !loading && (
                  <View className="items-center justify-center py-10">
                    <Text className="text-gray-500 text-center">
                      Không có đặt bàn nào được tìm thấy
                    </Text>
                  </View>
                )
              }
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
