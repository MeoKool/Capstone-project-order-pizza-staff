import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { X, Calendar, Clock, MapPin } from "lucide-react-native";

export default function DayScheduleModal({
  visible,
  onClose,
  selectedDate,
  daySchedule,
  loading,
  formatDateForDisplay,
}) {
  // Get zone type label
  const getZoneTypeLabel = (zoneType) => {
    switch (zoneType) {
      case "DininingArea":
        return "Khu vực ăn uống";
      case "Kitchen":
        return "Nhà bếp";
      case "Bar":
        return "Quầy bar";
      case "Reception":
        return "Lễ tân";
      default:
        return "Khu vực khác";
    }
  };

  // Get color based on zone type
  const getZoneColor = (zoneType) => {
    switch (zoneType) {
      case "DininingArea":
        return "#4F46E5"; // Indigo
      case "Kitchen":
        return "#EF4444"; // Red
      case "Bar":
        return "#F59E0B"; // Amber
      case "Reception":
        return "#10B981"; // Emerald
      default:
        return "#6B7280"; // Gray
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl h-2/3">
          {/* Modal Header */}
          <View className="flex-row justify-between items-center p-6 border-b border-gray-100">
            <View>
              <Text className="text-gray-800 text-xl font-bold">
                Chi tiết lịch làm việc
              </Text>
              <Text className="text-gray-600">
                {selectedDate ? formatDateForDisplay(selectedDate) : ""}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
            >
              <X color="#6B7280" size={20} />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#ff7e5f" />
              <Text className="mt-4 text-gray-500">Đang tải dữ liệu...</Text>
            </View>
          ) : daySchedule.length > 0 ? (
            <ScrollView className="flex-1 p-6">
              {daySchedule.map((item) => (
                <View
                  key={item.id}
                  className="bg-white rounded-xl p-4 mb-4 border-l-4"
                  style={{
                    borderLeftColor: getZoneColor(item.zone?.type),
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Text className="text-gray-800 font-bold text-lg mb-2">
                    {item.workingSlot?.shiftName || "Ca làm việc"}
                  </Text>

                  <View className="flex-row items-center mb-3">
                    <Clock size={18} color="#6B7280" />
                    <Text className="text-gray-700 ml-2">
                      {item.workingSlot?.shiftStart?.substring(0, 5) || ""} -{" "}
                      {item.workingSlot?.shiftEnd?.substring(0, 5) || ""}
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-1">
                    <MapPin size={18} color="#6B7280" />
                    <Text className="text-gray-700 ml-2">
                      {item.zone?.name || "Khu vực chưa xác định"}
                    </Text>
                  </View>

                  <Text className="text-gray-500 text-sm ml-7">
                    {getZoneTypeLabel(item.zone?.type)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View className="flex-1 items-center justify-center p-6">
              <Calendar size={64} color="#d1d5db" />
              <Text className="mt-4 text-gray-500 text-lg text-center">
                Không có lịch làm việc cho ngày này
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
