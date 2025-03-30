import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";

export default function Header({ navigation, title }) {
  return (
    <View className="flex-row items-center px-6 py-4">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
      >
        <ArrowLeft color="white" size={24} />
      </TouchableOpacity>
      <Text className="ml-4 text-white text-xl font-bold">{title}</Text>
    </View>
  );
}
