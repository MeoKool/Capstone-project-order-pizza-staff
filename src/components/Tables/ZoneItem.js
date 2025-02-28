import { View, Text, FlatList } from "react-native";
import TableItem from "./TableItem";

const ZoneItem = ({ zone, tables, onTablePress, getStatusColor }) => {
  const zoneTables = tables.filter((table) => table.zoneId === zone.id);

  if (zoneTables.length === 0) return null;

  return (
    <View className="mb-6">
      <View className="flex-row items-center mb-3 px-2">
        <View className="w-1.5 h-6 bg-white rounded-full mr-2" />
        <Text className="text-white text-xl font-bold">{zone.name}</Text>
        <Text className="text-white ml-2">({zoneTables.length} bàn)</Text>
      </View>
      <FlatList
        data={zoneTables}
        renderItem={({ item }) => (
          <TableItem
            item={item}
            onPress={onTablePress}
            getStatusColor={getStatusColor}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 6 }}
        ListEmptyComponent={
          <View className="flex items-center justify-center p-4 mx-2 bg-white/20 rounded-xl">
            <Text className="text-white text-center">Không tìm thấy bàn!</Text>
          </View>
        }
      />
    </View>
  );
};

export default ZoneItem;
