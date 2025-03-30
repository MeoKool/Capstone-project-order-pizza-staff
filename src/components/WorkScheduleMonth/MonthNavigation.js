import { View, Text, TouchableOpacity } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

export default function MonthNavigation({ currentMonth, onPrevious, onNext }) {
  // Format month and year for display
  const formatMonthYear = (date) => {
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];

    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <View className="flex-row justify-between items-center px-6 py-2">
      <TouchableOpacity
        onPress={onPrevious}
        className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
      >
        <ChevronLeft color="white" size={20} />
      </TouchableOpacity>

      <Text className="text-white text-lg font-semibold">
        {formatMonthYear(currentMonth)}
      </Text>

      <TouchableOpacity
        onPress={onNext}
        className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
      >
        <ChevronRight color="white" size={20} />
      </TouchableOpacity>
    </View>
  );
}
