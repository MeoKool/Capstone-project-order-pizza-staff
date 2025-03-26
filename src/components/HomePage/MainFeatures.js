import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Calendar, Clock, RefreshCcw, ChevronRight } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48 - 16) / 2; // Accounting for padding and gap

const mainFeatures = [
  {
    icon: Calendar,
    label: "Lịch làm việc",
    color: "#4D96FF",
    bgColor: "rgba(77, 150, 255, 0.1)",
    gradientColors: ["#4D96FF", "#6AABFF"],
    screen: "ToDoWeek",
  },
  {
    icon: Clock,
    label: "Đăng ký giờ làm việc",
    color: "#FF6B6B",
    bgColor: "rgba(255, 107, 107, 0.1)",
    gradientColors: ["#FF6B6B", "#FF8E8E"],
    screen: "WorkSchedule",
  },
  {
    icon: RefreshCcw,
    label: "Đổi ca làm",
    color: "#6BCB77",
    bgColor: "rgba(107, 203, 119, 0.1)",
    gradientColors: ["#6BCB77", "#8EE599"],
    screen: "SwapSchedule",
  },
  {
    icon: Calendar,
    label: "Lịch làm việc tháng",
    color: "#FF4E50",
    bgColor: "rgba(255, 78, 80, 0.1)",
    gradientColors: ["#FF4E50", "#FC913A"],
    screen: "WorkScheduleMonth",
  },
];

const MainFeatures = ({ navigation }) => (
  <View className="mt-4 ">
    <View className="flex-row justify-between items-center mb-4">
      <Text className="text-white text-xl font-bold">Chức năng chính</Text>
    </View>

    {/* Card Grid Layout */}
    <View className="flex-row flex-wrap justify-between">
      {mainFeatures.map((feature, index) => (
        <TouchableOpacity
          key={index}
          style={{
            width: cardWidth,
            height: 120,
            marginBottom: 16,
            borderRadius: 20,
            overflow: "hidden",
            shadowColor: feature.color,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
          }}
          onPress={() => navigation.navigate(feature.screen)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={feature.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flex: 1,
              padding: 16,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <feature.icon size={22} color="white" />
            </View>

            <View>
              <Text
                className="text-white font-bold text-base"
                numberOfLines={2}
              >
                {feature.label}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-white/80 text-xs mr-1">Xem chi tiết</Text>
                <ChevronRight size={12} color="rgba(255, 255, 255, 0.8)" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default MainFeatures;
