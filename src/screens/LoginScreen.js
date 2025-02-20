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
                <Text className="text-white text-4xl font-bold mb-2">
                  Chào mừng
                </Text>
                <Text className="text-white text-xl opacity-80">
                  Đăng nhập tài khoản của bạn!
                </Text>
              </View>

              <View className="space-y-6">
                <View>
                  <View className="absolute z-10 h-full justify-center pl-4">
                    <Phone size={20} color="#ff7e5f" />
                  </View>
                  <TextInput
                    className="bg-white p-4 rounded-xl text-base pl-12 mb-3"
                    placeholder="Số điện thoại của bạn"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    style={{
                      elevation: 3,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                    }}
                  />
                </View>

                <View>
                  <View className="absolute z-10 h-full justify-center pl-4">
                    <Lock size={20} color="#ff7e5f" />
                  </View>
                  <TextInput
                    className="bg-white p-4 rounded-xl text-base pl-12 pr-12"
                    placeholder="Mật khẩu"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    style={{
                      elevation: 3,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                    }}
                  />
                  <TouchableOpacity
                    className="absolute z-10 h-full right-0 justify-center pr-4"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#ff7e5f" />
                    ) : (
                      <Eye size={20} color="#ff7e5f" />
                    )}
                  </TouchableOpacity>
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
                className="bg-white rounded-xl mt-8 p-4"
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
