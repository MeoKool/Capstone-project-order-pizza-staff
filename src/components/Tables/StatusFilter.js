import React from "react";
import { ScrollView, TouchableOpacity, Text, View } from "react-native";

const StatusFilter = ({ selectedStatus, setSelectedStatus, statusOptions }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Opening":
        return "🟢";
      case "Closing":
        return "🔴";
      case "Locked":
        return "🔒";
      default:
        return "🔍";
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-4"
      contentContainerStyle={{ paddingHorizontal: 10 }}
    >
      <TouchableOpacity
        className={`mr-3 py-2.5 px-4 rounded-full flex-row items-center ${
          selectedStatus === null
            ? "bg-white"
            : "bg-white/15 border border-white/20"
        }`}
        onPress={() => setSelectedStatus(null)}
      >
        <Text className="mr-2">🔍</Text>
        <Text
          className={`font-medium ${
            selectedStatus === null ? "text-[#f26b0f]" : "text-white"
          }`}
        >
          Tất cả
        </Text>
      </TouchableOpacity>

      {statusOptions.map((status) => (
        <TouchableOpacity
          key={status}
          className={`mr-3 py-2.5 px-4 rounded-full flex-row items-center ${
            selectedStatus === status
              ? "bg-white"
              : "bg-white/15 border border-white/20"
          }`}
          onPress={() =>
            setSelectedStatus(status === selectedStatus ? null : status)
          }
        >
          <Text className="mr-2">{getStatusIcon(status)}</Text>
          <Text
            className={`font-medium ${
              selectedStatus === status ? "text-[#f26b0f]" : "text-white"
            }`}
          >
            {status}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default StatusFilter;
