import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";

export default function CameraScanner({
  facing,
  setFacing,
  scanned,
  onScanned,
  onRetry,
  cameraEnabled = true,
}) {
  return (
    <>
      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            opacity: 0.8,
            marginBottom: 16,
          }}
        >
          {cameraEnabled
            ? "Đặt mã QR vào khung để quét"
            : "Quét mã QR hoàn tất"}
        </Text>
      </View>

      <View
        style={{
          height: 450,
          borderRadius: 24,
          overflow: "hidden",
          borderWidth: 4,
          borderColor: "rgba(255,255,255,0.3)",
        }}
      >
        {cameraEnabled ? (
          <CameraView
            style={{ flex: 1 }}
            facing={facing}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={onScanned}
          />
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.8)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            <Text style={{ color: "white", marginTop: 16, fontSize: 18 }}>
              Đã quét xong
            </Text>
          </View>
        )}
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
        style={{
          marginTop: 24,
          alignSelf: "center",
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: 9999,
          padding: 12,
        }}
        onPress={() => setFacing(facing === "back" ? "front" : "back")}
        disabled={!cameraEnabled}
      >
        <Ionicons
          name="camera-reverse-outline"
          size={28}
          color={cameraEnabled ? "white" : "rgba(255,255,255,0.5)"}
        />
      </TouchableOpacity>
    </>
  );
}
