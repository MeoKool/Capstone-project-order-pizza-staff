"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Shield,
  CheckCircle2,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const buttonScale = useState(new Animated.Value(1))[0];
  const passwordStrength = useState(new Animated.Value(0))[0];

  // Password strength
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    // Animate in the form
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Calculate password strength
    if (newPassword) {
      let score = 0;
      if (newPassword.length > 6) score += 1;
      if (newPassword.length > 10) score += 1;
      if (/[A-Z]/.test(newPassword)) score += 1;
      if (/[0-9]/.test(newPassword)) score += 1;
      if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

      setStrength(score);

      Animated.timing(passwordStrength, {
        toValue: score / 5,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      setStrength(0);
      Animated.timing(passwordStrength, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [newPassword]);

  const getStrengthColor = () => {
    if (strength <= 1) return "#ff4d4d";
    if (strength <= 3) return "#ffaa00";
    return "#00cc44";
  };

  const getStrengthText = () => {
    if (strength <= 1) return "Yếu";
    if (strength <= 3) return "Trung bình";
    return "Mạnh";
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      setLoading(true);

      const staffId = await AsyncStorage.getItem("staffId");
      if (!staffId) {
        throw new Error("User data not found");
      }

      // Use staffId directly without parsing
      const response = await axios.put(
        `https://vietsac.id.vn/api/auth/staff/change-password/${staffId}`,
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        }
      );

      Alert.alert(
        "Thành công",
        "Mật khẩu của bạn đã được thay đổi thành công",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.error("Error changing password:", err);
      const errorMessage =
        err.response?.data?.error.message ||
        "Có lỗi xảy ra khi thay đổi mật khẩu";
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const screenWidth = Dimensions.get("window").width;

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
          <View className="flex-1 px-6">
            {/* Header */}
            <View className="flex-row items-center mt-4 mb-6">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="p-2 -ml-2"
              >
                <ChevronLeft size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-white text-xl font-medium ml-2">
                Đổi mật khẩu
              </Text>
            </View>

            {/* Title and Icon */}
            <View className="items-center mb-8">
              <View className="bg-white/20 rounded-full p-4 mb-4">
                <Shield size={40} color="white" />
              </View>
              <Text className="text-white text-3xl font-bold text-center">
                Đổi mật khẩu
              </Text>
              <Text className="text-white/80 text-center mt-2 max-w-xs">
                Tạo mật khẩu mạnh để bảo vệ tài khoản của bạn
              </Text>
            </View>

            {/* Form */}
            <Animated.View
              className="space-y-6"
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              {/* Current Password */}
              <View>
                <Text className="text-white mb-2 font-medium ml-1">
                  Mật khẩu hiện tại
                </Text>
                <View className="flex-row items-center bg-white rounded-xl overflow-hidden shadow-md">
                  <View className="pl-4">
                    <Lock size={20} color="#ff7e5f" />
                  </View>
                  <TextInput
                    className="flex-1 p-4 text-gray-800"
                    placeholder="Nhập mật khẩu hiện tại"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showCurrentPassword}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                  />
                  <TouchableOpacity
                    className="px-4"
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} color="#9ca3af" />
                    ) : (
                      <Eye size={20} color="#9ca3af" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.currentPassword ? (
                  <Text className="text-white mt-1 ml-1">
                    {errors.currentPassword}
                  </Text>
                ) : null}
              </View>

              {/* New Password */}
              <View>
                <Text className="text-white mb-2 font-medium ml-1">
                  Mật khẩu mới
                </Text>
                <View className="flex-row items-center bg-white rounded-xl overflow-hidden shadow-md">
                  <View className="pl-4">
                    <Lock size={20} color="#ff7e5f" />
                  </View>
                  <TextInput
                    className="flex-1 p-4 text-gray-800"
                    placeholder="Nhập mật khẩu mới"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity
                    className="px-4"
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff size={20} color="#9ca3af" />
                    ) : (
                      <Eye size={20} color="#9ca3af" />
                    )}
                  </TouchableOpacity>
                </View>

                {/* Password strength meter */}
                {newPassword ? (
                  <View className="mt-2">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-white text-xs ml-1">
                        Độ mạnh mật khẩu:
                      </Text>
                      <Text
                        className="text-white text-xs font-medium"
                        style={{ color: getStrengthColor() }}
                      >
                        {getStrengthText()}
                      </Text>
                    </View>
                    <View className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <Animated.View
                        className="h-full rounded-full"
                        style={{
                          width: passwordStrength.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0%", "100%"],
                          }),
                          backgroundColor: getStrengthColor(),
                        }}
                      />
                    </View>

                    <View className="flex-row flex-wrap mt-2">
                      <View className="flex-row items-center mr-4 mb-1">
                        <View
                          className="h-2 w-2 rounded-full mr-1"
                          style={{
                            backgroundColor:
                              newPassword.length > 6 ? "#00cc44" : "white",
                          }}
                        />
                        <Text className="text-white text-xs">
                          Ít nhất 6 ký tự
                        </Text>
                      </View>
                      <View className="flex-row items-center mr-4 mb-1">
                        <View
                          className="h-2 w-2 rounded-full mr-1"
                          style={{
                            backgroundColor: /[A-Z]/.test(newPassword)
                              ? "#00cc44"
                              : "white",
                          }}
                        />
                        <Text className="text-white text-xs">Chữ hoa</Text>
                      </View>
                      <View className="flex-row items-center mr-4 mb-1">
                        <View
                          className="h-2 w-2 rounded-full mr-1"
                          style={{
                            backgroundColor: /[0-9]/.test(newPassword)
                              ? "#00cc44"
                              : "white",
                          }}
                        />
                        <Text className="text-white text-xs">Số</Text>
                      </View>
                      <View className="flex-row items-center mb-1">
                        <View
                          className="h-2 w-2 rounded-full mr-1"
                          style={{
                            backgroundColor: /[^A-Za-z0-9]/.test(newPassword)
                              ? "#00cc44"
                              : "white",
                          }}
                        />
                        <Text className="text-white text-xs">
                          Ký tự đặc biệt
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : errors.newPassword ? (
                  <Text className="text-white mt-1 ml-1">
                    {errors.newPassword}
                  </Text>
                ) : null}
              </View>

              {/* Confirm Password */}
              <View>
                <Text className="text-white mb-2 font-medium ml-1">
                  Xác nhận mật khẩu mới
                </Text>
                <View className="flex-row items-center bg-white rounded-xl overflow-hidden shadow-md">
                  <View className="pl-4">
                    <Lock size={20} color="#ff7e5f" />
                  </View>
                  <TextInput
                    className="flex-1 p-4 text-gray-800"
                    placeholder="Xác nhận mật khẩu mới"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity
                    className="px-4"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#9ca3af" />
                    ) : (
                      <Eye size={20} color="#9ca3af" />
                    )}
                  </TouchableOpacity>
                </View>
                {confirmPassword && newPassword === confirmPassword ? (
                  <View className="flex-row items-center mt-1 ml-1">
                    <CheckCircle2 size={14} />
                    <Text className=" ml-1 text-xs">Mật khẩu khớp</Text>
                  </View>
                ) : errors.confirmPassword ? (
                  <Text className="text-white mt-1 ml-1">
                    {errors.confirmPassword}
                  </Text>
                ) : null}
              </View>
            </Animated.View>

            {/* Submit Button */}
            <Animated.View
              style={{
                transform: [{ scale: buttonScale }],
                opacity: fadeAnim,
                marginTop: 32,
              }}
            >
              <TouchableOpacity
                className="bg-white rounded-xl p-4 shadow-lg"
                style={{
                  elevation: 8,
                  shadowColor: "#ff7e5f",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                }}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.9}
              >
                {loading ? (
                  <ActivityIndicator color="#ff7e5f" size="small" />
                ) : (
                  <Text
                    className="text-center font-bold text-base"
                    style={{ color: "#ff7e5f" }}
                  >
                    Xác Nhận
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
