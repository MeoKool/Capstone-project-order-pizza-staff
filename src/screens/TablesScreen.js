"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Search, X, Star, AlertTriangle } from "lucide-react-native";
import LoadingScreen from "./LoadingScreen";
import Header from "../components/Header";
import SearchBar from "../components/Tables/SearchBar";
import StatusFilter from "../components/Tables/StatusFilter";
import ZoneItem from "../components/Tables/ZoneItem";
import ErrorModal from "../components/ErrorModal";

const API_URL = "http://vietsac.id.vn/api";

export default function TablesScreen() {
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [zones, setZones] = useState([]);
  const [staffZones, setStaffZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [hasNoZones, setHasNoZones] = useState(false);
  const [showNoZonesModal, setShowNoZonesModal] = useState(false);

  // Error modal states
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalTitle, setErrorModalTitle] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [errorModalIsSuccess, setErrorModalIsSuccess] = useState(false);

  // Helper function to show error modal
  const showErrorModal = (title, message, isSuccess = false) => {
    setErrorModalTitle(title);
    setErrorModalMessage(message);
    setErrorModalIsSuccess(isSuccess);
    setErrorModalVisible(true);
  };

  const fetchStaffZones = useCallback(async () => {
    try {
      const staffId = await AsyncStorage.getItem("staffId");
      if (!staffId) {
        throw new Error("Staff ID not found");
      }

      const response = await axios.get(
        `https://vietsac.id.vn/api/staff-zones?StaffId=${staffId}&IncludeProperties=Zone`
      );

      if (!response.data.success) {
        throw new Error("Failed to fetch staff zones");
      }

      const staffZoneData = response.data.result.items.map((item) => item.zone);
      setStaffZones(staffZoneData);

      // Set hasNoZones state based on whether staff has any zones
      setHasNoZones(staffZoneData.length === 0);

      return staffZoneData;
    } catch (err) {
      console.error("Error fetching staff zones:", err);
      setHasNoZones(true);
      return [];
    }
  }, []);

  const fetchTablesAndZones = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch staff zones first
      const staffZoneData = await fetchStaffZones();

      // Then fetch tables and all zones
      const [tablesResponse, zonesResponse] = await Promise.all([
        axios.get(`${API_URL}/tables`),
        axios.get(`${API_URL}/zones?SortBy=name`),
      ]);

      const tablesData = tablesResponse.data.result.items;
      const zonesData = zonesResponse.data.result.items;

      setTables(tablesData);

      // If we're not searching, only show tables in staff zones
      if (!isSearching && staffZoneData.length > 0) {
        const staffZoneIds = staffZoneData.map((zone) => zone.id);
        const staffTables = tablesData.filter((table) =>
          staffZoneIds.includes(table.zoneId)
        );
        setFilteredTables(staffTables);
      } else {
        setFilteredTables(tablesData);
      }

      // Sort zones to show staff zones first
      if (staffZoneData.length > 0) {
        const staffZoneIds = staffZoneData.map((zone) => zone.id);
        const sortedZones = [
          ...zonesData.filter((zone) => staffZoneIds.includes(zone.id)),
          ...zonesData.filter((zone) => !staffZoneIds.includes(zone.id)),
        ];
        setZones(sortedZones);
      } else {
        setZones(zonesData);
      }

      setError(null);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchStaffZones, isSearching]);

  useFocusEffect(
    useCallback(() => {
      fetchTablesAndZones();
    }, [fetchTablesAndZones])
  );

  useEffect(() => {
    filterTables();
  }, [searchQuery, selectedStatus, tables, staffZones]);

  const filterTables = useCallback(() => {
    let filtered = [...tables];

    // If searching or filtering by status, show all tables that match
    if (searchQuery || selectedStatus) {
      setIsSearching(!!searchQuery);

      if (searchQuery) {
        filtered = filtered.filter((table) =>
          table.code
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      }

      if (selectedStatus) {
        filtered = filtered.filter((table) => table.status === selectedStatus);
      }
    }
    // Otherwise only show tables in staff zones
    else if (staffZones.length > 0) {
      setIsSearching(false);
      const staffZoneIds = staffZones.map((zone) => zone.id);
      filtered = filtered.filter((table) =>
        staffZoneIds.includes(table.zoneId)
      );
    }

    setFilteredTables(filtered);
  }, [tables, searchQuery, selectedStatus, staffZones]);

  const handleSearch = () => {
    setSearchQuery(searchInputValue);
    setIsSearching(!!searchInputValue);
  };

  const clearSearch = () => {
    setSearchInputValue("");
    setSearchQuery("");
    setIsSearching(false);
  };

  const openTable = async (tableId) => {
    // Check if staff has no zones and show modal instead
    if (hasNoZones) {
      setShowNoZonesModal(true);
      return;
    }

    try {
      setLoading(true);
      await axios.put(`https://vietsac.id.vn/api/tables/open-table/${tableId}`);
      // Refresh tables after opening
      await fetchTablesAndZones();
      // Use ErrorModal instead of Alert
      showErrorModal("Thành công", "Đã mở bàn thành công", true);
    } catch (err) {
      console.error("Error opening table:", err);
      // Use ErrorModal instead of Alert
      showErrorModal("Lỗi", "Không thể mở bàn. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleTablePress = (table) => {
    // Check if staff has no zones and show modal instead
    if (hasNoZones) {
      setShowNoZonesModal(true);
      return;
    }

    if (table.status === "Closing") {
      // If table status is Closing, call API to open the table
      openTable(table.id);
    } else {
      // Otherwise navigate to table details
      navigation.navigate("TableDetails", {
        currentOrderId: table.currentOrderId,
        code: table.code,
        tableId: table.id,
      });
    }
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

  const statusOptions = ["Opening", "Closing", "Reserved"];

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
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 5,
            }}
          >
            <Text className="text-[#f26b0f] font-bold">Thử lại</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Filter zones to only show those that have tables in filteredTables
  const visibleZoneIds = [
    ...new Set(filteredTables.map((table) => table.zoneId)),
  ];
  const visibleZones = zones.filter((zone) => visibleZoneIds.includes(zone.id));

  return (
    <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          onBack={() => navigation.goBack()}
          navigation={navigation}
          title={isSearching ? "Tất cả bàn" : "Bàn của bạn"}
        />

        {/* No Zones Modal - Only shows when user tries to interact with a table */}
        <Modal
          visible={showNoZonesModal}
          transparent={true}
          animationType="fade"
        >
          <View className="flex-1 bg-black/70 justify-center items-center p-5">
            <View className="bg-white rounded-xl p-6 w-full max-w-md">
              <View className="items-center mb-4">
                <View className="bg-red-100 p-3 rounded-full mb-2">
                  <AlertTriangle size={32} color="#ef4444" />
                </View>
                <Text className="text-xl font-bold text-center">
                  Không có quyền truy cập
                </Text>
              </View>

              <Text className="text-gray-700 text-center mb-6">
                Bạn chưa được phân công khu vực nào. Vui lòng liên hệ quản lý để
                được phân công khu vực.
              </Text>

              <TouchableOpacity
                className="bg-[#ff7e5f] py-3 rounded-lg"
                onPress={() => setShowNoZonesModal(false)}
              >
                <Text className="text-white font-bold text-center">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View className="px-4 mb-2">
          <SearchBar
            value={searchQuery}
            inputValue={searchInputValue}
            onChangeText={setSearchInputValue}
            onSearch={handleSearch}
          />

          {searchQuery && (
            <View className="flex-row items-center justify-between mb-3 bg-white/15 rounded-xl p-3 border border-white/20">
              <View className="flex-row items-center">
                <Search size={16} color="white" className="mr-2" />
                <Text className="text-white text-sm font-medium">
                  Kết quả tìm kiếm: "{searchQuery}"
                </Text>
              </View>
              <TouchableOpacity
                onPress={clearSearch}
                className="bg-white/20 rounded-full p-1.5"
              >
                <X size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}

          <StatusFilter
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            statusOptions={statusOptions}
          />
        </View>

        {staffZones.length === 0 && !isSearching && !selectedStatus && (
          <View className="mx-4 mb-6 p-5 bg-red-500 rounded-xl border border-white/30">
            <Text className="text-white text-center font-medium">
              Bạn chưa được phân công khu vực nào!
            </Text>
          </View>
        )}

        {staffZones.length > 0 && !isSearching && !selectedStatus && (
          <View className="mx-4 mb-6">
            <View className="flex-row items-center mb-2">
              <Star size={16} color="#FFD700" fill="#FFD700" className="mr-2" />
              <Text className="text-white font-bold text-lg">
                Khu vực của bạn
              </Text>
            </View>
            <View className="bg-white/10 rounded-xl p-3 border border-white/20">
              <Text className="text-white">
                Bạn được phân công {staffZones.length} khu vực với tổng cộng{" "}
                {filteredTables.length} bàn.
              </Text>
            </View>
          </View>
        )}

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {visibleZones.map((zone) => (
            <ZoneItem
              key={zone.id}
              zone={zone}
              tables={filteredTables}
              onTablePress={handleTablePress}
              getStatusColor={getStatusColor}
              refreshTables={fetchTablesAndZones}
              isStaffZone={staffZones.some(
                (staffZone) => staffZone.id === zone.id
              )}
            />
          ))}

          {filteredTables.length === 0 && (
            <View className="flex items-center justify-center p-6 mx-4 bg-white/20 rounded-xl border border-white/30">
              <Text className="text-white text-lg text-center font-medium">
                Không có bàn nào phù hợp với lựa chọn của bạn
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Error Modal */}
        <ErrorModal
          visible={errorModalVisible}
          title={errorModalTitle}
          message={errorModalMessage}
          buttonText="OK"
          isSuccess={errorModalIsSuccess}
          onClose={() => setErrorModalVisible(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
