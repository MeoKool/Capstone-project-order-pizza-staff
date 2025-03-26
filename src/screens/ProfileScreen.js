import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  Alert,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Bell,
  ChevronRight,
  Headphones,
  Settings,
  Lock,
  LogOut,
  Edit3,
  User,
  Shield,
  Info,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomBar from "../components/BottomBar";
import MainFeatures from "../components/HomePage/MainFeatures";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [staffInfo, setStaffInfo] = useState({
    username: "",
    fullName: "",
    phone: "",
    email: "",
    staffType: "",
    status: "",
  });

  useEffect(() => {
    const loadStaffInfo = async () => {
      try {
        const username = await AsyncStorage.getItem("staffUsername");
        const fullName = await AsyncStorage.getItem("staffFullName");
        const phone = await AsyncStorage.getItem("staffPhone");
        const email = await AsyncStorage.getItem("staffEmail");
        const staffType = await AsyncStorage.getItem("staffType");
        const status = await AsyncStorage.getItem("staffStatus");

        setStaffInfo({
          username: username || "",
          fullName: fullName || "",
          phone: phone || "",
          email: email || "",
          staffType: staffType || "",
          status: status || "",
        });
      } catch (error) {
        console.error("Error loading staff info:", error);
      }
    };

    loadStaffInfo();
  }, []);

  const handleOptionPress = async (screen) => {
    if (screen === "Logout") {
      try {
        Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
          {
            text: "Hủy",
            style: "cancel",
          },
          {
            text: "Đăng xuất",
            style: "destructive",
            onPress: async () => {
              await AsyncStorage.clear();
              navigation.replace("Login");
            },
          },
        ]);
      } catch (error) {
        console.error("Error during logout:", error);
      }
    } else {
      navigation.navigate(screen);
    }
  };

  const statusColor = staffInfo.status === "active" ? "#4CAF50" : "#FF9800";

  // Animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 120],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0.9],
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
        <SafeAreaView
          style={{
            flex: 1,
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          }}
        >
          {/* Animated Header */}
          <Animated.View
            style={{
              height: headerHeight,
              opacity: headerOpacity,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1,
            }}
          >
            <LinearGradient
              colors={["rgba(255, 126, 95, 0.9)", "rgba(254, 180, 123, 0.8)"]}
              style={{
                flex: 1,
                paddingTop:
                  Platform.OS === "android" ? StatusBar.currentHeight : 20,
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View className="px-6 flex-row justify-between items-center h-full">
                <View>
                  <Text className="text-white text-3xl font-bold">Hồ sơ</Text>
                </View>
                <TouchableOpacity
                  className="w-12 h-12 bg-white/30 rounded-full items-center justify-center"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Bell color="white" size={24} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            <View style={{ height: 120 }} /> {/* Spacer for fixed header */}
            <View className="px-6 pt-6">
              {/* Profile Card */}
              <View
                className="bg-white rounded-3xl p-6 shadow-lg mb-8"
                style={{
                  elevation: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.2,
                  shadowRadius: 15,
                  borderRadius: 24,
                  overflow: "hidden",
                }}
              >
                {/* Decorative elements */}
                <View
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: "rgba(255, 126, 95, 0.1)",
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: -30,
                    left: -30,
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: "rgba(254, 180, 123, 0.1)",
                  }}
                />

                <View className="flex-row items-center mb-6">
                  <View
                    style={{
                      shadowColor: "#ff7e5f",
                      shadowOffset: { width: 0, height: 5 },
                      shadowOpacity: 0.3,
                      shadowRadius: 10,
                      elevation: 8,
                      borderRadius: 50,
                    }}
                  >
                    {staffInfo.fullName ? (
                      <Image
                        source={{
                          uri: "/placeholder.svg?height=100&width=100",
                        }}
                        className="w-24 h-24 rounded-full"
                        style={{
                          borderWidth: 3,
                          borderColor: "#ff7e5f",
                        }}
                      />
                    ) : (
                      <View
                        className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center"
                        style={{
                          borderWidth: 3,
                          borderColor: "#ff7e5f",
                          backgroundColor: "rgba(255, 126, 95, 0.1)",
                        }}
                      >
                        <User size={40} color="#ff7e5f" />
                      </View>
                    )}
                    <View
                      className="absolute bottom-0 right-0 w-7 h-7 rounded-full border-2 border-white items-center justify-center"
                      style={{
                        backgroundColor: statusColor,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                        elevation: 3,
                      }}
                    >
                      <Shield size={12} color="white" />
                    </View>
                  </View>
                  <View className="ml-5 flex-1">
                    <Text className="text-[#333] text-xl font-bold mb-1">
                      {staffInfo.fullName || "Tên nhân viên"}
                    </Text>
                    <View className="flex-row items-center mb-1">
                      <Text className="text-[#666] text-base">
                        ID: {staffInfo.username || "N/A"}
                      </Text>
                      <View className="ml-2 px-3 py-1 bg-gradient-to-r from-[#ff7e5f20] to-[#feb47b20] rounded-full">
                        <Text className="text-xs text-[#ff7e5f] font-medium">
                          {staffInfo.staffType || "Nhân viên"}
                        </Text>
                      </View>
                    </View>
                    {staffInfo.email && (
                      <Text
                        className="text-[#666] text-sm mb-1"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {staffInfo.email}
                      </Text>
                    )}
                    {staffInfo.phone && (
                      <Text className="text-[#666] text-sm">
                        SĐT: {staffInfo.phone}
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  className="rounded-full py-3.5 px-6 self-center w-full flex-row items-center justify-center"
                  onPress={() => navigation.navigate("EditProfile")}
                  style={{
                    elevation: 5,
                    shadowColor: "#ff7e5f",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    backgroundColor: "#ff7e5f",
                    borderWidth: 1,
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Edit3 size={18} color="white" />
                  <Text className="text-white font-bold ml-2 tracking-wide">
                    Chỉnh sửa hồ sơ
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Main Features Section */}
              <MainFeatures navigation={navigation} />

              {/* Enhanced Settings Section */}
              <View className="mt-8 mb-6">
                <Text className="text-white text-xl font-bold mb-4">
                  Cài đặt tài khoản
                </Text>

                <View
                  className="bg-white rounded-3xl shadow-lg overflow-hidden"
                  style={{
                    elevation: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.2,
                    shadowRadius: 15,
                  }}
                >
                  {/* Header with decorative elements */}
                  <View className="px-6 pt-5 pb-2 border-b border-gray-100 relative overflow-hidden">
                    <View
                      style={{
                        position: "absolute",
                        top: -15,
                        right: -15,
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: "rgba(255, 126, 95, 0.05)",
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        bottom: -20,
                        left: -20,
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: "rgba(254, 180, 123, 0.05)",
                      }}
                    />
                    <Text className="text-[#333] font-bold text-lg relative z-10">
                      Cài đặt
                    </Text>
                    <Text className="text-gray-500 text-sm relative z-10">
                      Quản lý tài khoản và thiết lập cá nhân
                    </Text>
                  </View>

                  {/* Settings Groups */}
                  <View className="p-4">
                    {/* Account Group */}
                    <View className="mb-4">
                      <View className="flex-row items-center mb-3 px-2">
                        <View className="w-2 h-2 rounded-full bg-[#ff7e5f] mr-2" />
                        <Text className="text-[#ff7e5f] font-medium text-sm">
                          Tài khoản
                        </Text>
                      </View>

                      <TouchableOpacity
                        className="flex-row items-center bg-white rounded-2xl p-4 mb-2"
                        onPress={() => handleOptionPress("AccountSettings")}
                        activeOpacity={0.7}
                        style={{
                          shadowColor: "#6BCB77",
                          shadowOffset: { width: 0, height: 3 },
                          shadowOpacity: 0.1,
                          shadowRadius: 5,
                          elevation: 2,
                          borderWidth: 1,
                          borderColor: "rgba(107, 203, 119, 0.1)",
                        }}
                      >
                        <View
                          className="w-12 h-12 rounded-full items-center justify-center"
                          style={{
                            backgroundColor: "rgba(107, 203, 119, 0.1)",
                            shadowColor: "#6BCB77",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 3,
                          }}
                        >
                          <Settings size={22} color="#6BCB77" />
                        </View>
                        <View className="ml-4 flex-1">
                          <Text className="text-[#333] font-semibold text-base">
                            Thiết lập tài khoản
                          </Text>
                          <Text className="text-gray-500 text-xs mt-1">
                            Cập nhật thông tin cá nhân
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: "rgba(107, 203, 119, 0.1)",
                            borderRadius: 20,
                            width: 32,
                            height: 32,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ChevronRight size={18} color="#6BCB77" />
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="flex-row items-center bg-white rounded-2xl p-4"
                        onPress={() => handleOptionPress("ChangePassword")}
                        activeOpacity={0.7}
                        style={{
                          shadowColor: "#FF6B6B",
                          shadowOffset: { width: 0, height: 3 },
                          shadowOpacity: 0.1,
                          shadowRadius: 5,
                          elevation: 2,
                          borderWidth: 1,
                          borderColor: "rgba(255, 107, 107, 0.1)",
                        }}
                      >
                        <View
                          className="w-12 h-12 rounded-full items-center justify-center"
                          style={{
                            backgroundColor: "rgba(255, 107, 107, 0.1)",
                            shadowColor: "#FF6B6B",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 3,
                          }}
                        >
                          <Lock size={22} color="#FF6B6B" />
                        </View>
                        <View className="ml-4 flex-1">
                          <Text className="text-[#333] font-semibold text-base">
                            Đổi mật khẩu
                          </Text>
                          <Text className="text-gray-500 text-xs mt-1">
                            Cập nhật mật khẩu đăng nhập
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: "rgba(255, 107, 107, 0.1)",
                            borderRadius: 20,
                            width: 32,
                            height: 32,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ChevronRight size={18} color="#FF6B6B" />
                        </View>
                      </TouchableOpacity>
                    </View>

                    {/* Support Group */}
                    <View className="mb-4">
                      <View className="flex-row items-center mb-3 px-2">
                        <View className="w-2 h-2 rounded-full bg-[#4D96FF] mr-2" />
                        <Text className="text-[#4D96FF] font-medium text-sm">
                          Hỗ trợ
                        </Text>
                      </View>

                      <TouchableOpacity
                        className="flex-row items-center bg-white rounded-2xl p-4"
                        onPress={() => handleOptionPress("SupportCenter")}
                        activeOpacity={0.7}
                        style={{
                          shadowColor: "#4D96FF",
                          shadowOffset: { width: 0, height: 3 },
                          shadowOpacity: 0.1,
                          shadowRadius: 5,
                          elevation: 2,
                          borderWidth: 1,
                          borderColor: "rgba(77, 150, 255, 0.1)",
                        }}
                      >
                        <View
                          className="w-12 h-12 rounded-full items-center justify-center"
                          style={{
                            backgroundColor: "rgba(77, 150, 255, 0.1)",
                            shadowColor: "#4D96FF",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 3,
                          }}
                        >
                          <Headphones size={22} color="#4D96FF" />
                        </View>
                        <View className="ml-4 flex-1">
                          <Text className="text-[#333] font-semibold text-base">
                            Trung tâm hỗ trợ
                          </Text>
                          <Text className="text-gray-500 text-xs mt-1">
                            Liên hệ với đội ngũ hỗ trợ
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: "rgba(77, 150, 255, 0.1)",
                            borderRadius: 20,
                            width: 32,
                            height: 32,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ChevronRight size={18} color="#4D96FF" />
                        </View>
                      </TouchableOpacity>
                    </View>

                    {/* About Group */}
                    <View className="mb-4">
                      <View className="flex-row items-center mb-3 px-2">
                        <View className="w-2 h-2 rounded-full bg-[#feb47b] mr-2" />
                        <Text className="text-[#feb47b] font-medium text-sm">
                          Thông tin
                        </Text>
                      </View>

                      <TouchableOpacity
                        className="flex-row items-center bg-white rounded-2xl p-4"
                        activeOpacity={0.7}
                        style={{
                          shadowColor: "#feb47b",
                          shadowOffset: { width: 0, height: 3 },
                          shadowOpacity: 0.1,
                          shadowRadius: 5,
                          elevation: 2,
                          borderWidth: 1,
                          borderColor: "rgba(254, 180, 123, 0.1)",
                        }}
                      >
                        <View
                          className="w-12 h-12 rounded-full items-center justify-center"
                          style={{
                            backgroundColor: "rgba(254, 180, 123, 0.1)",
                            shadowColor: "#feb47b",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 3,
                          }}
                        >
                          <Info size={22} color="#feb47b" />
                        </View>
                        <View className="ml-4 flex-1">
                          <Text className="text-[#333] font-semibold text-base">
                            Về ứng dụng
                          </Text>
                          <Text className="text-gray-500 text-xs mt-1">
                            Phiên bản 1.0.0
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: "rgba(254, 180, 123, 0.1)",
                            borderRadius: 20,
                            width: 32,
                            height: 32,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ChevronRight size={18} color="#feb47b" />
                        </View>
                      </TouchableOpacity>
                    </View>

                    {/* Logout Button */}
                    <View className="mt-6">
                      <TouchableOpacity
                        className="flex-row items-center justify-center bg-white rounded-2xl p-4"
                        onPress={() => handleOptionPress("Logout")}
                        activeOpacity={0.7}
                        style={{
                          backgroundColor: "rgba(255, 68, 68, 0.05)",
                          borderWidth: 1,
                          borderColor: "rgba(255, 68, 68, 0.2)",
                        }}
                      >
                        <LogOut size={20} color="#FF4444" />
                        <Text className="text-[#FF4444] font-bold text-base ml-2">
                          Đăng xuất
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              {/* App Version */}
              <View className="items-center mt-4 mb-8">
                <Text className="text-white/70 text-sm font-medium">
                  © 2023 Company Name
                </Text>
              </View>
            </View>
          </Animated.ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
