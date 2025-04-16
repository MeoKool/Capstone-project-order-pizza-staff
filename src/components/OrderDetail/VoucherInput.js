"use client";

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ticket } from "lucide-react-native";
import axios from "axios";

const API_URL = "https://vietsac.id.vn";

export default function VoucherInput({
  orderId,
  onVoucherApplied,
  appliedVoucher,
}) {
  const [voucherCode, setVoucherCode] = useState("");
  const [loading, setLoading] = useState(false);

  const applyVoucher = async () => {
    if (!voucherCode.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mã voucher");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Validate the voucher code
      const validateResponse = await axios.get(
        `${API_URL}/api/vouchers/get-by-code`,
        {
          params: { Code: voucherCode.trim() },
        }
      );

      if (!validateResponse.data.success) {
        throw new Error(
          validateResponse.data.message || "Mã voucher không hợp lệ"
        );
      }

      const voucher = validateResponse.data.result;

      if (voucher.voucherStatus !== "Available" || voucher.isUsed) {
        throw new Error("Mã voucher đã được sử dụng hoặc không khả dụng");
      }

      // Step 2: Apply the voucher to the order
      const applyResponse = await axios.post(`${API_URL}/api/order-vouchers`, {
        orderId: orderId,
        voucherId: voucher.id,
      });

      if (!applyResponse.data.success) {
        throw new Error(
          applyResponse.data.message || "Không thể áp dụng voucher"
        );
      }

      // Clear the input and notify parent component
      setVoucherCode("");
      onVoucherApplied(voucher);

      Alert.alert(
        "Thành công",
        `Đã áp dụng voucher giảm ${
          voucher.discountType === "Percentage"
            ? voucher.discountValue + "%"
            : voucher.discountValue.toLocaleString("vi-VN") + " VNĐ"
        }`
      );
    } catch (err) {
      let errorMessage = "Không thể áp dụng voucher. Vui lòng thử lại.";

      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }

      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
    </View>
  );
}
