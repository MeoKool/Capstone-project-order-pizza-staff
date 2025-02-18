import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";

export default function ChangePasswordScreen({ navigation }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    console.log("Change password:", {
      oldPassword,
      newPassword,
      confirmPassword,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f26b0f]">
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center mt-4 mb-8">
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

        {/* Title */}
        <Text className="text-white text-3xl font-bold mb-8">Đổi mật khẩu</Text>

        {/* Form */}
        <View className="space-y-4">
          <TextInput
            className="bg-white p-4 rounded-lg text-base mb-8"
            placeholder="Mật khẩu cũ"
            placeholderTextColor="#666"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
          />

          <TextInput
            className="bg-white p-4 rounded-lg text-base mb-8"
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#666"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TextInput
            className="bg-white p-4 rounded-lg text-base"
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="#666"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-white rounded-lg mt-6 p-4"
          onPress={handleSubmit}
        >
          <Text className="text-[#f26b0f] text-center font-bold text-base">
            Xác Nhận
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
