import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  Bell,
  Briefcase,
  Search,
  Store,
  User,
  Home,
  Settings,
  Lock,
  LogOut,
  HeadphonesIcon,
  Calendar,
  Clock,
  RefreshCcw,
  CircleDollarSign,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomBar from "../components/BottomBar";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("home");

  const workStats = [
    {
      value: "6",
      label: "Số ngày làm việc",
      icon: Calendar,
      color: "#FF6B6B",
      bgColor: "#FFE8E8",
    },
    {
      value: "30",
      label: "Số giờ làm việc",
      icon: Clock,
      color: "#4D96FF",
      bgColor: "#E8F1FF",
    },
    {
      value: "80%",
      label: "Tiến độ",
      icon: RefreshCcw,
      color: "#6BCB77",
      bgColor: "#E8F8EA",
    },
  ];

  const mainFeatures = [
    {
      icon: Calendar,
      label: "Lịch làm việc",
      color: "#4D96FF",
      bgColor: "#E8F1FF",
    },
    {
      icon: Clock,
      label: "Đăng ký giờ làm việc",
      color: "#FF6B6B",
      bgColor: "#FFE8E8",
    },
    {
      icon: RefreshCcw,
      label: "Đổi ca làm",
      color: "#6BCB77",
      bgColor: "#E8F8EA",
    },
  ];

  const settings = [
    {
      icon: CircleDollarSign,
      label: "Thanh toán",
      color: "#4D96FF",
      bgColor: "#E8F1FF",
    },
    {
      icon: Settings,
      label: "Thiết lập tài khoản",
      color: "#FF6B6B",
      bgColor: "#FFE8E8",
    },
    {
      icon: Lock,
      label: "Đổi mật khẩu",
      color: "#6BCB77",
      bgColor: "#E8F8EA",
    },
    {
      icon: LogOut,
      label: "Đăng xuất",
      color: "#FF4444",
      bgColor: "#FFE8E8",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#ff7e5f]">
      <ScrollView className="flex-1">
        <LinearGradient colors={["#ff7e5f", "#feb47b"]} className="flex-1">
          {/* Header */}
          <View className="px-6 py-4">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
                  <Image
                    source={{ uri: "/placeholder.svg?height=48&width=48" }}
                    className="w-full h-full"
                  />
                </View>
                <View className="ml-3">
                  <Text className="text-white text-lg font-bold">
                    Trương Sỹ Quảng
                  </Text>
                  <Text className="text-white/80">Nhân viên</Text>
                </View>
              </View>
              <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                <Bell color="white" size={20} />
              </TouchableOpacity>
            </View>
          </View>
          {/* Work Progress */}
          <View className="px-6 mt-2">
            <Text className="text-white text-lg font-semibold mb-4">
              Tiến độ công việc
            </Text>
            <View className="flex-row justify-between">
              {workStats.map((stat, index) => (
                <View
                  key={index}
                  className="bg-white rounded-2xl p-4 w-[31%] shadow-lg"
                >
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center mb-2`}
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <stat.icon size={20} color={stat.color} />
                  </View>
                  <Text
                    className="text-2xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </Text>
                  <Text className="text-gray-600 text-xs mt-1">
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          {/* Main Features */}
          <View className="px-6 mt-6">
            <Text className="text-white text-lg font-semibold mb-4">
              Chức năng chính
            </Text>
            <View className="bg-white rounded-2xl shadow-lg">
              {mainFeatures.map((feature, index) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center p-4 ${
                    index !== mainFeatures.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center`}
                    style={{ backgroundColor: feature.bgColor }}
                  >
                    <feature.icon size={20} color={feature.color} />
                  </View>
                  <Text className="ml-3 text-gray-800 font-medium">
                    {feature.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Settings */}
          <View className="px-6 mt-6 mb-28">
            <Text className="text-white text-lg font-semibold mb-4">
              Thiết lập
            </Text>
            <View className="bg-white rounded-2xl shadow-lg">
              {settings.map((setting, index) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center p-4 ${
                    index !== settings.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                  onPress={() => {
                    if (setting.label === "Thanh toán") {
                      navigation.navigate("Payment");
                    }
                  }}
                >
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center`}
                    style={{ backgroundColor: setting.bgColor }}
                  >
                    <setting.icon size={20} color={setting.color} />
                  </View>
                  <Text
                    className={`ml-3 font-medium`}
                    style={{
                      color:
                        setting.label === "Đăng xuất" ? "#FF4444" : "#1F2937",
                    }}
                  >
                    {setting.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </LinearGradient>
      </ScrollView>

      <BottomBar
        activeTab={activeTab}
        onTabPress={(tabKey) => {
          setActiveTab(tabKey);
          // Here you can add navigation logic if needed
          // For example: navigation.navigate(tabKey);
        }}
      />
    </SafeAreaView>
  );
}
