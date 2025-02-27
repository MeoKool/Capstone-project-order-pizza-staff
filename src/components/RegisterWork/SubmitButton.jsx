import { View, Text, TouchableOpacity } from "react-native";

const SubmitButton = ({ onPress }) => {
  return (
    <View className="px-6 mb-24">
      <TouchableOpacity
        onPress={onPress}
        className="bg-white rounded-xl py-4 items-center justify-center"
        style={{
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }}
      >
        <Text className="text-orange-500 font-bold text-lg">
          Xác nhận đăng ký
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubmitButton;
