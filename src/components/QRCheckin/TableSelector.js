import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

export default function TableSelector({
  tables,
  selectedTableId,
  setSelectedTableId,
  onBack,
  onAssign,
}) {
  return (
    <>
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          padding: 16,
          borderRadius: 12,
          marginBottom: 16,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, marginBottom: 8 }}>
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
              style={{
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderRadius: 12,
                marginRight: 12,
                backgroundColor:
                  selectedTableId === item.id
                    ? "white"
                    : "rgba(255,255,255,0.3)",
                borderWidth: selectedTableId === item.id ? 0 : 1,
                borderColor: "white",
              }}
              onPress={() => setSelectedTableId(item.id)}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: selectedTableId === item.id ? "#ff7e5f" : "white",
                }}
              >
                Bàn {item.code}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={{ flexDirection: "row", marginTop: 16 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            marginRight: 8,
            backgroundColor: "rgba(255,255,255,0.2)",
            borderWidth: 1,
            borderColor: "white",
            borderRadius: 9999,
            paddingVertical: 16,
            alignItems: "center",
          }}
          onPress={onBack}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Quay lại
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            marginLeft: 8,
            backgroundColor: selectedTableId
              ? "white"
              : "rgba(255,255,255,0.5)",
            borderRadius: 9999,
            paddingVertical: 16,
            alignItems: "center",
          }}
          onPress={onAssign}
          disabled={!selectedTableId}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              color: selectedTableId ? "#ff7e5f" : "rgba(255,255,255,0.5)",
            }}
          >
            Xác nhận
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
