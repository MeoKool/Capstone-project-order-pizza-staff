import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GuestInfoCard({
  registerInfo,
  onNext,
  isAlreadyCheckedIn,
}) {
  return (
    <>
      <View
        style={{
          marginTop: 100,
          backgroundColor: "white",
          padding: 24,
          borderRadius: 16,
          marginBottom: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "rgba(255,126,95,0.1)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <Ionicons name="person" size={24} color="#ff7e5f" />
          </View>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
              Thông tin khách
            </Text>
            <Text style={{ fontSize: 14, color: "#777" }}>
              Mã: {registerInfo.code}
            </Text>
          </View>
        </View>

        <View
          style={{ backgroundColor: "#f9f9f9", padding: 16, borderRadius: 12 }}
        >
          <TextRow
            label="Trạng thái"
            value={registerInfo.workshopRegisterStatus}
          />
          <TextRow label="Số người" value={registerInfo.totalParticipant} />
          <TextRow
            label="Tổng phí"
            value={`${registerInfo.totalFee?.toLocaleString()}đ`}
          />
        </View>
      </View>

      <TouchableOpacity
        disabled={isAlreadyCheckedIn}
        style={{
          backgroundColor: isAlreadyCheckedIn ? "#ddd" : "white",
          borderRadius: 9999,
          paddingVertical: 16,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
          opacity: isAlreadyCheckedIn ? 0.6 : 1,
        }}
        onPress={onNext}
      >
        <Text
          style={{
            color: isAlreadyCheckedIn ? "#000" : "#ff7e5f",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {isAlreadyCheckedIn ? "Đã được gán bàn" : "Tiếp tục chọn bàn"}
        </Text>
      </TouchableOpacity>
    </>
  );
}

function TextRow({ label, value }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
      }}
    >
      <Text style={{ color: "#777" }}>{label}:</Text>
      <Text style={{ fontWeight: "500", color: "#333" }}>{value}</Text>
    </View>
  );
}
