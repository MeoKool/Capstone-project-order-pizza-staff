"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AlertTriangle } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PermissionRequest from "../components/QRCheckin/PermissionRequest";
import CameraScanner from "../components/QRCheckin/CameraScanner";
import GuestInfoCard from "../components/QRCheckin/GuestInfoCard";
import TableSelector from "../components/QRCheckin/TableSelector";
import axios from "axios";

const GRADIENT_COLORS = ["#ff7e5f", "#feb47b"];

export default function QRCheckInScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registerInfo, setRegisterInfo] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [step, setStep] = useState("scan"); // scan | checkedIn | selectTable
  const [hasNoZones, setHasNoZones] = useState(false);
  const [showNoZonesModal, setShowNoZonesModal] = useState(false);

  useEffect(() => {
    if (permission?.status !== "granted") {
      requestPermission();
    }
  }, [permission]);

  // Check if staff has assigned zones
  useEffect(() => {
    const checkStaffZones = async () => {
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

        const staffZoneData = response.data.result.items.map(
          (item) => item.zone
        );
        const noZones = staffZoneData.length === 0;

        setHasNoZones(noZones);
        // Show modal immediately if they have no zones
        if (noZones) {
          setShowNoZonesModal(true);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching staff zones:", err);
        setHasNoZones(true);
        setShowNoZonesModal(true);
        setLoading(false);
      }
    };

    checkStaffZones();
  }, []);

  const handleScanned = async ({ data }) => {
    if (scanned) return;

    // Check if staff has no zones and show modal instead
    if (hasNoZones) {
      setScanned(true);
      setShowNoZonesModal(true);
      return;
    }

    setScanned(true);
    setLoading(true);

    try {
      const res = await axios.get(
        `https://vietsac.id.vn/api/workshop-register/get-by-code/${data}`
      );
      if (!res.data.success) throw new Error("QR không hợp lệ.");

      const register = res.data.result;

      // Gán thông tin và cờ đã check-in
      setRegisterInfo({ ...register, code: data });
      setStep("checkedIn");

      // Nếu đã có tableId thì không gọi API check-in nữa
      if (register.tableId) {
        return; // chỉ hiển thị thông tin
      }

      // Nếu chưa check-in thì thực hiện check-in
      await axios.post(
        `https://vietsac.id.vn/api/workshop-register/check-in-workshop`,
        {
          workshopRegisterId: register.id,
        }
      );
    } catch (err) {
      Alert.alert("Lỗi", err.message || "Không thể xử lý mã QR.");
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async () => {
    // Check if staff has no zones and show modal instead
    if (hasNoZones) {
      setShowNoZonesModal(true);
      return;
    }

    try {
      setLoading(true);
      const tableRes = await axios.get(
        `https://vietsac.id.vn/api/tables?Status=Closing`
      );
      setTables(tableRes.data.result.items);
      setStep("selectTable");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message || "Không thể tải danh sách bàn.";
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const assignTable = async () => {
    // Check if staff has no zones and show modal instead
    if (hasNoZones) {
      setShowNoZonesModal(true);
      return;
    }

    if (!selectedTableId || !registerInfo?.id) return;
    try {
      setLoading(true);
      await axios.post(
        "https://vietsac.id.vn/api/workshop-register/assign-table-workshop-register",
        {
          workshopRegisterId: registerInfo.id,
          tableId: selectedTableId,
        }
      );

      Alert.alert("Thành công", "Đã gán bàn thành công cho khách", [
        {
          text: "Tiếp tục quét QR",
          onPress: () => resetState(),
        },
      ]);
    } catch {
      Alert.alert("Lỗi", "Gán bàn thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setScanned(false);
    setRegisterInfo(null);
    setSelectedTableId(null);
    setTables([]);
    setStep("scan");
  };

  const goBack = () => {
    if (step === "checkedIn") {
      resetState();
    } else if (step === "selectTable") {
      setStep("checkedIn");
    } else if (navigation) {
      navigation.goBack();
    }
  };

  if (loading && !showNoZonesModal) {
    return (
      <View style={{ flex: 1, backgroundColor: GRADIENT_COLORS[0] }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={GRADIENT_COLORS[0]}
        />
        <LinearGradient colors={GRADIENT_COLORS} style={{ flex: 1 }}>
          <SafeAreaView
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="white" />
            <Text style={{ color: "white", marginTop: 16 }}>Đang tải...</Text>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  if (!permission || permission.status !== "granted") {
    return <PermissionRequest onRequest={requestPermission} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: GRADIENT_COLORS[0] }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={GRADIENT_COLORS[0]}
      />
      <LinearGradient colors={GRADIENT_COLORS} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
                marginBottom: 16,
              }}
            >
              <TouchableOpacity
                onPress={goBack}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginLeft: 16,
                }}
              >
                {step === "scan"
                  ? "Quét mã QR"
                  : step === "checkedIn"
                  ? "Thông tin khách"
                  : "Chọn bàn"}
              </Text>
            </View>

            {step === "scan" && (
              <>
                {hasNoZones ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      padding: 20,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#FEE2E2",
                        padding: 12,
                        borderRadius: 50,
                        marginBottom: 16,
                      }}
                    >
                      <AlertTriangle size={32} color="#EF4444" />
                    </View>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: 8,
                      }}
                    >
                      Không có quyền truy cập
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        opacity: 0.8,
                        marginBottom: 20,
                      }}
                    >
                      Bạn chưa được phân công khu vực nào. Vui lòng liên hệ quản
                      lý để được phân công khu vực.
                    </Text>
                  </View>
                ) : (
                  <CameraScanner
                    facing={facing}
                    setFacing={setFacing}
                    scanned={scanned}
                    onScanned={handleScanned}
                    onRetry={() => setScanned(false)}
                  />
                )}
              </>
            )}

            {step === "checkedIn" && registerInfo && !loading && (
              <GuestInfoCard
                registerInfo={registerInfo}
                onNext={fetchTables}
                isAlreadyCheckedIn={!!registerInfo.tableId}
              />
            )}

            {step === "selectTable" && (
              <TableSelector
                tables={tables}
                selectedTableId={selectedTableId}
                setSelectedTableId={setSelectedTableId}
                onBack={() => setStep("checkedIn")}
                onAssign={assignTable}
              />
            )}
          </View>
        </SafeAreaView>

        {/* Loading Overlay */}
        {loading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 24,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#555", marginBottom: 8, fontWeight: "500" }}
              >
                Đang xử lý...
              </Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}
