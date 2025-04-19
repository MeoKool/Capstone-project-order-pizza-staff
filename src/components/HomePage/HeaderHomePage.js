import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { Bell, Sun, ChevronDown } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HeaderHomePage = ({ headerHeight }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    const getUserName = async () => {
      try {
        const userName = await AsyncStorage.getItem("staffFullName");
        if (userName !== null) {
          setName(userName);
        }
      } catch (error) {
        console.log("Error retrieving name from AsyncStorage:", error);
      }
    };

    getUserName();
  }, []);

  return (
    <Animated.View style={{ height: headerHeight }} className="px-6 py-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="ml-4">
            <View className="flex-row items-center">
              <Text className="text-white text-xl font-bold mr-2">
                Xin chào, {name || "N/A"}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          className="w-12 h-12 bg-white/30 rounded-full items-center justify-center"
          style={{ elevation: 3 }}
        >
          <Bell color="white" size={24} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default HeaderHomePage;
