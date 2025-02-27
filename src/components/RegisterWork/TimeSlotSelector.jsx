import { View, Text, TouchableOpacity } from "react-native";
import { Calendar, Clock, Check, Plus } from "lucide-react-native";

const DAYS_OF_WEEK = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

const TIME_SLOTS = [
  { id: 1, time: "07:00 - 11:00", period: "Sáng" },
  { id: 2, time: "11:00 - 15:00", period: "Trưa" },
  { id: 3, time: "15:00 - 19:00", period: "Chiều" },
  { id: 4, time: "19:00 - 23:00", period: "Tối" },
];

const TimeSlotSelector = ({ selectedDate, selectedSlots, toggleTimeSlot }) => {
  // Check if a time slot is selected for a specific date
  const isSlotSelected = (date, slotId) => {
    const dateStr = date.toDateString();
    return selectedSlots[dateStr] && selectedSlots[dateStr].includes(slotId);
  };

  return (
    <View className="px-6 mt-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white text-xl font-bold">Chọn ca làm việc</Text>
        <View className="flex-row items-center">
          <Text className="text-white mr-2">
            {DAYS_OF_WEEK[selectedDate.getDay()]}, {selectedDate.getDate()}/
            {selectedDate.getMonth() + 1}
          </Text>
          <Calendar color="white" size={18} />
        </View>
      </View>

      <View
        className="bg-white rounded-2xl overflow-hidden mb-6"
        style={{
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }}
      >
        {TIME_SLOTS.map((slot, index) => {
          const isSelected = isSlotSelected(selectedDate, slot.id);
          return (
            <TouchableOpacity
              key={index}
              className={`flex-row items-center p-4 ${
                index !== TIME_SLOTS.length - 1
                  ? "border-b border-gray-100"
                  : ""
              } ${isSelected ? "bg-orange-50" : ""}`}
              onPress={() => toggleTimeSlot(selectedDate, slot.id)}
            >
              <View
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  isSelected ? "bg-orange-100" : "bg-gray-100"
                }`}
              >
                <Clock size={24} color={isSelected ? "#FF6B6B" : "#9CA3AF"} />
              </View>
              <View className="ml-4 flex-1">
                <Text
                  className={`font-semibold text-base ${
                    isSelected ? "text-orange-500" : "text-gray-800"
                  }`}
                >
                  {slot.time}
                </Text>
                <Text className="text-gray-500 text-sm">Ca {slot.period}</Text>
              </View>
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  isSelected ? "bg-orange-500" : "bg-gray-200"
                }`}
              >
                {isSelected ? (
                  <Check size={18} color="white" />
                ) : (
                  <Plus size={18} color="#9CA3AF" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TimeSlotSelector;
