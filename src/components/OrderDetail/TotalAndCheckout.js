"use client";

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import { PAYMENT_STATUS } from "../../base/constant";
import { Ticket, X, Plus } from "lucide-react-native";
import axios from "axios";
import { useState, useEffect } from "react";
// Import the calculation function from the utility file
import { calculateTotalAmount } from "./total-utils";
import CustomModal from "../CustomModal";

// Re-export the function for backward compatibility
export { calculateTotalAmount };

const API_URL = "https://vietsac.id.vn";

// Add a function to delete the voucher
const deleteVoucher = async (orderVoucherId, onSuccess, onError) => {
  try {
    const response = await axios.delete(
      `https://vietsac.id.vn/api/order-vouchers/${orderVoucherId}?isHardDeleted=false`
    );

    if (response.data.success) {
      onSuccess("Thành công", "Đã xóa mã giảm giá thành công");
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

    onError("Lỗi", errorMessage);
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

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "info",
    primaryButtonText: "Đóng",
    onPrimaryButtonPress: null,
    secondaryButtonText: null,
    onSecondaryButtonPress: null,
  });

  // Confirmation modal states
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });

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

  const showModal = (title, message, type = "info", options = {}) => {
    setModalConfig({
      title,
      message,
      type,
      primaryButtonText: options.primaryButtonText || "Đóng",
      onPrimaryButtonPress: options.onPrimaryButtonPress || null,
      secondaryButtonText: options.secondaryButtonText || null,
      onSecondaryButtonPress: options.onSecondaryButtonPress || null,
    });
    setModalVisible(true);
  };

  const showConfirmModal = (title, message, onConfirm) => {
    setConfirmModalConfig({
      title,
      message,
      onConfirm,
    });
    setConfirmModalVisible(true);
  };

  const applyVoucher = async () => {
    if (!voucherCode.trim()) {
      // Đóng modal voucher rồi báo lỗi
      setVoucherModalVisible(false);
      return showModal("Lỗi", "Vui lòng nhập mã voucher", "error");
    }

    try {
      setLoading(true);

      // 1) Validate code
      const { data: validateRes } = await axios.get(
        `${API_URL}/api/vouchers/get-by-code`,
        { params: { Code: voucherCode.trim() } }
      );
      if (!validateRes.success) {
        throw new Error(validateRes.error?.message);
      }
      const voucher = validateRes.result;

      if (voucher.voucherStatus !== "Available" || voucher.isUsed) {
        throw new Error("Mã voucher đã được sử dụng hoặc không khả dụng");
      }
      if (appliedVouchers.some((v) => v.id === voucher.id)) {
        throw new Error("Mã voucher này đã được áp dụng");
      }

      // 2) Apply voucher
      const { data: applyRes } = await axios.post(
        `${API_URL}/api/order-vouchers`,
        { orderId: order.id, voucherId: voucher.id }
      );
      if (!applyRes.success) {
        throw new Error(applyRes.error?.message);
      }

      // Đóng modal nhập mã trước khi hiện thông báo
      setVoucherModalVisible(false);

      // Thêm voucher vào state
      const newVoucher = { ...voucher, orderVoucherId: applyRes.result.id };
      setAppliedVouchers((prev) => [...prev, newVoucher]);
      onVoucherApplied?.(newVoucher);

      // Chờ 40‑50 ms để modal trước hẳn đóng rồi mới show
      setTimeout(() => {
        showModal(
          "Thành công",
          `Đã áp dụng voucher ${
            voucher.discountType === "Percentage"
              ? `giảm ${voucher.discountValue}%`
              : `giảm ${voucher.discountValue.toLocaleString("vi-VN")} VNĐ`
          }`,
          "success"
        );
      }, 50);
    } catch (err) {
      // Đóng modal nhập mã trước khi show lỗi
      setVoucherModalVisible(false);

      const msg =
        err?.response?.data?.error?.message ||
        err?.message ||
        "Không thể áp dụng voucher. Vui lòng thử lại.";
      setTimeout(() => showModal("Lỗi", msg, "error"), 50);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVoucher = (voucher) => {
    if (voucher.orderVoucherId) {
      showConfirmModal(
        "Xác nhận xóa",
        `Bạn có chắc chắn muốn xóa voucher ${voucher.code}?`,
        () => {
          deleteVoucher(
            voucher.orderVoucherId,
            (title, message) => {
              // Success callback
              showModal(title, message, "success");

              // Remove the voucher from the local state
              setAppliedVouchers((prev) =>
                prev.filter((v) => v.id !== voucher.id)
              );

              // Notify parent to refresh order data
              if (onVoucherApplied) {
                onVoucherApplied(null);
              }
            },
            (title, message) => {
              // Error callback
              showModal(title, message, "error");
            }
          );
        }
      );
    }
  };

  const cancelCheckout = async () => {
    showConfirmModal(
      "Xác nhận hủy",
      "Bạn có chắc chắn muốn hủy checkout?",
      async () => {
        try {
          setCancelLoading(true);
          const response = await axios.put(
            `${API_URL}/api/orders/cancel-check-out/${order.id}`
          );

          if (!response.data.success) {
            throw new Error(response.data.message || "Không thể hủy checkout");
          }

          showModal("Thành công", "Đã hủy checkout thành công", "success");

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

          showModal("Lỗi", errorMessage, "error");
        } finally {
          setCancelLoading(false);
        }
      }
    );
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

      {/* Custom Modal */}
      <CustomModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalVisible(false)}
        primaryButtonText={modalConfig.primaryButtonText}
        onPrimaryButtonPress={
          modalConfig.onPrimaryButtonPress || (() => setModalVisible(false))
        }
        secondaryButtonText={modalConfig.secondaryButtonText}
        onSecondaryButtonPress={modalConfig.onSecondaryButtonPress}
        autoClose={modalConfig.type === "success"} // Auto close success messages
      />

      {/* Confirmation Modal */}
      <CustomModal
        visible={confirmModalVisible}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        type="warning"
        onClose={() => setConfirmModalVisible(false)}
        primaryButtonText="Xác nhận"
        onPrimaryButtonPress={() => {
          setConfirmModalVisible(false);
          if (confirmModalConfig.onConfirm) {
            confirmModalConfig.onConfirm();
          }
        }}
        secondaryButtonText="Hủy"
        onSecondaryButtonPress={() => setConfirmModalVisible(false)}
      />

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
