import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { ChevronLeft } from "lucide-react-native";

const API_URL = "http://vietsac.id.vn/pizza-service/api";

export default function PaymentScreen() {
  const [tables, setTables] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchTablesAndZones();
  }, []);

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

  const handleTablePress = async (table) => {
    setSelectedTable(table);
    try {
      const response = await axios.post(
        `${API_URL}/payments/create-payment-link`,
        { tableId: table.id }
      );
      console.log(response);

      setQrCode(response);
    } catch (err) {
      setError("Failed to generate payment link. Please try again.");
    }
  };

  const renderTableItem = ({ item }) => (
    <TouchableOpacity
      className={`bg-white rounded-lg p-4 m-2 flex-row justify-between items-center ${
        selectedTable?.id === item.id ? "border-2 border-[#f26b0f]" : ""
      }`}
      onPress={() => handleTablePress(item)}
    >
      <View>
        <Text className="text-lg font-semibold text-[#5a5757]">
          Table {item.tableNumber}
        </Text>
        <Text className="text-sm text-[#5a5757]">
          Capacity: {item.capacity}
        </Text>
      </View>
      <Text
        className={`text-sm font-semibold ${
          item.status === "Closing"
            ? "text-red-500"
            : item.status === "Opening"
            ? "text-green-500"
            : "text-yellow-500"
        }`}
      >
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  const renderZoneItem = ({ item: zone }) => (
    <View className="mb-4">
      <Text className="text-white text-xl font-semibold mb-2">{zone.name}</Text>
      <FlatList
        data={tables.filter((table) => table.zoneId === zone.id)}
        renderItem={renderTableItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#f26b0f] justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-[#f26b0f] justify-center items-center p-4">
        <Text className="text-white text-lg text-center mb-4">{error}</Text>
        <TouchableOpacity
          className="bg-white rounded-lg py-2 px-4"
          onPress={fetchTablesAndZones}
        >
          <Text className="text-[#f26b0f] font-semibold">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f26b0f]">
      <View className="flex-1 p-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4 p-2 bg-white/20 rounded-full"
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">
            Restaurant Tables
          </Text>
        </View>
        <FlatList
          data={zones}
          renderItem={renderZoneItem}
          keyExtractor={(item) => item.id.toString()}
          className="flex-1"
        />
      </View>
    </SafeAreaView>
  );
}
