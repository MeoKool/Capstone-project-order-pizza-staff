import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import LoadingScreen from "./LoadingScreen";
import Header from "../components/Header";
import SearchBar from "../components/Tables/SearchBar";
import StatusFilter from "../components/Tables/StatusFilter";
import ZoneItem from "../components/Tables/ZoneItem";

const API_URL = "http://vietsac.id.vn/pizza-service/api";

export default function TablesScreen() {
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
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

    if (searchQuery) {
      filtered = filtered.filter((table) =>
        table.code.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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
            <Text className="text-[#f26b0f] font-bold">Thử lại</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          onBack={() => navigation.goBack()}
          navigation={navigation}
          title="Bàn Nhà Hàng"
        />

        <View className="px-4 mb-4">
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <StatusFilter
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            statusOptions={statusOptions}
          />
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {zones.map((zone, index) => (
            <ZoneItem
              key={zone.id}
              zone={zone}
              tables={filteredTables}
              onTablePress={handleTablePress}
              getStatusColor={getStatusColor}
            />
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
