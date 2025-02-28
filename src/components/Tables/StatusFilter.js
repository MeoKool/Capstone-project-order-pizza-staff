import { ScrollView, TouchableOpacity, Text } from "react-native";

const StatusFilter = ({ selectedStatus, setSelectedStatus, statusOptions }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    className="mb-2"
  >
    <TouchableOpacity
      className={`mr-2 py-2 px-4 rounded-xl ${
        selectedStatus === null ? "bg-white" : "bg-white/20"
      }`}
      onPress={() => setSelectedStatus(null)}
    >
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
        className={`mr-2 py-2 px-4 rounded-xl ${
          selectedStatus === status ? "bg-white" : "bg-white/20"
        }`}
        onPress={() =>
          setSelectedStatus(status === selectedStatus ? null : status)
        }
      >
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

export default StatusFilter;
