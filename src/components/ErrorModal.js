import { View, Text, TouchableOpacity, Modal } from "react-native";
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  LogOut,
} from "lucide-react-native";

export default function ErrorModal({
  visible,
  title,
  message,
  buttonText = "OK",
  onClose,
  isSuccess = false,
  isWarning = false,
  isLogout = false,
  onCancel,
  cancelText = "Hủy",
}) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 24,
            width: "80%",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: isSuccess
                ? "#ECFDF5"
                : isWarning
                ? "#FEF3C7"
                : isLogout
                ? "#FEE2E2"
                : "#FEE2E2",
              padding: 12,
              borderRadius: 50,
              marginBottom: 16,
            }}
          >
            {isSuccess ? (
              <CheckCircle size={32} color="#10B981" />
            ) : isWarning ? (
              <AlertCircle size={32} color="#F59E0B" />
            ) : isLogout ? (
              <LogOut size={32} color="#EF4444" />
            ) : (
              <AlertTriangle size={32} color="#EF4444" />
            )}
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginBottom: 20,
              color: "#555",
            }}
          >
            {message}
          </Text>

          {onCancel ? (
            <View style={{ flexDirection: "row", width: "100%" }}>
              <TouchableOpacity
                onPress={onCancel}
                style={{
                  backgroundColor: "#E5E7EB",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  flex: 1,
                  marginRight: 8,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#4B5563", fontWeight: "500" }}>
                  {cancelText}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  backgroundColor: isSuccess
                    ? "#10B981"
                    : isWarning
                    ? "#F59E0B"
                    : isLogout
                    ? "#EF4444"
                    : "#EF4444",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  flex: 1,
                  marginLeft: 8,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "500" }}>
                  {buttonText}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: isSuccess
                  ? "#10B981"
                  : isWarning
                  ? "#F59E0B"
                  : isLogout
                  ? "#EF4444"
                  : "#EF4444",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
                width: "100%",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "500" }}>
                {buttonText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}
