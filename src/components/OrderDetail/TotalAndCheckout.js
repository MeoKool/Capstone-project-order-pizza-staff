import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { PAYMENT_STATUS } from "../../base/constant";
import { Ticket, X, Plus } from "lucide-react-native";
import axios from "axios";
import { useState, useEffect } from "react";
// Import the calculation function from the utility file
import { calculateTotalAmount } from "./total-utils";

// Re-export the function for backward compatibility
export { calculateTotalAmount };

const API_URL = "https://vietsac.id.vn";

// Add a function to delete the voucher
const deleteVoucher = async (orderVoucherId, onSuccess) => {
  try {
    const response = await axios.delete(
      `https://vietsac.id.vn/api/order-vouchers/${orderVoucherId}?isHardDeleted=false`
    );

    if (response.data.success) {
      Alert.alert("Thành công", "Đã xóa mã giảm giá thành công");
      if (onSuccess) onSuccess();
    } else {
      throw new Error(
        response.data.error.message || "Không thể xóa mã giảm giá"
      );
    }
  } catch (err) {
    let errorMessage = "Không thể xóa mã giảm giá. Vui lòng thử lại.";

    if (err.response && err.response.data) {
      errorMessage = err.response.data.error.message || errorMessage;
    } else if (err.message) {
      errorMessage = err.message;
    }

    Alert.alert("Lỗi", errorMessage);
  }
};

export default function TotalAndCheckout({
  order,
  orderItems = [],
  checkingOut,
  onCheckout,
  onPayment,
  appliedVoucher, // This will be ignored as we'll use appliedVouchers array
  onVoucherApplied, // This will be modified to handle multiple vouchers
}) {
  const [voucherCode, setVoucherCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [voucherModalVisible, setVoucherModalVisible] = useState(false);
  const [appliedVouchers, setAppliedVouchers] = useState([]);

  // Use the backend-calculated total if available, otherwise fallback to empty order
  const totalAmount = order?.totalPrice || 0;

  // Check if order is in checkout state
  const isUnpaidState = order && order.status === PAYMENT_STATUS.UNPAID;
  const isCheckoutState = order && order.status === PAYMENT_STATUS.CHECKOUT;

  // Initialize appliedVouchers from order data
  useEffect(() => {
    if (order?.orderVouchers && order.orderVouchers.length > 0) {
      const vouchers = order.orderVouchers.map((ov) => ({
        ...ov.voucher,
        orderVoucherId: ov.id,
      }));
      setAppliedVouchers(vouchers);
    } else {
      setAppliedVouchers([]);
    }
  }, [order]);

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
          validateResponse.data.error?.message || "Mã voucher không hợp lệ"
        );
      }

      const voucher = validateResponse.data.result;

      if (voucher.voucherStatus !== "Available" || voucher.isUsed) {
        throw new Error("Mã voucher đã được sử dụng hoặc không khả dụng");
      }

      // Check if this voucher is already applied
      if (appliedVouchers.some((v) => v.id === voucher.id)) {
        throw new Error("Mã voucher này đã được áp dụng");
      }

      // Step 2: Apply the voucher to the order
      const applyResponse = await axios.post(`${API_URL}/api/order-vouchers`, {
        orderId: order.id,
        voucherId: voucher.id,
      });

      if (!applyResponse.data.success) {
        throw new Error(
          applyResponse.data.error?.message || "Không thể áp dụng voucher"
        );
      }

      // Get the orderVoucherId from the response
      const orderVoucherId = applyResponse.data.result.id;

      // Add the new voucher to the list with its orderVoucherId
      const newVoucher = {
        ...voucher,
        orderVoucherId: orderVoucherId,
      };

      // Clear the input and notify parent component
      setVoucherCode("");
      setVoucherModalVisible(false);

      // Update the local state
      setAppliedVouchers((prev) => [...prev, newVoucher]);

      // Notify parent to refresh order data
      if (onVoucherApplied) {
        onVoucherApplied(newVoucher);
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
        errorMessage = err.response.data.error?.message || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }

      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVoucher = (voucher) => {
    if (voucher.orderVoucherId) {
      deleteVoucher(voucher.orderVoucherId, () => {
        // Remove the voucher from the local state
        setAppliedVouchers((prev) => prev.filter((v) => v.id !== voucher.id));

        // Notify parent to refresh order data
        if (onVoucherApplied) {
          onVoucherApplied(null);
        }
      });
    }
  };

  const cancelCheckout = async () => {
    try {
      setCancelLoading(true);
      const response = await axios.put(
        `${API_URL}/api/orders/cancel-check-out/${order.id}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Không thể hủy checkout");
      }

      Alert.alert("Thành công", "Đã hủy checkout thành công");
      // Refresh the order data
      if (onVoucherApplied) {
        onVoucherApplied(null);
      }
    } catch (err) {
      let errorMessage = "Không thể hủy checkout. Vui lòng thử lại.";

      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }

      Alert.alert("Lỗi", errorMessage);
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <View className="p-4 bg-[#feb47b] backdrop-blur-sm">
      {/* Voucher Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={voucherModalVisible}
        onRequestClose={() => setVoucherModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-5 w-4/5 max-w-md">
            <Text className="text-xl font-bold mb-4 text-center">
              Nhập mã giảm giá
            </Text>

            <TextInput
              className="bg-gray-100 rounded-lg px-3 py-3 text-black mb-4"
              placeholder="Nhập mã voucher"
              value={voucherCode}
              onChangeText={setVoucherCode}
              autoCapitalize="characters"
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-300 rounded-lg py-3 px-5 flex-1 mr-2"
                onPress={() => {
                  setVoucherModalVisible(false);
                  setVoucherCode("");
                }}
              >
                <Text className="text-center font-bold">Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-[#ff7e5f] rounded-lg py-3 px-5 flex-1"
                onPress={applyVoucher}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-white text-center font-bold">
                    Áp dụng
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Show additional fees if they exist and not in checkout state */}
      {!isUnpaidState &&
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

      {/* Voucher section - only show if not in checkout state */}
      {order && order.status === PAYMENT_STATUS.UNPAID && (
        <View className="mb-2 bg-white/20 p-3 rounded-lg">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ticket size={20} color="#000" />
              <Text className="text-black font-medium ml-2">Mã giảm giá</Text>
            </View>

            <TouchableOpacity
              className="bg-[#ff7e5f] rounded-lg px-4 py-2 flex-row items-center"
              onPress={() => setVoucherModalVisible(true)}
            >
              <Plus size={16} color="white" className="mr-1" />
              <Text className="text-white font-bold">Thêm mã</Text>
            </TouchableOpacity>
          </View>

          {appliedVouchers.length > 0 && (
            <ScrollView
              className="mt-2"
              style={{
                maxHeight: appliedVouchers.length > 2 ? 120 : undefined,
              }}
            >
              {appliedVouchers.map((voucher) => (
                <View
                  key={voucher.id}
                  className="bg-green-100 p-2 rounded-lg flex-row justify-between items-center mb-2"
                >
                  <Text className="text-green-800 font-medium flex-1">
                    {voucher.code} (
                    {voucher.discountType === "Percentage"
                      ? `Giảm ${voucher.discountValue}%`
                      : `Giảm ${voucher.discountValue.toLocaleString(
                          "vi-VN"
                        )} VNĐ`}
                    )
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteVoucher(voucher)}
                    className="ml-2 bg-red-500 p-1 rounded-full"
                  >
                    <X size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Show subtotal if we have additional fees and not in checkout state */}
      {!isUnpaidState &&
        order?.totalOrderItemPrice &&
        (order?.additionalFees?.length > 0 || appliedVouchers.length > 0) && (
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-black font-medium">Tổng tiền món:</Text>
            <Text className="text-black font-medium">
              {order.totalOrderItemPrice.toLocaleString("vi-VN")} VNĐ
            </Text>
          </View>
        )}

      {/* Total amount - only show if not in checkout state */}
      {!isUnpaidState && (
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-black font-medium text-lg">Tổng tiền:</Text>
          <Text className="text-black font-bold text-xl">
            {totalAmount.toLocaleString("vi-VN")} VNĐ
          </Text>
        </View>
      )}

      {/* Buttons container */}
      <View className="flex-row justify-between">
        {/* Cancel Checkout button - only show if in checkout state */}
        {isCheckoutState && (
          <TouchableOpacity
            className="py-4 px-6 rounded-xl bg-red-500 mr-2 flex-1"
            onPress={cancelCheckout}
            disabled={cancelLoading}
          >
            {cancelLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View className="flex-row justify-center items-center">
                <X size={18} color="white" className="mr-2" />
                <Text className="text-white text-center font-bold text-lg">
                  Hủy Checkout
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* Main action button */}
        <TouchableOpacity
          className={`py-4 px-6 rounded-xl ${
            isCheckoutState ? "flex-1" : "w-full"
          } ${
            orderItems.length === 0 ||
            checkingOut ||
            cancelLoading ||
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
            cancelLoading ||
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
    </View>
  );
}
