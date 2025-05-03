"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Lock, User, Eye, EyeOff, Pizza } from "lucide-react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import ErrorModal from "../components/ErrorModal";

const { width } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Error modal states
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalTitle, setErrorModalTitle] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [errorModalIsSuccess, setErrorModalIsSuccess] = useState(false);

  // Create a new Animated.Value for rotation
  const rotateAnim = new Animated.Value(0);

  // Set up the rotation animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Create the rotation interpolation
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Helper function to show error modal
  const showErrorModal = (title, message, isSuccess = false) => {
    setErrorModalTitle(title);
    setErrorModalMessage(message);
    setErrorModalIsSuccess(isSuccess);
    setErrorModalVisible(true);
  };

  const handleLogin = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      showErrorModal("Thông báo", "Vui lòng điền tên đăng nhập và mật khẩu");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://vietsac.id.vn/api/auth/staff/login",
        {
          username: trimmedUsername,
          password: trimmedPassword,
        }
      );

      if (response.data.success) {
        const token = response.data.result.token;
        const expiration = response.data.result.expiration;

        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("tokenExpiration", expiration);

        const decoded = jwtDecode(token);
        const staffId = decoded.StaffId;

        const staffResponse = await axios.get(
          `https://vietsac.id.vn/api/staffs/${staffId}`
        );

        if (staffResponse.data.success) {
          const staff = staffResponse.data.result;

          if (staff.username)
            await AsyncStorage.setItem("staffUsername", staff.username);
          if (staff.fullName)
            await AsyncStorage.setItem("staffFullName", staff.fullName);
          if (staff.phone)
            await AsyncStorage.setItem("staffPhone", staff.phone);
          if (staff.email)
            await AsyncStorage.setItem("staffEmail", staff.email);
          if (staff.staffType)
            await AsyncStorage.setItem("staffType", staff.staffType);
          if (staff.status)
            await AsyncStorage.setItem("staffStatus", staff.status);
          if (staff.id) await AsyncStorage.setItem("staffId", staff.id);

          console.log("Staff info saved:", staff);
        }

        navigation.replace("MainTabs");
      } else {
        showErrorModal("Thông báo", "Login information is incorrect");
      }
    } catch (error) {
      showErrorModal(
        "Thông báo",
        error.response?.data?.error?.message ||
          "Please check your login information and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={["#ff7e5f", "#feb47b"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View className="flex-1 px-8 justify-center">
              {/* Logo or Brand Image with rotation */}
              <View className="items-center mb-8">
                <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-4">
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Pizza size={48} color="#fff" />
                  </Animated.View>
                </View>
              </View>

              <View className="mb-8">
                <Text className="text-white text-4xl font-bold text-center mb-2">
                  Chào mừng
                </Text>
                <Text className="text-white text-lg opacity-90 text-center">
                  Đăng nhập tài khoản của bạn!
                </Text>
              </View>

              <View className="space-y-5">
                <View className="bg-white/20 backdrop-blur-md rounded-2xl p-1.5 shadow-lg">
                  <View className="flex-row items-center bg-white/95 rounded-xl overflow-hidden">
                    <View className="p-4 bg-[#ff7e5f]/10">
                      <User size={22} color="#ff7e5f" />
                    </View>
                    <TextInput
                      className="flex-1 p-4 text-base text-gray-800"
                      placeholder="Tên đăng nhập"
                      placeholderTextColor="#999"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View className="bg-white/20 backdrop-blur-md rounded-2xl p-1.5 shadow-lg">
                  <View className="flex-row items-center bg-white/95 rounded-xl overflow-hidden">
                    <View className="p-4 bg-[#ff7e5f]/10">
                      <Lock size={22} color="#ff7e5f" />
                    </View>
                    <TextInput
                      className="flex-1 p-4 text-base text-gray-800 pr-12"
                      placeholder="Mật khẩu"
                      placeholderTextColor="#999"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity
                      className="absolute right-0 h-full justify-center pr-4"
                      onPress={() => setShowPassword(!showPassword)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      {showPassword ? (
                        <EyeOff size={22} color="#ff7e5f" />
                      ) : (
                        <Eye size={22} color="#ff7e5f" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                className="mt-10 rounded-xl overflow-hidden shadow-xl"
                onPress={handleLogin}
                disabled={loading}
                style={{
                  elevation: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                }}
              >
                <LinearGradient
                  colors={loading ? ["#ccc", "#aaa"] : ["#3a7bd5", "#00d2ff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 16,
                  }}
                >
                  <Text
                    className={`${
                      loading ? "text-gray-600" : "text-white"
                    } text-center font-bold text-lg`}
                  >
                    {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Decorative elements */}
              <View className="absolute top-10 left-5 w-20 h-20 bg-white/10 rounded-full" />
              <View className="absolute bottom-10 right-5 w-32 h-32 bg-white/10 rounded-full" />
              <View className="absolute top-1/4 right-8 w-16 h-16 bg-white/10 rounded-full" />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>

        {/* Error Modal */}
        <ErrorModal
          visible={errorModalVisible}
          title={errorModalTitle}
          message={errorModalMessage}
          buttonText="OK"
          isSuccess={errorModalIsSuccess}
          onClose={() => setErrorModalVisible(false)}
        />
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
