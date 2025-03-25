import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";

export default function CameraScanner({
  facing,
  setFacing,
  scanned,
  onScanned,
  onRetry,
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
          Đặt mã QR vào khung để quét
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
        <CameraView
          style={{ flex: 1 }}
          facing={facing}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={scanned ? undefined : onScanned}
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
        style={{
          marginTop: 24,
          alignSelf: "center",
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: 9999,
          padding: 12,
        }}
        onPress={() => setFacing(facing === "back" ? "front" : "back")}
      >
        <Ionicons name="camera-reverse-outline" size={28} color="white" />
      </TouchableOpacity>

      {scanned && (
        <TouchableOpacity
          style={{
            marginTop: 16,
            backgroundColor: "white",
            borderRadius: 9999,
            paddingVertical: 16,
            alignItems: "center",
          }}
          onPress={onRetry}
        >
          <Text style={{ color: "#ff7e5f", fontWeight: "bold", fontSize: 16 }}>
            Quét lại
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}
