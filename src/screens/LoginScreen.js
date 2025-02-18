import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login with:", phoneNumber, password);
    navigation.replace("MainTabs");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f26b0f]">
      <View className="flex-1 px-6 pt-15">
        <View className="mb-10">
          <Text className="text-white text-4xl font-bold mb-2">Chào mừng</Text>
          <Text className="text-white text-xl">
            Đăng nhập tài khoản của bạn!
          </Text>
        </View>

        <View className="space-y-4">
          <TextInput
            className="bg-white p-4 rounded-lg text-base mb-8"
            placeholder="Số điện thoại của bạn"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <TextInput
            className="bg-white p-4 rounded-lg text-base"
            placeholder="Mật khẩu"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          className="mt-4"
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Text className="text-white text-base">Quên mật khẩu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white rounded-lg mt-6 p-4"
          onPress={handleLogin}
        >
          <Text
            className="text-[#f26b0f] text-center font-bold text-base"
            onPress={() => navigation.navigate("Home")}
          >
            ĐĂNG NHẬP
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
