import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";
import {
  Bell,
  ChevronRight,
  Calendar,
  Clock,
  RefreshCcw,
  CircleDollarSign,
  Settings,
  Lock,
  LogOut,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomBar from "../components/BottomBar";
import TodaySchedule from "../components/TodaySchedule";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("home");
  const scrollY = new Animated.Value(0);

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

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [90, 80],
    extrapolate: "clamp",
  });

  return (
    <>
      <StatusBar
        barStyle="dark-content"
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
          <Animated.ScrollView
            className="flex-1"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            {/* Header */}
            <Animated.View
              style={{ height: headerHeight }}
              className="px-6 py-4"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-white/30">
                    <Image
                      source={{ uri: "/placeholder.svg?height=48&width=48" }}
                      className="w-full h-full"
                    />
                  </View>
                  <View className="ml-3">
                    <Text className="text-white text-lg font-bold">
                      Trương Sỹ Quảng
                    </Text>
                    <Text className="text-white/80 font-medium">Nhân viên</Text>
                  </View>
                </View>
                <TouchableOpacity
                  className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                  style={{ elevation: 3 }}
                >
                  <Bell color="white" size={20} />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Work Progress */}
            <View className="px-6 mt-2">
              <Text className="text-white text-xl font-bold mb-4">
                Tiến độ công việc
              </Text>
              <View className="flex-row justify-between">
                {workStats.map((stat, index) => (
                  <TouchableOpacity
                    key={index}
                    className="bg-white rounded-2xl p-4 w-[31%]"
                    style={{
                      elevation: 8,
                      shadowColor: stat.color,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                    }}
                    activeOpacity={0.9}
                  >
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center mb-3`}
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
                    <Text className="text-gray-600 text-xs mt-1 leading-tight">
                      {stat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Today's Schedule */}
            <View className="px-6 mt-8">
              <Text className="text-white text-xl font-bold mb-4">
                Lịch làm việc hôm nay
              </Text>
              <TodaySchedule />
            </View>

            {/* Main Features */}
            <View className="px-6 mt-8">
              <Text className="text-white text-xl font-bold mb-4">
                Chức năng chính
              </Text>
              <View
                className="bg-white rounded-2xl overflow-hidden"
                style={{
                  elevation: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}
              >
                {mainFeatures.map((feature, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`flex-row items-center p-4 ${
                      index !== mainFeatures.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                    onPress={() => {
                      if (feature.label === "Lịch làm việc") {
                        navigation.navigate("ToDoWeek");
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      className={`w-12 h-12 rounded-full items-center justify-center`}
                      style={{ backgroundColor: feature.bgColor }}
                    >
                      <feature.icon size={24} color={feature.color} />
                    </View>
                    <Text className="ml-4 flex-1 text-gray-800 font-semibold text-base">
                      {feature.label}
                    </Text>
                    <ChevronRight size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.ScrollView>

          <BottomBar
            activeTab={activeTab}
            onTabPress={(tabKey) => {
              setActiveTab(tabKey);
            }}
          />
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
