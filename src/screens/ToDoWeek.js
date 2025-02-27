import { useState, useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import WeekCalendar from "../components/TodoWeek/WeekCalendar";
import WeeklySchedule from "../components/TodoWeek/WeeklySchedule";
import { getWeekDates, formatDateKey } from "../utils/dateUtils";
import { SAMPLE_SCHEDULE } from "../data/sampleSchedule";
import Header from "../components/Header";
import WeekNavigation from "../components/TodoWeek/WeekNavigation";

export default function ToDoWeekScreen({ navigation }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    const dates = getWeekDates(currentDate);
    setWeekDates(dates);
  }, [currentDate]);

  useEffect(() => {}, [weekDates]);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const getScheduleForWeek = () => {
    const schedule = weekDates.map((date) => {
      const dateKey = formatDateKey(date);
      return {
        date,
        schedule: SAMPLE_SCHEDULE[dateKey] || [],
      };
    });
    return schedule;
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <LinearGradient
        colors={["#ff7e5f", "#feb47b"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView className="flex-1">
          <Header title="Lịch làm việc" navigation={navigation} />
          <WeekNavigation
            currentDate={currentDate}
            weekDates={weekDates}
            onPrevious={goToPreviousWeek}
            onNext={goToNextWeek}
          />
          <WeekCalendar weekDates={weekDates} />
          <WeeklySchedule weekSchedule={getScheduleForWeek()} />
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
