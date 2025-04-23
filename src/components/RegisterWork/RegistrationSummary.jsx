"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Info,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { getDayName, formatDate, formatTime } from "../../utils/getDayName";

const RegistrationSummary = ({
  selectedSlots,
  getTotalHours,
  availableSlots,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(20));
  const [showDetails, setShowDetails] = useState(false);

  // Animate when component mounts
  useEffect(() => {
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
  }, []);

  // Animate when slots change
  useEffect(() => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(20);

    // Start animations
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
  }, [Object.keys(selectedSlots).length]);

  const totalSlots = Object.values(selectedSlots).reduce(
    (acc, slots) => acc + slots.length,
    0
  );

  // Get shift details by ID
  const getShiftDetails = (slotId) => {
    const slot = availableSlots.find((s) => s.id === slotId);
    if (!slot) return { name: "Ca không xác định", start: "", end: "" };
    return {
      name: slot.shiftName,
      start: formatTime(slot.shiftStart),
      end: formatTime(slot.shiftEnd),
    };
  };

  // Toggle showing details
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Log for debugging
  useEffect(() => {}, [selectedSlots, totalSlots]);

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

        <View className="flex-row justify-between items-center mb-3 bg-gray-50 p-3 rounded-xl">
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

        {totalSlots > 0 && (
          <View className="mt-2">
            <TouchableOpacity
              className="flex-row items-center justify-between bg-gray-50 p-3 rounded-xl"
              onPress={toggleDetails}
            >
              <Text className="font-semibold text-gray-700">
                Chi tiết ca đăng ký
              </Text>
              {showDetails ? (
                <ChevronUp size={18} color="#6B7280" />
              ) : (
                <ChevronDown size={18} color="#6B7280" />
              )}
            </TouchableOpacity>

            {showDetails && (
              <ScrollView
                className="mt-2 max-h-40 bg-gray-50 rounded-xl p-2"
                showsVerticalScrollIndicator={false}
              >
                {Object.entries(selectedSlots).map(([dateStr, slotIds]) => (
                  <View key={dateStr} className="mb-3">
                    <View className="flex-row items-center mb-1">
                      <Calendar size={14} color="#4D96FF" />
                      <Text className="ml-1 font-semibold text-gray-700">
                        {getDayName(new Date(dateStr).getDay())},{" "}
                        {formatDate(new Date(dateStr))}
                      </Text>
                    </View>

                    {slotIds.map((slotId) => {
                      const shift = getShiftDetails(slotId);
                      return (
                        <View
                          key={slotId}
                          className="flex-row items-center ml-5 mb-1"
                        >
                          <Clock size={12} color="#6B7280" />
                          <Text className="ml-1 text-gray-600">
                            {shift.name}: {shift.start} - {shift.end}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default RegistrationSummary;
