"use client";

import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { MapPin, Navigation } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TodaySchedule = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoneData, setZoneData] = useState(null);

  useEffect(() => {
    const fetchZoneData = async () => {
      try {
        // Get staffId from AsyncStorage
        const staffId = await AsyncStorage.getItem("staffId");

        if (!staffId) {
          throw new Error("Staff ID not found in storage");
        }

        // Fetch data from API
        const response = await fetch(
          `https://vietsac.id.vn/api/staff-zones?StaffId=${staffId}&IncludeProperties=Zone`
        );

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch zone data");
        }

        setZoneData(data.result.items[0]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching zone data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchZoneData();
  }, []);

  if (loading) {
    return (
      <View
        className="bg-white rounded-2xl p-6 shadow-lg items-center justify-center"
        style={{ height: 150 }}
      >
        <ActivityIndicator size="large" color="#4D96FF" />
        <Text className="text-gray-600 mt-2">Đang tải thông tin...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-white rounded-2xl p-6 shadow-lg">
        <Text className="text-red-500 text-center">
          Không thể tải thông tin: {error}
        </Text>
        <TouchableOpacity
          className="bg-[#4D96FF] py-2 px-4 rounded-lg mt-4 self-center"
          onPress={() => navigation.navigate("ToDoWeek")}
        >
          <Text className="text-white font-semibold">Xem lịch làm việc</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl p-6 shadow-lg">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Navigation size={24} color="#4D96FF" />
          <Text className="text-gray-800 font-bold text-xl ml-2">
            Vị trí hiện tại của bạn
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("ToDoWeek")}>
          <Text className="text-[#4D96FF] font-semibold">Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-blue-50 rounded-xl p-4 mt-2">
        <Text className="text-gray-600 text-base mb-2">Khu vực</Text>
        <View className="flex-row items-center">
          <MapPin size={20} color="#4D96FF" />
          <Text className="text-gray-800 font-semibold text-xl ml-2">
            {zoneData?.zone?.name || "Không có thông tin"}
          </Text>
        </View>
        {zoneData?.zone?.description && (
          <Text className="text-gray-600 mt-2 ml-7">
            {zoneData.zone.description}
          </Text>
        )}
      </View>
    </View>
  );
};

export default TodaySchedule;
