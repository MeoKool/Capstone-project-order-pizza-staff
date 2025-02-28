import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Animated,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import {
  ChevronLeft,
  Table2,
  Users,
  Circle,
  Search,
  ChevronRight,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import LoadingScreen from "./LoadingScreen";

const API_URL = "http://vietsac.id.vn/pizza-service/api";
const { width } = Dimensions.get("window");

export default function PaymentScreen() {
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [currentZoneIndex, setCurrentZoneIndex] = useState(0);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const fetchTablesAndZones = useCallback(async () => {
    try {
      setLoading(true);
      const [tablesResponse, zonesResponse] = await Promise.all([
        axios.get(`${API_URL}/tables`),
        axios.get(`${API_URL}/zones`),
      ]);
      const tablesData = tablesResponse.data.result.items;
      setTables(tablesData);
      setFilteredTables(tablesData);
      setZones(zonesResponse.data.result.items);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTablesAndZones();
    }, [fetchTablesAndZones])
  );

  useEffect(() => {
    filterTables();
  }, [searchQuery, selectedStatus, tables]);

  const filterTables = useCallback(() => {
    let filtered = [...tables];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((table) =>
        table.code.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter((table) => table.status === selectedStatus);
    }

    setFilteredTables(filtered);
  }, [tables, searchQuery, selectedStatus]);

  const handleTablePress = (table) => {
    navigation.navigate("TableDetails", {
      currentOrderId: table.currentOrderId,
      code: table.code,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Opening":
        return "#22c55e";
      case "Closing":
        return "#ef4444";
      default:
        return "#eab308";
    }
  };

  const renderTableItem = ({ item }) => (
    <Animated.View>
      <TouchableOpacity
        className={`bg-white rounded-2xl p-5 m-2 shadow-lg ${
          false ? "border-2 border-[#f26b0f]" : "border border-gray-100"
        }`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
          width: 180,
        }}
        onPress={() => handleTablePress(item)}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center mb-3">
          <View className="bg-[#f26b0f]/10 p-2 rounded-lg mr-3">
            <Table2 size={20} color="#f26b0f" />
          </View>
          <Text className="text-lg font-bold text-gray-800">
            Table {item.code}
          </Text>
        </View>

        <View className="flex-row items-center mb-3">
          <Users size={16} color="#6b7280" className="mr-2" />
          <Text className="text-sm text-gray-600">
            Capacity: {item.capacity}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Circle
            size={8}
            fill={getStatusColor(item.status)}
            color={getStatusColor(item.status)}
            className="mr-2"
          />
          <Text
            className="text-sm font-medium"
            style={{ color: getStatusColor(item.status) }}
          >
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderZoneItem = ({ item: zone, index }) => {
    const zoneTables = filteredTables.filter(
      (table) => table.zoneId === zone.id
    );

    if (zoneTables.length === 0) return null;

    return (
      <View className="mb-6">
        <View className="flex-row items-center mb-3 px-2">
          <View className="w-1.5 h-6 bg-white rounded-full mr-2" />
          <Text className="text-white text-xl font-bold">{zone.name}</Text>
          <Text className="text-white ml-2">({zoneTables.length} tables)</Text>
        </View>
        <FlatList
          data={zoneTables}
          renderItem={renderTableItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 6 }}
          ListEmptyComponent={
            <View className="flex items-center justify-center p-4 mx-2 bg-white/20 rounded-xl">
              <Text className="text-white text-center">No tables found</Text>
            </View>
          }
        />
      </View>
    );
  };

  const navigateZone = (direction) => {
    if (direction === "next" && currentZoneIndex < zones.length - 1) {
      setCurrentZoneIndex(currentZoneIndex + 1);
      scrollViewRef.current?.scrollTo({
        y: (currentZoneIndex + 1) * 200,
        animated: true,
      });
    } else if (direction === "prev" && currentZoneIndex > 0) {
      setCurrentZoneIndex(currentZoneIndex - 1);
      scrollViewRef.current?.scrollTo({
        y: (currentZoneIndex - 1) * 200,
        animated: true,
      });
    }
  };

  const statusOptions = ["Opening", "Closing", "Locked"];

  if (loading) {
    return (
      <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 justify-center items-center">
          <LoadingScreen />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 justify-center items-center p-4">
          <Text className="text-white text-lg text-center mb-4">{error}</Text>
          <TouchableOpacity
            className="bg-white rounded-xl py-3 px-6 shadow-lg"
            onPress={fetchTablesAndZones}
            activeOpacity={0.7}
          >
            <Text className="text-[#f26b0f] font-bold">Try Again</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-row items-center mb-4 px-4 pt-2">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4 p-2.5 bg-white/20 rounded-xl"
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Bàn Nhà Hàng</Text>
        </View>

        {/* Search and Filter Bar */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center bg-white/20 rounded-xl p-2 mb-3">
            <Search size={20} color="white" className="mx-2" />
            <TextInput
              className="flex-1 text-white text-base py-1 px-2"
              placeholder="Tìm kiếm theo tên bàn..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Status Filter */}
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
                All
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
        </View>

        {/* Tables List */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {zones.map((zone, index) => (
            <View key={zone.id}>{renderZoneItem({ item: zone, index })}</View>
          ))}

          {filteredTables.length === 0 && (
            <View className="flex items-center justify-center p-6 mx-4 bg-white/20 rounded-xl">
              <Text className="text-white text-lg text-center">
                Không có bàn nào phù hợp với lựa chọn của bạn
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
