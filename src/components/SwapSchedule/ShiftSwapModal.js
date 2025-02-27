import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { X, Calendar, Clock } from "lucide-react-native";

export default function ShiftSwapModal({ isVisible, onClose }) {
  const [selectedShift, setSelectedShift] = useState(null);

  // Sample data for available shifts
  const availableShifts = [
    { id: "1", date: "05/03/2024", time: "07:00 - 15:00" },
    { id: "2", date: "05/03/2024", time: "15:00 - 23:00" },
    { id: "3", date: "06/03/2024", time: "07:00 - 15:00" },
    { id: "4", date: "06/03/2024", time: "15:00 - 23:00" },
  ];

  const handleSubmit = () => {
    if (selectedShift) {
      // Here you would typically send the shift swap request to your backend
      console.log("Submitting shift swap request for:", selectedShift);
      onClose();
    } else {
      alert("Vui lòng chọn ca làm muốn đổi");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 h-3/4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Chọn ca làm muốn đổi
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="mb-4">
            {availableShifts.map((shift) => (
              <TouchableOpacity
                key={shift.id}
                className={`border rounded-xl p-4 mb-3 ${
                  selectedShift?.id === shift.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
                onPress={() => setSelectedShift(shift)}
              >
                <View className="flex-row justify-between items-center mb-2">
                  <View className="flex-row items-center">
                    <Calendar size={16} color="#6B7280" />
                    <Text className="text-gray-800 font-medium ml-2">
                      {shift.date}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Clock size={16} color="#6B7280" />
                    <Text className="text-gray-600 ml-2">{shift.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            className="bg-orange-500 rounded-xl py-4 items-center"
            onPress={handleSubmit}
          >
            <Text className="text-white font-bold">Gửi yêu cầu đổi ca</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
