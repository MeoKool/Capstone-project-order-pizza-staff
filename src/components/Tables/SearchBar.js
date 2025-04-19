import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Search, X } from "lucide-react-native";

const SearchBar = ({ value, onChangeText, onSearch, inputValue }) => {
  return (
    <View className="mb-4">
      <View className="flex-row items-center bg-white/20 backdrop-blur-md rounded-2xl p-3 px-4 border border-white/30 shadow-lg">
        <View className="bg-white/10 rounded-full p-2 mr-3">
          <Search size={20} color="white" />
        </View>
        <TextInput
          className="flex-1 text-white text-base py-1 px-1 font-medium"
          placeholder="Tìm kiếm theo tên bàn..."
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={inputValue}
          onChangeText={onChangeText}
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
        {inputValue ? (
          <TouchableOpacity onPress={() => onChangeText("")} className="mr-2">
            <View className="bg-white/20 rounded-full p-2">
              <X size={16} color="white" />
            </View>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={onSearch}
          className="bg-white rounded-xl px-5 py-2.5 shadow-md"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <Text className="text-[#f26b0f] font-bold text-base">Tìm</Text>
        </TouchableOpacity>
      </View>
      {value && (
        <View className="bg-white/10 rounded-xl px-4 py-2 mt-2">
          <Text className="text-white text-sm italic">
            Đang hiển thị tất cả các bàn phù hợp với tìm kiếm
          </Text>
        </View>
      )}
    </View>
  );
};

export default SearchBar;
