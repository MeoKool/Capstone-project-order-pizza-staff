import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Search, X } from "lucide-react-native";

const SearchBar = ({ value, onChangeText }) => {
  return (
    <View className="flex-row items-center bg-white/15 backdrop-blur-md rounded-full p-2 px-4 mx-4 mb-4 border border-white/20">
      <Search size={18} color="white" className="mr-2" />
      <TextInput
        className="flex-1 text-white text-base py-1 px-1"
        placeholder="Tìm kiếm theo tên bàn..."
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        value={value}
        onChangeText={onChangeText}
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <View className="bg-white/20 rounded-full p-1">
            <X size={16} color="white" />
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SearchBar;
