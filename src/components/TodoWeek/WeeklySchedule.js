import { View, Text, ScrollView } from "react-native";
import { Calendar, Clock, MapPin, User } from "lucide-react-native";

export default function WeeklySchedule({ weekSchedule }) {
  return (
    <ScrollView className="flex-1 px-6">
      {weekSchedule.map(({ date, schedule }) => (
        <View
          key={date.toISOString()}
          className="bg-white rounded-2xl p-4 mb-4"
        >
          <Text className="text-gray-800 font-bold text-lg mb-2">
            {date.toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>

          {schedule.length > 0 ? (
            schedule.map((shift) => (
              <View
                key={shift.id}
                className="bg-gray-50 rounded-xl p-4 mb-3 border-l-4"
                style={{ borderLeftColor: shift.color }}
              >
                <Text className="text-gray-800 font-bold text-base mb-2">
                  {shift.shift}
                </Text>

                <View className="flex-row items-center mb-2">
                  <Clock size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2">{shift.time}</Text>
                </View>

                <View className="flex-row items-center mb-2">
                  <MapPin size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2">{shift.location}</Text>
                </View>

                <View className="flex-row items-center">
                  <User size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2">{shift.role}</Text>
                </View>
              </View>
            ))
          ) : (
            <View className="bg-gray-50 rounded-xl p-6 items-center justify-center">
              <Calendar size={40} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2 text-center">
                Không có lịch làm việc
              </Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
