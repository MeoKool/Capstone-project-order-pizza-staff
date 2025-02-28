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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Lock, Phone, Eye, EyeOff } from "lucide-react-native";

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log("Login with:", phoneNumber, password);
    navigation.replace("MainTabs");
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
                      <Phone size={24} color="#ff7e5f" />
                    </View>
                    <TextInput
                      className="flex-1 p-4 text-base text-gray-800"
                      placeholder="Số điện thoại của bạn"
                      placeholderTextColor="#999"
                      keyboardType="phone-pad"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
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
                className="bg-white rounded-xl mt-8 p-4 shadow-lg"
                onPress={handleLogin}
                style={{
                  elevation: 5,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                }}
              >
                <Text className="text-[#ff7e5f] text-center font-bold text-lg">
                  ĐĂNG NHẬP
                </Text>
              </TouchableOpacity>

              {/* <View className="flex-row justify-center mt-8">
                <Text className="text-white opacity-80">
                  Chưa có tài khoản?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text className="text-white font-bold">Đăng ký ngay</Text>
                </TouchableOpacity>
              </View> */}
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
