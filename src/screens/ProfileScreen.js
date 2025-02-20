import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Bell,
  ChevronRight,
  Headphones,
  Settings,
  Lock,
  LogOut,
} from "lucide-react-native";

export default function ProfileScreen() {
  const navigation = useNavigation();

  const profileOptions = [
    { icon: Headphones, label: "Trung tâm hỗ trợ", screen: "SupportCenter" },
    { icon: Settings, label: "Thiết lập tài khoản", screen: "AccountSettings" },
    { icon: Lock, label: "Đổi mật khẩu", screen: "ChangePassword" },
    { icon: LogOut, label: "Đăng xuất", screen: "Logout", color: "#FF4444" },
  ];

  const handleOptionPress = (screen) => {
    if (screen === "Logout") {
      // Handle logout logic here
      navigation.replace("Login");
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f26b0f]">
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-white text-2xl font-bold">
                Trương Sỹ Quảng
              </Text>
              <Text className="text-white opacity-80">Nhân viên</Text>
            </View>
            <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
              <Bell color="white" size={24} />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <View className="flex-row items-center mb-4">
              <Image
                source={{ uri: "/placeholder.svg?height=80&width=80" }}
                className="w-20 h-20 rounded-full mr-4"
              />
              <View>
                <Text className="text-[#5a5757] text-lg font-semibold">
                  Trương Sỹ Quảng
                </Text>
                <Text className="text-[#5a5757] opacity-70">ID: 123456</Text>
              </View>
            </View>
            <TouchableOpacity
              className="bg-[#f26b0f] rounded-lg py-2 px-4 self-start"
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text className="text-white font-semibold">Chỉnh sửa hồ sơ</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Options */}
          <View className="bg-white rounded-2xl shadow-lg">
            {profileOptions.map((option, index) => (
              <TouchableOpacity
                key={option.label}
                className={`flex-row items-center justify-between p-4 ${
                  index < profileOptions.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
                onPress={() => handleOptionPress(option.screen)}
              >
                <View className="flex-row items-center">
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      option.color ? "bg-red-100" : "bg-[#f26b0f]/10"
                    }`}
                  >
                    <option.icon size={20} color={option.color || "#f26b0f"} />
                  </View>
                  <Text
                    className={`ml-3 text-base ${
                      option.color ? "text-red-500" : "text-[#5a5757]"
                    }`}
                  >
                    {option.label}
                  </Text>
                </View>
                <ChevronRight size={20} color="#5a5757" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
