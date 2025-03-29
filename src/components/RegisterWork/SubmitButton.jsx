import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

const SubmitButton = ({ onPress, disabled }) => {
  return (
    <View className="px-6 mb-24">
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={`${
          disabled ? "bg-gray-300" : "bg-white"
        } rounded-xl py-4 items-center justify-center`}
        style={{
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }}
      >
        {disabled ? (
          <ActivityIndicator size="small" color="#FF6B6B" />
        ) : (
          <Text className="text-orange-500 font-bold text-lg">
            Xác nhận đăng ký
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SubmitButton;
