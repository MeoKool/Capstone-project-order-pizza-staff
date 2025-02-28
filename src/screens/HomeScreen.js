import { useState } from "react";
import { View, SafeAreaView, StatusBar, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomBar from "../components/BottomBar";
import TodaySchedule from "../components/TodaySchedule";
import HeaderHomePage from "../components/HomePage/HeaderHomePage";
import WorkProgress from "../components/HomePage/WorkProgress";
import MainFeatures from "../components/HomePage/MainFeatures";

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
            <View className="px-6 mt-8">
              <TodaySchedule />
            </View>
            <MainFeatures navigation={navigation} />
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
