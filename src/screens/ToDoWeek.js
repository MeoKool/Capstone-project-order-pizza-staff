"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronLeft,
  Calendar,
  CheckCircle,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const dates = ["20", "21", "22", "23", "24", "25", "26"];

const mockTasks = {
  T2: [
    { time: "08:00 - 12:00", task: "Ca sáng", completed: false },
    { time: "13:00 - 17:00", task: "Ca chiều", completed: false },
  ],
  T3: [
    { time: "08:00 - 12:00", task: "Ca sáng", completed: true },
    { time: "13:00 - 17:00", task: "Ca chiều", completed: true },
  ],
  T4: [{ time: "08:00 - 12:00", task: "Ca sáng", completed: false }],
  T5: [
    { time: "13:00 - 17:00", task: "Ca chiều", completed: false },
    { time: "18:00 - 22:00", task: "Ca tối", completed: false },
  ],
  T6: [
    { time: "08:00 - 12:00", task: "Ca sáng", completed: false },
    { time: "13:00 - 17:00", task: "Ca chiều", completed: false },
  ],
  T7: [],
  CN: [],
};

export default function ToDoWeekScreen() {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState("T2");
  const [currentWeek, setCurrentWeek] = useState("20 - 26 tháng 2, 2024");

  const renderDayButton = (day, index) => {
    const isSelected = selectedDay === day;
    const date = dates[index];
    return (
      <TouchableOpacity
        key={day}
        onPress={() => setSelectedDay(day)}
        className={`items-center justify-center w-14 h-20 rounded-3xl mx-1 ${
          isSelected
            ? "bg-white shadow-lg"
            : "bg-white/20 border border-white/30"
        }`}
        style={{
          shadowColor: "#ff7e5f",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: isSelected ? 8 : 0,
        }}
      >
        <Text
          className={`font-bold text-lg ${
            isSelected ? "text-[#ff7e5f]" : "text-white"
          }`}
        >
          {day}
        </Text>
        <Text
          className={`font-medium text-base mt-1 ${
            isSelected ? "text-[#ff7e5f]" : "text-white/80"
          }`}
        >
          {date}
        </Text>
        {isSelected && (
          <View className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#ff7e5f]" />
        )}
      </TouchableOpacity>
    );
  };

  const renderTask = (task, index) => {
    const isNightShift = task.time.includes("22:00");
    return (
      <View key={index} className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <View
              className={`rounded-full p-2 ${
                isNightShift ? "bg-indigo-100" : "bg-orange-100"
              }`}
            >
              {isNightShift ? (
                <Moon size={20} color="#4F46E5" />
              ) : (
                <Sun size={20} color="#F97316" />
              )}
            </View>
            <Text
              className={`ml-3 text-base font-bold ${
                isNightShift ? "text-indigo-600" : "text-orange-500"
              }`}
            >
              {task.time}
            </Text>
          </View>
          <TouchableOpacity
            className={`rounded-full p-2 ${
              task.completed ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            <CheckCircle
              size={20}
              color={task.completed ? "#10B981" : "#9CA3AF"}
              fill={task.completed ? "#10B981" : "none"}
            />
          </TouchableOpacity>
        </View>
        <Text className="text-lg text-gray-800 font-semibold">{task.task}</Text>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#ff7e5f", "#feb47b"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-white/20 p-3 rounded-full"
          >
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Lịch làm việc</Text>
          <TouchableOpacity className="bg-white/20 p-3 rounded-full">
            <Calendar color="white" size={24} />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-between py-6 px-4">
          <TouchableOpacity className="bg-white/20 p-2 rounded-full">
            <ChevronLeft color="white" size={20} />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">
            Tuần {currentWeek}
          </Text>
          <TouchableOpacity className="bg-white/20 p-2 rounded-full">
            <ChevronRight color="white" size={20} />
          </TouchableOpacity>
        </View>

        <View className="mt-6 mb-8">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            className="px-4"
          >
            {daysOfWeek.map(renderDayButton)}
          </ScrollView>
        </View>

        <View className="flex-1 bg-gray-50 rounded-t-3xl px-4 pt-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            Lịch làm việc - {selectedDay}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {mockTasks[selectedDay] && mockTasks[selectedDay].length > 0 ? (
              mockTasks[selectedDay].map(renderTask)
            ) : (
              <View className="bg-white rounded-2xl p-8 items-center justify-center shadow-lg">
                <Calendar size={64} color="#9CA3AF" />
                <Text className="text-center text-gray-600 text-xl font-bold mt-4">
                  Không có lịch làm việc
                </Text>
                <Text className="text-center text-gray-400 text-base mt-2">
                  Bạn được nghỉ vào ngày này. Hãy tận hưởng!
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
