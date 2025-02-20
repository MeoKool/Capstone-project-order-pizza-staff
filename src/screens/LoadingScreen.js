import { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Animated,
  Easing,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Pizza } from "lucide-react-native";

export default function LoadingScreen() {
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
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
      <SafeAreaView className="flex-1 justify-center items-center">
        <View className="items-center">
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Pizza size={80} color="#ffffff" />
          </Animated.View>
          <Text className="text-white text-2xl font-bold mt-6 mb-2">
            Đang tải...
          </Text>
          <Text className="text-white text-base opacity-80 text-center px-8">
            Chúng tôi đang chuẩn bị trải nghiệm tuyệt vời cho bạn
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
