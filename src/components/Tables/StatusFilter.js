import { ScrollView, TouchableOpacity, Text, View } from "react-native";

const StatusFilter = ({ selectedStatus, setSelectedStatus, statusOptions }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case "Opening":
        return {
          icon: "🟢",
          label: "Bàn mở",
          bgColor: "bg-green-500/20",
          textColor: "text-green-400",
        };
      case "Closing":
        return {
          icon: "🔴",
          label: "Bàn đóng",
          bgColor: "bg-red-500/20",
          textColor: "text-red-400",
        };
      case "Reserved":
        return {
          icon: "🔒",
          label: "Bàn đã đặt trước",
          bgColor: "bg-yellow-500/20",
          textColor: "text-yellow-400",
        };
      case "Locked":
        return {
          icon: "🔒",
          label: "Bàn đã khóa",
          bgColor: "bg-gray-500/20",
          textColor: "text-gray-400",
        };
      default:
        return {
          icon: "🔍",
          label: status,
          bgColor: "bg-blue-500/20",
          textColor: "text-blue-400",
        };
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-white text-base font-medium mb-2 ml-1">
        Lọc theo trạng thái:
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        <TouchableOpacity
          className={`mr-3 py-3 px-5 rounded-xl flex-row items-center shadow-sm ${
            selectedStatus === null
              ? "bg-white"
              : "bg-white/15 border border-white/30"
          }`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
          onPress={() => setSelectedStatus(null)}
        >
          <Text className="mr-2 text-lg">🔍</Text>
          <Text
            className={`font-medium text-base ${
              selectedStatus === null ? "text-[#f26b0f]" : "text-white"
            }`}
          >
            Tất cả
          </Text>
        </TouchableOpacity>

        {statusOptions.map((status) => {
          const { icon, label, bgColor, textColor } = getStatusInfo(status);
          return (
            <TouchableOpacity
              key={status}
              className={`mr-3 py-3 px-5 rounded-xl flex-row items-center shadow-sm ${
                selectedStatus === status
                  ? "bg-white"
                  : `bg-white/15 border border-white/30`
              }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
              onPress={() =>
                setSelectedStatus(status === selectedStatus ? null : status)
              }
            >
              <Text className="mr-2 text-lg">{icon}</Text>
              <Text
                className={`font-medium text-base ${
                  selectedStatus === status ? "text-[#f26b0f]" : "text-white"
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default StatusFilter;
