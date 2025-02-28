import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { Bell, Sun, ChevronDown } from "lucide-react-native";

const HeaderHomePage = ({ headerHeight }) => (
  <Animated.View style={{ height: headerHeight }} className="px-6 py-4">
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-white">
          <Image
            source={{ uri: "https://placekitten.com/200/200" }}
            className="w-full h-full"
          />
        </View>
        <View className="ml-4">
          <View className="flex-row items-center">
            <Text className="text-white text-xl font-bold mr-2">
              Trương Sỹ Quảng
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

export default HeaderHomePage;
