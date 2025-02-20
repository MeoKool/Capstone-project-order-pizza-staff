import React from "react";
import { View, TouchableOpacity, Text, Animated } from "react-native";
import { CircleDollarSign, Home, Store, User } from "lucide-react-native";

const BottomBar = ({ state, descriptors, navigation }) => {
  if (!state) return null;

  const tabs = [
    { key: "Home", icon: Home, label: "Home" },
    { key: "Payment", icon: CircleDollarSign, label: "Bàn" },
    { key: "Store", icon: Store, label: "Cửa hàng" },
    { key: "Profile", icon: User, label: "Cá nhân" },
  ];

  return (
    <View className="absolute bottom-4 left-4 right-4">
      <View className="bg-white rounded-2xl shadow-xl flex-row items-center justify-around h-20 px-2">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const tab = tabs.find((t) => t.key === route.name);

          if (!tab) return null;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabButton
              key={route.key}
              item={tab}
              onPress={onPress}
              active={isFocused}
            />
          );
        })}
      </View>
    </View>
  );
};

const TabButton = ({ item, onPress, active }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: active ? 1 : 0,
      useNativeDriver: true,
      friction: 5,
      tension: 40,
    }).start();
  }, [active, animatedValue]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center justify-center px-2"
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${item.label} tab`}
    >
      <Animated.View
        style={{
          transform: [{ translateY }, { scale }],
        }}
        className={`w-14 h-14 rounded-full items-center justify-center ${
          active ? "bg-[#f26b0f]" : "bg-gray-100"
        }`}
      >
        <item.icon
          size={24}
          color={active ? "#ffffff" : "#9CA3AF"}
          strokeWidth={active ? 2.5 : 2}
        />
      </Animated.View>
      <Animated.Text
        style={{
          opacity: animatedValue,
          transform: [{ translateY }],
        }}
        className="text-xs font-medium text-[#f26b0f] mt-1"
      >
        {item.label}
      </Animated.Text>
    </TouchableOpacity>
  );
};

export default BottomBar;
