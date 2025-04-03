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
        `https://vietsac.id.vn/api/reservations/check?PhoneNumber=${phoneNumber}&IncludeProperties=Table.Zone`
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

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return format(date, "dd/MM/yyyy HH:mm");
  };

  const renderReservationItem = ({ item }) => (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-md">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold">{item.customerName}</Text>
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: `${getStatusColor(item.status)}20` }}
        >
          <Text
            style={{ color: getStatusColor(item.status), fontWeight: "600" }}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mb-2">
        <Calendar size={16} color="#6c757d" className="mr-2" />
        <Text className="text-gray-600">
          {formatDateTime(item.bookingTime)}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <Users size={16} color="#6c757d" className="mr-2" />
        <Text className="text-gray-600">{item.numberOfPeople} người</Text>
      </View>

      {item.table && (
        <View className="flex-row items-center mb-3">
          <MapPin size={16} color="#6c757d" className="mr-2" />
          <Text className="text-gray-600">
            Bàn {item.table.code} - Khu vực {item.table.zone?.name || "N/A"}
          </Text>
        </View>
      )}

      {item.status !== "Checkedin" && (
        <TouchableOpacity
          className="bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] py-3 rounded-lg items-center"
          onPress={() => handleCheckIn(item.id)}
          disabled={checkingIn}
        >
          <View className="flex-row items-center justify-center">
            <CheckCircle size={18} color="white" className="mr-2" />
            <Text className="text-white font-bold">Check-in</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

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
