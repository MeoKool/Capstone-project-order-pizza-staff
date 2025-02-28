import { View, Text, TouchableOpacity } from "react-native";
import { PAYMENT_STATUS } from "../../base/constant";

export default function TotalAndCheckout({
  order,
  orderItems,
  checkingOut,
  onCheckout,
  onPayment,
}) {
  return (
    <View className="absolute bottom-0 left-0 right-0 p-4 bg-[#feb47b] backdrop-blur-sm">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-black font-medium text-lg">Tổng tiền:</Text>
        <Text className="text-black font-bold text-xl">
          {order?.totalPrice?.toLocaleString("vi-VN") || 0} VNĐ
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
