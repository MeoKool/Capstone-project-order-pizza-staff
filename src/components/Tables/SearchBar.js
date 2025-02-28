import { View, TextInput } from "react-native";
import { Search } from "lucide-react-native";

const SearchBar = ({ value, onChangeText }) => (
  <View className="flex-row items-center bg-white/20 rounded-xl p-2 mb-3">
    <Search size={20} color="white" className="mx-2" />
    <TextInput
      className="flex-1 text-white text-base py-1 px-2"
      placeholder="Tìm kiếm theo tên bàn..."
      placeholderTextColor="rgba(255, 255, 255, 0.7)"
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

export default SearchBar;
