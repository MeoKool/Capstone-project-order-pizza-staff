import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AccountSetupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    phone: "0123456789",
    name: "Trương Sỹ Quảng",
    birthDate: new Date("2002-02-12"),
    department: "Nhân viên phục vụ",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, birthDate: selectedDate }));
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    keyboardType = "default",
    editable = true,
    onPress,
  }) => (
    <View className="mb-6">
      <Text className="text-white text-lg mb-2">{label}</Text>
      <TouchableOpacity activeOpacity={onPress ? 0.7 : 1} onPress={onPress}>
        <View className="bg-white rounded-xl shadow-sm overflow-hidden">
          <TextInput
            className="px-4 py-3.5 text-base text-gray-800"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            editable={editable}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f26b0f]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center px-6 py-4">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 items-center justify-center bg-white/20 rounded-full"
            >
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-semibold ml-4">
              Thiết lập tài khoản
            </Text>
          </View>

          {/* Form */}
          <View className="px-6 mt-6">
            <InputField
              label="Số điện thoại"
              value={formData.phone}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phone: text }))
              }
              keyboardType="phone-pad"
            />

            <InputField
              label="Tên người dùng"
              value={formData.name}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
            />

            <InputField
              label="Ngày sinh"
              value={formatDate(formData.birthDate)}
              editable={false}
              onPress={() => setShowDatePicker(true)}
            />

            <InputField
              label="Bộ phận"
              value={formData.department}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, department: text }))
              }
            />

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-white rounded-xl mt-6 shadow-lg"
            >
              <View className="px-6 py-4">
                <Text className="text-[#f26b0f] text-center text-lg font-semibold">
                  Xác Nhận
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={formData.birthDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
