import { useState } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ClipboardCheck } from "lucide-react-native";
import BottomBar from "../components/BottomBar";
import TodaySchedule from "../components/TodaySchedule";
import HeaderHomePage from "../components/HomePage/HeaderHomePage";
import WorkProgress from "../components/HomePage/WorkProgress";

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Home");
  const scrollY = new Animated.Value(0);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [90, 80],
    extrapolate: "clamp",
  });

  return (
    <>
      <StatusBar
        barStyle="light-content"
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
            <HeaderHomePage headerHeight={headerHeight} />
            <WorkProgress />

            {/* Check-in Button */}
            <View className="px-6">
              <View className="mt-6 mb-6">
                <TodaySchedule />
              </View>

              <TouchableOpacity
                className="bg-white rounded-xl p-4 flex-row items-center"
                style={{
                  elevation: 8,
                  shadowColor: "#4D96FF",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}
                activeOpacity={0.9}
                onPress={() => navigation.navigate("ReservationCheckIn")}
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: "#E8F1FF" }}
                >
                  <ClipboardCheck size={24} color="#4D96FF" />
                </View>
                <View>
                  <Text className="text-gray-800 font-bold text-lg">
                    Check-in Đặt Bàn
                  </Text>
                  <Text className="text-gray-500">
                    Kiểm tra và xác nhận đặt bàn
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View className="px-6 mt-8"></View>
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
