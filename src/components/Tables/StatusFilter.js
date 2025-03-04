import { ScrollView, TouchableOpacity, Text } from "react-native";

const StatusFilter = ({ selectedStatus, setSelectedStatus, statusOptions }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case "Opening":
        return { icon: "🟢", label: "Bàn mở" };
      case "Closing":
        return { icon: "🔴", label: "Bàn đóng" };
      case "Locked":
        return { icon: "🔒", label: "Bàn khóa" };
      default:
        return { icon: "🔍", label: status };
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

      {statusOptions.map((status) => {
        const { icon, label } = getStatusInfo(status);
        return (
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
            <Text className="mr-2">{icon}</Text>
            <Text
              className={`font-medium ${
                selectedStatus === status ? "text-[#f26b0f]" : "text-white"
              }`}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default StatusFilter;
