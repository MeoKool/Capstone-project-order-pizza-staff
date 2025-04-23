"use client";

import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useRef, useEffect } from "react";
import { CheckCircle } from "lucide-react-native";

const SubmitButton = ({ onPress, disabled }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    if (!disabled) {
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View className="px-6 mb-24">
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          className={`${
            disabled ? "bg-gray-300" : "bg-white"
          } rounded-xl py-4 items-center justify-center`}
        >
          {disabled ? (
            <ActivityIndicator size="small" color="#FF6B6B" />
          ) : (
            <View className="flex-row items-center">
              <CheckCircle size={20} color="#FF6B6B" />
              <Text className="text-orange-500 font-bold text-lg ml-2">
                Xác nhận đăng ký
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SubmitButton;
