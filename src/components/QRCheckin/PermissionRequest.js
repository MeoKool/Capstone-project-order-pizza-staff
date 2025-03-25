import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function PermissionRequest({ onRequest }) {
  return (
    <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Ionicons name="camera-outline" size={64} color="white" />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 16,
            marginBottom: 8,
            color: "white",
          }}
        >
          Cần quyền truy cập camera
        </Text>
        <Text
          style={{
            color: "rgba(255,255,255,0.8)",
            textAlign: "center",
            paddingHorizontal: 24,
            marginBottom: 16,
          }}
        >
          Ứng dụng cần quyền truy cập camera để quét mã QR
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            paddingHorizontal: 32,
            paddingVertical: 12,
            borderRadius: 9999,
          }}
          onPress={onRequest}
        >
          <Text style={{ color: "#ff7e5f", fontWeight: "bold" }}>
            Cấp quyền
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
