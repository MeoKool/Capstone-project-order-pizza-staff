import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function QRCheckinScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [step, setStep] = useState("scan"); // scan | checkedIn | selectTable

  useEffect(() => {
    if (permission?.status !== "granted") {
      requestPermission();
    }
  }, [permission]);

  const handleScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    setLoading(true);

    try {
      const res = await fetch(
        `https://vietsac.id.vn/api/workshop-register/get-by-code/${data}`
      );
      const json = await res.json();
      if (!json.success) throw new Error("QR không hợp lệ.");
      const register = json.result;
      setRegisterInfo({ ...register, code: data });

      await fetch(
        `https://vietsac.id.vn/api/workshop-register/check-in-workshop`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workshopRegisterId: register.id }),
        }
      );

      setStep("checkedIn");
    } catch (err) {
      Alert.alert("Lỗi", err.message || "Không thể xử lý mã QR.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async () => {
    try {
      setLoading(true);
      const tableRes = await fetch(
        `https://vietsac.id.vn/api/tables?Status=Closing`
      );
      const tableJson = await tableRes.json();
      setTables(tableJson.result.items);
      setStep("selectTable");
    } catch {
      Alert.alert("Lỗi", "Không thể tải danh sách bàn.");
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

  const assignTable = async () => {
    if (!selectedTableId || !registerInfo?.id) return;
    try {
      setLoading(true);
      await fetch(
        "https://vietsac.id.vn/api/workshop-register/assign-table-workshop-register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workshopRegisterId: registerInfo.id,
            tableId: selectedTableId,
          }),
        }
      );

      // Show success message
      Alert.alert("Thành công", "Đã gán bàn thành công cho khách", [
        {
          text: "Tiếp tục quét QR",
          onPress: () => {
            // Reset state and go back to scan screen
            resetState();
          },
        },
      ]);
    } catch {
      Alert.alert("Lỗi", "Gán bàn thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
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

  if (!permission || permission.status !== "granted") {
    return (
      <View className="flex-1 bg-[#ff7e5f]">
        <StatusBar barStyle="light-content" backgroundColor="#ff7e5f" />
        <LinearGradient colors={["#ff7e5f", "#feb47b"]} className="flex-1">
          <SafeAreaView className="flex-1 justify-center items-center">
            <Ionicons name="camera-outline" size={64} color="white" />
            <Text className="text-xl font-bold mt-4 mb-2 text-white">
              Cần quyền truy cập camera
            </Text>
            <Text className="text-white/80 text-center px-6 mb-4">
              Ứng dụng cần quyền truy cập camera để quét mã QR
            </Text>
            <TouchableOpacity
              className="bg-white px-8 py-3 rounded-full"
              onPress={requestPermission}
            >
              <Text className="text-[#ff7e5f] font-bold">Cấp quyền</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  // Main screen content
  return (
    <View className="flex-1 bg-[#ff7e5f]">
      <StatusBar barStyle="light-content" backgroundColor="#ff7e5f" />
      <LinearGradient colors={["#ff7e5f", "#feb47b"]} className="flex-1">
        <SafeAreaView className="flex-1">
          <View className="flex-1 px-5">
            {/* Header with back button */}
            <View className="flex-row items-center mt-2 mb-4">
              <TouchableOpacity
                onPress={goBack}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-white text-xl font-bold ml-4">
                {step === "scan"
                  ? "Quét mã QR"
                  : step === "checkedIn"
                  ? "Thông tin khách"
                  : "Chọn bàn"}
              </Text>
            </View>

            {step === "scan" && (
              <>
                <View className="items-center mb-4">
                  <Text className="text-white text-base opacity-80 mb-4">
                    Đặt mã QR vào khung để quét
                  </Text>
                </View>
                <View
                  style={{
                    height: 400,
                    borderRadius: 24,
                    overflow: "hidden",
                    borderWidth: 4,
                    borderColor: "rgba(255,255,255,0.3)",
                  }}
                >
                  <CameraView
                    style={{ flex: 1 }}
                    facing={facing}
                    barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                    onBarcodeScanned={scanned ? undefined : handleScanned}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderWidth: 2,
                      borderColor: "rgba(255,255,255,0.5)",
                      borderRadius: 20,
                      margin: 40,
                    }}
                  />
                </View>

                <TouchableOpacity
                  className="mt-6 self-center bg-white/20 rounded-full p-3"
                  onPress={() =>
                    setFacing(facing === "back" ? "front" : "back")
                  }
                >
                  <Ionicons
                    name="camera-reverse-outline"
                    size={28}
                    color="white"
                  />
                </TouchableOpacity>

                {scanned && (
                  <TouchableOpacity
                    className="mt-4 bg-white rounded-full py-4 items-center"
                    onPress={() => setScanned(false)}
                  >
                    <Text className="text-[#ff7e5f] font-bold text-base">
                      Quét lại
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {step === "checkedIn" && registerInfo && !loading && (
              <>
                <View className="bg-white p-6 rounded-2xl mb-6 shadow">
                  <View className="flex-row items-center mb-4">
                    <View className="w-12 h-12 rounded-full bg-[#ff7e5f]/10 items-center justify-center mr-4">
                      <Ionicons name="person" size={24} color="#ff7e5f" />
                    </View>
                    <View>
                      <Text className="text-lg font-bold text-gray-800">
                        Thông tin khách
                      </Text>
                      <Text className="text-sm text-gray-500">
                        Mã: {registerInfo.code}
                      </Text>
                    </View>
                  </View>

                  <View className="bg-gray-50 p-4 rounded-xl mb-2">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-gray-500">Trạng thái:</Text>
                      <Text className="font-medium text-gray-800">
                        {registerInfo.workshopRegisterStatus}
                      </Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-gray-500">Số người:</Text>
                      <Text className="font-medium text-gray-800">
                        {registerInfo.totalParticipant}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-500">Tổng phí:</Text>
                      <Text className="font-medium text-gray-800">
                        {registerInfo.totalFee?.toLocaleString()}đ
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  className="bg-white rounded-full py-4 items-center shadow"
                  onPress={fetchTables}
                >
                  <Text className="text-[#ff7e5f] font-bold text-base">
                    Tiếp tục chọn bàn
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {step === "selectTable" && !loading && (
              <>
                <View className="bg-white/10 p-4 rounded-xl mb-4">
                  <Text className="text-white text-base mb-2">
                    Chọn bàn phù hợp cho khách:
                  </Text>

                  <FlatList
                    data={tables}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 8 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className={`px-6 py-4 rounded-xl mr-3 ${
                          selectedTableId === item.id
                            ? "bg-white shadow"
                            : "bg-white/30 border border-white"
                        }`}
                        onPress={() => setSelectedTableId(item.id)}
                      >
                        <Text
                          className={`text-base font-bold ${
                            selectedTableId === item.id
                              ? "text-[#ff7e5f]"
                              : "text-white"
                          }`}
                        >
                          Bàn {item.code}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>

                <View className="flex-row mt-4">
                  <TouchableOpacity
                    className="flex-1 mr-2 bg-white/20 border border-white rounded-full py-4 items-center"
                    onPress={() => setStep("checkedIn")}
                  >
                    <Text className="text-white font-bold text-base">
                      Quay lại
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`flex-1 ml-2 rounded-full py-4 items-center ${
                      selectedTableId ? "bg-white" : "bg-white/50"
                    }`}
                    onPress={assignTable}
                    disabled={!selectedTableId}
                  >
                    <Text
                      className={`font-bold text-base ${
                        selectedTableId ? "text-[#ff7e5f]" : "text-white/50"
                      }`}
                    >
                      Gán Bàn
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </SafeAreaView>

        {loading && (
          <View className="absolute inset-0 bg-black/30 items-center justify-center">
            <View className="bg-white p-6 rounded-2xl items-center">
              <ActivityIndicator size="large" color="#ff7e5f" />
              <Text className="text-gray-700 mt-4 font-medium">
                Đang xử lý...
              </Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}
