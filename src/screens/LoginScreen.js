import { useState } from "react";
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
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Lock, User, Eye, EyeOff } from "lucide-react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      Alert.alert("Notification", "Please enter your username and password");
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

          console.log("Staff info saved:", staff);
        }

        navigation.replace("MainTabs"); // Thử thay bằng navigation.navigate("MainTabs")
      } else {
        Alert.alert("Notification", "Login information is incorrect");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      Alert.alert(
        "Thông báo",
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
            <View className="flex-1 px-8 pt-12 justify-center">
              <View className="mb-12">
                <Text className="text-white text-5xl font-bold mb-2">
                  Chào mừng
                </Text>
                <Text className="text-white text-xl opacity-80">
                  Đăng nhập tài khoản của bạn!
                </Text>
              </View>

              <View className="space-y-6">
                <View className="bg-white/20 rounded-2xl p-1">
                  <View className="flex-row items-center bg-white rounded-xl">
                    <View className="p-4">
                      <User size={24} color="#ff7e5f" />
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

                <View className="bg-white/20 rounded-2xl p-1">
                  <View className="flex-row items-center bg-white rounded-xl">
                    <View className="p-4">
                      <Lock size={24} color="#ff7e5f" />
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
                    >
                      {showPassword ? (
                        <EyeOff size={24} color="#ff7e5f" />
                      ) : (
                        <Eye size={24} color="#ff7e5f" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                className="mt-4 self-end"
                onPress={() => navigation.navigate("ChangePassword")}
              >
                <Text className="text-white text-base font-medium">
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`${
                  loading ? "bg-gray-300" : "bg-white"
                } rounded-xl mt-8 p-4 shadow-lg`}
                onPress={handleLogin}
                disabled={loading}
                style={{
                  elevation: 5,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                }}
              >
                <Text
                  className={`${
                    loading ? "text-gray-500" : "text-[#ff7e5f]"
                  } text-center font-bold text-lg`}
                >
                  {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
