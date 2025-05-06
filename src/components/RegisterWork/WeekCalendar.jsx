import { useRef, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react-native";
import { formatDate, isToday } from "../../utils/getDayName";

const DAYS_OF_WEEK = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const FULL_DAYS = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

const { width } = Dimensions.get("window");
const DAY_ITEM_WIDTH = (width - 48) / 7; // 48 = padding (24 * 2)

const WeekCalendar = ({ selectedDate, setSelectedDate }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [weekOffset, setWeekOffset] = useState(1); // Start with next week (offset 1)

  // Calculate the date of next Monday
  const getNextMonday = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate days until next Monday
    const daysUntilNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;

    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);
    return nextMonday;
  }, []);

  // Generate week dates based on weekOffset
  const weekDates = useMemo(() => {
    const dates = [];
    const startDate = new Date(getNextMonday);

    // Adjust by weekOffset (weeks)
    startDate.setDate(startDate.getDate() + (weekOffset - 1) * 7);

    // Generate 7 days starting from the calculated Monday
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }

    return dates;
  }, [getNextMonday, weekOffset]);

  // Set initial selected date to the first day of the week (Monday)
  useEffect(() => {
    if (weekDates.length > 0 && (!selectedDate || weekOffset === 1)) {
      setSelectedDate(new Date(weekDates[0]));
    }
  }, [weekDates, weekOffset]);

  // Animate calendar on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Check if a date is selected
  const isDateSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    const newDate = new Date(date.getTime());
    setSelectedDate(newDate);
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setWeekOffset(weekOffset - 1);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setWeekOffset(weekOffset + 1);
  };

  // Get week range text (e.g., "15/05 - 21/05")
  const getWeekRangeText = () => {
    if (weekDates.length === 0) return "";
    const firstDay = weekDates[0];
    const lastDay = weekDates[6];
    return `${formatDate(firstDay)} - ${formatDate(lastDay)}`;
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Chọn tuần làm việc</Text>
        <View style={styles.dateDisplay}>
          <Calendar size={16} color="white" />
          <Text style={styles.dateText}>
            {selectedDate ? `${FULL_DAYS[selectedDate.getDay()]}, ${formatDate(selectedDate)}` : ""}
          </Text>
        </View>
      </View>

      <View style={styles.weekNavigator}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={goToPreviousWeek}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color="white" />
        </TouchableOpacity>

        <Text style={styles.weekRangeText}>{getWeekRangeText()}</Text>

        <TouchableOpacity
          style={styles.navButton}
          onPress={goToNextWeek}
          activeOpacity={0.7}
        >
          <ChevronRight size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.daysContainer}>
        {weekDates.map((date, index) => {
          const isSelected = isDateSelected(date);
          const today = isToday(date);

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleDateSelect(date)}
              style={[
                styles.dayItem,
                isSelected && styles.selectedDay,
                today && !isSelected && styles.todayDay,
              ]}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayName,
                isSelected && styles.selectedText,
              ]}>
                {DAYS_OF_WEEK[date.getDay()]}
              </Text>
              <Text style={[
                styles.dayNumber,
                isSelected && styles.selectedText,
              ]}>
                {date.getDate()}
              </Text>
              {today && (
                <View style={[
                  styles.todayDot,
                  isSelected && styles.selectedDot,
                ]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dateText: {
    color: "white",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  weekNavigator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  weekRangeText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayItem: {
    width: DAY_ITEM_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  selectedDay: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  todayDay: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  dayName: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
  },
  dayNumber: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  selectedText: {
    color: "#f97316", // orange-500
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "white",
    marginTop: 4,
  },
  selectedDot: {
    backgroundColor: "#f97316", // orange-500
  },
});

export default WeekCalendar;