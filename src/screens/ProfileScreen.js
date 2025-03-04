import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
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
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen() {
  const navigation = useNavigation();

  const profileOptions = [
    {
      icon: Headphones,
      label: "Trung tâm hỗ trợ",
      screen: "SupportCenter",
      color: "#4D96FF",
      bgColor: "#E8F1FF",
    },
    {
      icon: Settings,
      label: "Thiết lập tài khoản",
      screen: "AccountSettings",
      color: "#6BCB77",
      bgColor: "#E8F8EA",
    },
    {
      icon: Lock,
      label: "Đổi mật khẩu",
      screen: "ChangePassword",
      color: "#FF6B6B",
      bgColor: "#FFE8E8",
    },
    {
      icon: LogOut,
      label: "Đăng xuất",
      screen: "Logout",
      color: "#FF4444",
      bgColor: "#FFE8E8",
    },
  ];

  const handleOptionPress = (screen) => {
    if (screen === "Logout") {
      // Handle logout logic here
      navigation.replace("Login");
    } else {
      navigation.navigate(screen);
    }
  };

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
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView className="flex-1">
            <View className="p-6">
              {/* Header */}
              <View className="flex-row justify-between items-center mb-8">
                <View>
                  <Text className="text-white text-3xl font-bold">Hồ sơ</Text>
                  <Text className="text-white/80 text-lg font-medium mt-1">
                    Trương Sỹ Quảng
                  </Text>
                </View>
                <TouchableOpacity
                  className="w-12 h-12 bg-white/20 rounded-full items-center justify-center"
                  style={{ elevation: 5 }}
                >
                  <Bell color="white" size={24} />
                </TouchableOpacity>
              </View>

              {/* Profile Card */}
              <View
                className="bg-white rounded-3xl p-6 shadow-lg mb-8"
                style={{
                  elevation: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                }}
              >
                <View className="flex-row items-center mb-6">
                  <Image
                    source={{ uri: "/placeholder.svg?height=100&width=100" }}
                    className="w-24 h-24 rounded-full mr-5"
                    style={{ borderWidth: 3, borderColor: "#ff7e5f" }}
                  />
                  <View>
                    <Text className="text-[#333] text-xl font-bold mb-1">
                      Trương Sỹ Quảng
                    </Text>
                    <Text className="text-[#666] text-base">ID: 123456</Text>
                    <Text className="text-[#666] text-base">Nhân viên</Text>
                  </View>
                </View>
                <TouchableOpacity
                  className="bg-[#ff7e5f] rounded-full py-3 px-6 self-start flex-row items-center"
                  onPress={() => navigation.navigate("EditProfile")}
                  style={{ elevation: 3 }}
                >
                  <Edit3 size={18} color="white" />
                  <Text className="text-white font-bold ml-2">
                    Chỉnh sửa hồ sơ
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Profile Options */}
              <View
                className="bg-white rounded-3xl shadow-lg overflow-hidden"
                style={{
                  elevation: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                }}
              >
                {profileOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option.label}
                    className={`flex-row items-center justify-between p-5 ${
                      index < profileOptions.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                    onPress={() => handleOptionPress(option.screen)}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`w-12 h-12 rounded-full items-center justify-center`}
                        style={{ backgroundColor: option.bgColor }}
                      >
                        <option.icon size={24} color={option.color} />
                      </View>
                      <Text
                        className={`ml-4 text-lg font-semibold`}
                        style={{
                          color:
                            option.color === "#FF4444" ? "#FF4444" : "#333",
                        }}
                      >
                        {option.label}
                      </Text>
                    </View>
                    <ChevronRight size={24} color="#999" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
