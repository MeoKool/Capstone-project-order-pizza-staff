import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function TableSelector({
  tables,
  selectedTableId,
  setSelectedTableId,
  onBack,
  onAssign,
}) {
  // Group tables by zone
  const tablesByZone = useMemo(() => {
    const grouped = {};

    tables.forEach((table) => {
      if (!table.zone) return;

      const zoneId = table.zone.id;
      if (!grouped[zoneId]) {
        grouped[zoneId] = {
          zoneInfo: table.zone,
          tables: [],
        };
      }

      grouped[zoneId].tables.push(table);
    });

    return Object.values(grouped);
  }, [tables]);

  // Get table status text
  const getStatusText = (status) => {
    switch (status) {
      case "Available":
        return "Trống";
      case "Occupied":
        return "Đang phục vụ";
      case "Reserved":
        return "Đã đặt trước";
      case "Closing":
        return "Sắp trả bàn";
      default:
        return "Không xác định";
    }
  };

  return (
    <LinearGradient
      colors={["#ff7e5f", "#feb47b"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#ff7e5f" />

        {/* Main Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introContainer}>
            <View style={styles.introTextContainer}>
              <Text style={styles.subtitle}>Chọn bàn phù hợp cho khách</Text>
            </View>
          </View>

          {tablesByZone.map((zoneGroup) => (
            <View key={zoneGroup.zoneInfo.id} style={styles.zoneContainer}>
              <View style={styles.zoneHeaderContainer}>
                <Ionicons name="location" size={20} color="white" />
                <Text style={styles.zoneName}>
                  Khu vực {zoneGroup.zoneInfo.name.trim()}
                </Text>
              </View>

              <View style={styles.tablesGrid}>
                {zoneGroup.tables.map((table) => (
                  <TouchableOpacity
                    key={table.id}
                    style={[
                      styles.tableCard,
                      selectedTableId === table.id && styles.tableCardSelected,
                    ]}
                    onPress={() => setSelectedTableId(table.id)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={
                        selectedTableId === table.id
                          ? ["rgba(255,255,255,0.9)", "rgba(255,255,255,0.7)"]
                          : ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]
                      }
                      style={styles.tableCardGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: getStatusColor(table.status) },
                        ]}
                      />
                      <View style={styles.tableIconContainer}>
                        <Ionicons
                          name="restaurant-outline"
                          size={24}
                          color={
                            selectedTableId === table.id ? "#ff7e5f" : "white"
                          }
                        />
                      </View>
                      <Text
                        style={[
                          styles.tableCode,
                          selectedTableId === table.id &&
                            styles.tableCodeSelected,
                        ]}
                      >
                        Bàn {table.code.trim()}
                      </Text>
                      <View style={styles.tableInfoContainer}>
                        <View style={styles.capacityContainer}>
                          <Ionicons
                            name="people-outline"
                            size={14}
                            color={
                              selectedTableId === table.id ? "#ff7e5f" : "white"
                            }
                          />
                          <Text
                            style={[
                              styles.tableCapacity,
                              selectedTableId === table.id &&
                                styles.tableCapacitySelected,
                            ]}
                          >
                            {table.capacity} người
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.tableStatus,
                            selectedTableId === table.id &&
                              styles.tableStatusSelected,
                          ]}
                        >
                          {getStatusText(table.status)}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Add extra padding to avoid bottom bar overlap */}
          <View style={styles.extraBottomPadding} />
        </ScrollView>

        {/* Fixed Bottom Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              !selectedTableId && styles.confirmButtonDisabled,
            ]}
            onPress={onAssign}
            disabled={!selectedTableId}
            activeOpacity={0.8}
          >
            <Ionicons
              name="checkmark-outline"
              size={20}
              color={selectedTableId ? "#ff7e5f" : "rgba(255,255,255,0.5)"}
              style={styles.buttonIcon}
            />
            <Text
              style={[
                styles.confirmButtonText,
                !selectedTableId && styles.confirmButtonTextDisabled,
              ]}
            >
              Xác nhận
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Helper function to get status color
function getStatusColor(status) {
  switch (status) {
    case "Available":
      return "#4CAF50"; // Green
    case "Occupied":
      return "#F44336"; // Red
    case "Reserved":
      return "#FFC107"; // Yellow
    case "Closing":
      return "#FF9800"; // Orange
    default:
      return "#FFC107"; // Default to yellow
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 180,
  },
  introContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
  },
  introTextContainer: {
    flex: 1,
  },
  introImage: {
    width: 60,
    height: 60,
    marginLeft: 10,
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    color: "white",
    fontSize: 12,
  },
  zoneContainer: {
    marginBottom: 24,
  },
  zoneHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  zoneName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  tablesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tableCard: {
    width: width > 400 ? "48%" : "100%",
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  tableCardGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    height: 120,
  },
  tableCardSelected: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  tableIconContainer: {
    marginBottom: 8,
  },
  statusDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  tableCode: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tableCodeSelected: {
    color: "#ff7e5f",
  },
  tableInfoContainer: {
    marginTop: "auto",
  },
  capacityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  tableCapacity: {
    color: "white",
    fontSize: 14,
    marginLeft: 4,
  },
  tableCapacitySelected: {
    color: "#ff7e5f",
  },
  tableStatus: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  tableStatusSelected: {
    color: "#ff7e5f",
  },
  extraBottomPadding: {
    height: 100,
  },
  bottomButtons: {
    position: "absolute",
    bottom: 80, // Positioned above the bottom navigation bar
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  backButtonBottom: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#CC0000",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  confirmButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#ff7e5f",
  },
  confirmButtonTextDisabled: {
    color: "rgba(255,255,255,0.5)",
  },
  buttonIcon: {
    marginRight: 8,
  },
});
