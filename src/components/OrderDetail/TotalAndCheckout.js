"use client";

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { PAYMENT_STATUS } from "../../base/constant";
import { Ticket } from "lucide-react-native";
import axios from "axios";
import { useState } from "react";
// Import the calculation function from the utility file
import { calculateTotalAmount } from "./total-utils";

// Re-export the function for backward compatibility
export { calculateTotalAmount };

const API_URL = "https://vietsac.id.vn";

export default function TotalAndCheckout({
  order,
  orderItems = [],
  checkingOut,
  onCheckout,
  onPayment,
  appliedVoucher,
  onVoucherApplied,
}) {
  const [voucherCode, setVoucherCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Use the backend-calculated total if available, otherwise fallback to empty order
  const totalAmount = order?.totalPrice || 0;

  // Check if order is in checkout state
  const isCheckoutState = order && order.status === PAYMENT_STATUS.UNPAID;

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
        orderId: order.id,
        voucherId: voucher.id,
      });

      if (!applyResponse.data.success) {
        throw new Error(
          applyResponse.data.message || "Không thể áp dụng voucher"
        );
      }

      // Clear the input and notify parent component
      setVoucherCode("");
      if (onVoucherApplied) {
        onVoucherApplied(voucher);
      }

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
    <View className="absolute bottom-0 left-0 right-0 p-4 bg-[#feb47b] backdrop-blur-sm">
      {/* Show additional fees if they exist and not in checkout state */}
      {!isCheckoutState &&
        order?.additionalFees &&
        order.additionalFees.length > 0 && (
          <View className="mb-2 bg-white/20 p-3 rounded-lg">
            <Text className="text-black font-medium mb-1">Phí bổ sung:</Text>
            {order.additionalFees.map((fee) => (
              <View key={fee.id} className="flex-row justify-between">
                <Text className="text-black">{fee.name}</Text>
                <Text className="text-black font-medium">
                  {fee.value.toLocaleString("vi-VN")} VNĐ
                </Text>
              </View>
            ))}
          </View>
        )}

      {/* Voucher Input - only show if not in checkout state */}
      {order && order.status !== PAYMENT_STATUS.PAID && (
        <View className="mb-2 bg-white/20 p-3 rounded-lg">
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
                className="flex-1 bg-white rounded-l-lg px-3 py-2 text-black"
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
      )}

      {/* Display voucher discount if applied and not in checkout state */}
      {!isCheckoutState && appliedVoucher && (
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-black font-medium">
            Giảm giá ({appliedVoucher.code}):
          </Text>
          <Text className="text-black font-medium text-red-600">
            {appliedVoucher.discountType === "Percentage"
              ? `-${appliedVoucher.discountValue}%`
              : `-${appliedVoucher.discountValue.toLocaleString("vi-VN")} VNĐ`}
          </Text>
        </View>
      )}

      {/* Show subtotal if we have additional fees and not in checkout state */}
      {!isCheckoutState &&
        order?.totalOrderItemPrice &&
        (order?.additionalFees?.length > 0 || appliedVoucher) && (
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-black font-medium">Tổng tiền món:</Text>
            <Text className="text-black font-medium">
              {order.totalOrderItemPrice.toLocaleString("vi-VN")} VNĐ
            </Text>
          </View>
        )}

      {/* Total amount - only show if not in checkout state */}
      {!isCheckoutState && (
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-black font-medium text-lg">Tổng tiền:</Text>
          <Text className="text-black font-bold text-xl">
            {totalAmount.toLocaleString("vi-VN")} VNĐ
          </Text>
        </View>
      )}

      <TouchableOpacity
        className={`py-4 px-6 rounded-xl ${
          orderItems.length === 0 ||
          checkingOut ||
          (order && order.status === PAYMENT_STATUS.PAID)
            ? "bg-gray-400"
            : order &&
              (order.status === PAYMENT_STATUS.UNPAID ||
                order.status === PAYMENT_STATUS.CHECKOUT)
            ? "bg-[#4ade80]"
            : "bg-[#22c55e]"
        }`}
        onPress={
          order && order.status === PAYMENT_STATUS.PAID
            ? null
            : order &&
              (order.status === PAYMENT_STATUS.PAID ||
                order.status === PAYMENT_STATUS.CHECKOUT)
            ? onPayment
            : onCheckout
        }
        disabled={
          orderItems.length === 0 ||
          checkingOut ||
          (order && order.status === PAYMENT_STATUS.PAID)
        }
      >
        <Text className="text-white text-center font-bold text-lg">
          {checkingOut
            ? "Đang xử lý..."
            : order && order.status === PAYMENT_STATUS.PAID
            ? "Đã Thanh Toán"
            : order && order.status === PAYMENT_STATUS.CHECKOUT
            ? "Thanh Toán"
            : "Checkout"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
