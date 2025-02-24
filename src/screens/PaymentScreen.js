import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Animated,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { ChevronLeft, Table2, Users, Circle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import LoadingScreen from "./LoadingScreen";

const API_URL = "http://vietsac.id.vn/pizza-service/api";

export default function PaymentScreen() {
  const [tables, setTables] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const fetchTablesAndZones = async () => {
    try {
      setLoading(true);
      const [tablesResponse, zonesResponse] = await Promise.all([
        axios.get(`${API_URL}/tables`),
        axios.get(`${API_URL}/zones`),
      ]);
      setTables(tablesResponse.data.result.items);
      setZones(zonesResponse.data.result.items);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTablesAndZones();
    }, [])
  );

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

  const renderZoneItem = ({ item: zone }) => (
    <View className="mb-6">
      <View className="flex-row items-center mb-3 px-2">
        <View className="w-1.5 h-6 bg-white rounded-full mr-2" />
        <Text className="text-white text-xl font-bold">{zone.name}</Text>
      </View>
      <FlatList
        data={tables.filter((table) => table.zoneId === zone.id)}
        renderItem={renderTableItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 6 }}
      />
    </View>
  );

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
        <FlatList
          data={zones}
          renderItem={renderZoneItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={
            <View style={{ flex: 1, paddingTop: 2 }}>
              <View className="flex-row items-center mb-6 px-4">
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="mr-4 p-2.5 bg-white/20 rounded-xl"
                  activeOpacity={0.7}
                >
                  <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-2xl font-bold">
                  Bàn Nhà Hàng
                </Text>
              </View>
            </View>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
