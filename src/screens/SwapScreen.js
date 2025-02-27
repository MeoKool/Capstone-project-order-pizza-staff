import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  SectionList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, Plus, Repeat } from "lucide-react-native";
import ShiftSwapRequestList from "../components/SwapSchedule/ShiftSwapRequestList";
import ShiftSwapModal from "../components/SwapSchedule/ShiftSwapModal";

export default function SwapScreen({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const sections = [
    { title: "current", data: [{}] },
    { title: "requests", data: [{}] },
  ];

  const renderSectionHeader = ({ section }) => {
    if (section.title === "requests") {
      return (
        <View className="flex-row items-center mb-4 mt-6">
          <Repeat color="white" size={24} />
          <Text className="text-white text-lg font-semibold ml-2">
            Yêu cầu đổi ca
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderItem = ({ item, section }) => {
    if (section.title === "requests") {
      return <ShiftSwapRequestList />;
    }
    return null;
  };

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
          {/* Header */}
          <View className="px-6 pt-12 pb-4 flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4"
            >
              <ChevronLeft color="white" size={24} />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold flex-1">
              Đổi ca làm
            </Text>
          </View>

          <SectionList
            sections={sections}
            keyExtractor={(item, index) => index.toString()}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 24 }}
            stickySectionHeadersEnabled={false}
          />

          {/* Add New Shift Swap Request Button */}
          <View className="px-6 py-4">
            <TouchableOpacity
              className="border-2 border-white rounded-xl py-4 flex-row items-center justify-center"
              onPress={() => setIsModalVisible(true)}
            >
              <Plus size={20} color="white" />
              <Text className="text-white font-bold ml-2">
                Tạo yêu cầu đổi ca
              </Text>
            </TouchableOpacity>
          </View>

          {/* Shift Swap Modal */}
          <ShiftSwapModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
          />
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
