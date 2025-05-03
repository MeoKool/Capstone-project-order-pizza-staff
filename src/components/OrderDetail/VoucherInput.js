"use client";

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ticket } from "lucide-react-native";
import CustomModal from "../CustomModal";

const API_URL = "https://vietsac.id.vn";

export default function VoucherInput({
  orderId,
  onVoucherApplied,
  appliedVoucher,
}) {
  const [voucherCode, setVoucherCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "info", // 'success', 'error', 'warning', 'info'
  });

  const showModal = (title, message, type = "info") => {
    setModalConfig({
      title,
      message,
      type,
    });
    setModalVisible(true);
  };

  function applyVoucher() {
    if (!voucherCode.trim()) {
      console.log("Showing error modal for empty voucher code");
      showModal("Lỗi", "Vui lòng nhập mã voucher", "error");
      return;
    }

    setLoading(true);

    // Hiển thị modal loading ngay lập tức
    console.log("Showing loading modal");
    showModal("Đang xử lý", "Đang kiểm tra mã voucher...", "info");

    // Simulate API call for testing modal
    setTimeout(async () => {
      try {
        console.log("API call simulation started");

        // Giả lập thành công để test modal
        setModalVisible(false); // Đóng modal loading

        // Hiển thị modal thành công sau 500ms
        setTimeout(() => {
          console.log("Showing success modal");
          showModal("Thành công", `Đã áp dụng voucher giảm 10%`, "success");

          // Clear input
          setVoucherCode("");
        }, 500);
      } catch (err) {
        console.log("Error occurred:", err.message);
        showModal(
          "Lỗi",
          "Không thể áp dụng voucher. Vui lòng thử lại.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }, 1000);
  }

  return (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-md">
      <View className="flex-row items-center mb-2">
        <Ticket size={20} color="#000" />
        <Text className="text-black font-medium ml-2">Mã giảm giá</Text>
      </View>

      {appliedVoucher ? (
        <View className="bg-green-100 p-2 rounded-lg">
          <Text className="text-green-800 font-medium">
            Đã áp dụng: {appliedVoucher.code} (
            {appliedVoucher.discountType === "Percentage"
              ? `Giảm ${appliedVoucher.discountValue}%`
              : `Giảm ${appliedVoucher.discountValue.toLocaleString(
                  "vi-VN"
                )} VNĐ`}
            )
          </Text>
        </View>
      ) : (
        <View className="flex-row">
          <TextInput
            className="flex-1 bg-gray-100 rounded-l-lg px-3 py-2 text-black"
            placeholder="Nhập mã voucher"
            value={voucherCode}
            onChangeText={setVoucherCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            className="bg-[#ff7e5f] rounded-r-lg px-4 justify-center items-center"
            onPress={applyVoucher}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-white font-bold">Áp dụng</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Custom Modal */}
      <CustomModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalVisible(false)}
        autoClose={modalConfig.type === "success"} // Auto close success messages
      />
    </View>
  );
}
