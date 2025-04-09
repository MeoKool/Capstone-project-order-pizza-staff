import { View, Text, TouchableOpacity } from "react-native";
import { PAYMENT_STATUS } from "../../base/constant";
// Import the calculation function from the utility file
import { calculateTotalAmount } from "./total-utils";

// Re-export the function for backward compatibility
export { calculateTotalAmount };

export default function TotalAndCheckout({
  order,
  orderItems = [],
  checkingOut,
  onCheckout,
  onPayment,
}) {
  // Use the backend-calculated total if available, otherwise fallback to empty order
  const totalAmount = order?.totalPrice || 0;

  return (
    <View className="absolute bottom-0 left-0 right-0 p-4 bg-[#feb47b] backdrop-blur-sm">
      {/* Show additional fees if they exist */}
      {order?.additionalFees && order.additionalFees.length > 0 && (
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

      {/* Show subtotal if we have additional fees */}
      {order?.totalOrderItemPrice && order?.additionalFees?.length > 0 && (
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-black font-medium">Tổng tiền món:</Text>
          <Text className="text-black font-medium">
            {order.totalOrderItemPrice.toLocaleString("vi-VN")} VNĐ
          </Text>
        </View>
      )}

      {/* Total amount */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-black font-medium text-lg">Tổng tiền:</Text>
        <Text className="text-black font-bold text-xl">
          {totalAmount.toLocaleString("vi-VN")} VNĐ
        </Text>
      </View>

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
