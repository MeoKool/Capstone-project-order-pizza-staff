import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { ChevronLeft } from "lucide-react-native";

const Header = ({ navigation, title, headerHeight, code }) => {
  return (
    <Animated.View style={{ height: headerHeight }} className="px-6 py-4">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4"
        >
          <ChevronLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">{title}</Text>
      </View>
    </Animated.View>
  );
};

export default Header;
