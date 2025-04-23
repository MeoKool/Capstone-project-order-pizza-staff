"use client";

import { View, Text, Animated } from "react-native";
import { Info, Clock, Calendar } from "lucide-react-native";
import { useRef, useEffect } from "react";

const RegistrationSummary = ({ selectedSlots, getTotalHours }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Animate when slots change
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedSlots]);

  const totalSlots = Object.values(selectedSlots).reduce(
    (acc, slots) => acc + slots.length,
    0
  );

  return (
    <View className="px-6 mt-2 mb-8">
      <Animated.View
        className="bg-white rounded-2xl p-5"
        style={{
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View className="flex-row items-center mb-4">
          <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
            <Info size={20} color="#4D96FF" />
          </View>
          <Text className="ml-3 text-gray-800 font-bold text-lg">
            Thông tin đăng ký
          </Text>
        </View>

        <View className="flex-row justify-between items-center mb-3 bg-gray-50 p-3 rounded-xl">
          <View className="flex-row items-center">
            <Calendar size={18} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Số ca đăng ký:</Text>
          </View>
          <View className="bg-orange-100 px-3 py-1 rounded-full">
            <Text className="font-bold text-orange-500">{totalSlots} ca</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-xl">
          <View className="flex-row items-center">
            <Clock size={18} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Tổng số giờ:</Text>
          </View>
          <View className="bg-orange-100 px-3 py-1 rounded-full">
            <Text className="font-bold text-orange-500">
              {getTotalHours()} giờ
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default RegistrationSummary;
