import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Calendar, Clock, Check, Plus } from "lucide-react-native";

const DAYS_OF_WEEK = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

const TimeSlotSelector = ({
  selectedDate,
  selectedSlots,
  toggleTimeSlot,
  availableSlots,
  loading,
}) => {
  // Check if a time slot is selected for a specific date
  const isSlotSelected = (date, slotId) => {
    const dateStr = date.toDateString();
    return selectedSlots[dateStr] && selectedSlots[dateStr].includes(slotId);
  };

  // Format time from 24-hour format to 12-hour format
  const formatTime = (time) => {
    if (!time) return "";
    return time.substring(0, 5); // Just take HH:MM part
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
        {loading ? (
          <View className="p-8 items-center">
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text className="mt-2 text-gray-500">Đang tải ca làm việc...</Text>
          </View>
        ) : availableSlots.length === 0 ? (
          <View className="p-8 items-center">
            <Text className="text-gray-500">
              Không có ca làm việc cho ngày này
            </Text>
          </View>
        ) : (
          availableSlots.map((slot, index) => {
            const isSelected = isSlotSelected(selectedDate, slot.id);
            return (
              <TouchableOpacity
                key={slot.id}
                className={`flex-row items-center p-4 ${
                  index !== availableSlots.length - 1
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
                    {formatTime(slot.shiftStart)} - {formatTime(slot.shiftEnd)}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {slot.shiftName}
                  </Text>
                  <Text className="text-gray-400 text-xs">
                    Cần {slot.capacity} nhân viên
                  </Text>
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
          })
        )}
      </View>
    </View>
  );
};

export default TimeSlotSelector;
