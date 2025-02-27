import { View, Text, TouchableOpacity } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

export default function WeekNavigation({
  currentDate,
  weekDates,
  onPrevious,
  onNext,
}) {
  const getMonthYearHeader = () => {
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

    const firstDate = weekDates[0];
    const lastDate = weekDates[6];

    if (firstDate && lastDate) {
      if (firstDate.getMonth() === lastDate.getMonth()) {
        return `${months[firstDate.getMonth()]} ${firstDate.getFullYear()}`;
      } else {
        return `${months[firstDate.getMonth()]} - ${
          months[lastDate.getMonth()]
        } ${firstDate.getFullYear()}`;
      }
    }

    return "";
  };

  return (
    <View className="px-6 flex-row justify-between items-center mb-4">
      <TouchableOpacity
        onPress={onPrevious}
        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
      >
        <ChevronLeft color="white" size={20} />
      </TouchableOpacity>

      <Text className="text-white text-base font-semibold">
        {getMonthYearHeader()}
      </Text>

      <TouchableOpacity
        onPress={onNext}
        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
      >
        <ChevronRight color="white" size={20} />
      </TouchableOpacity>
    </View>
  );
}
