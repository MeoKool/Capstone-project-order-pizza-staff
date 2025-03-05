"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import {
  ChevronLeft,
  CreditCard,
  Banknote,
  Check,
  RefreshCw,
} from "lucide-react-native";
import axios from "axios";
import { calculateTotalAmount } from "../components/OrderDetail/TotalAndCheckout";

const { width } = Dimensions.get("window");

export default function QRCodePaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId, orderItems = [] } = route.params;
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("qr"); // 'qr' or 'cash'
  const [paymentStatus, setPaymentStatus] = useState("pending"); // 'pending', 'processing', 'completed'

  const totalAmount = calculateTotalAmount(orderItems);

  useEffect(() => {
    const createPaymentQRCode = async () => {
      try {
        const response = await axios.post(
          `https://vietsac.id.vn/pizza-service/api/payments/create-payment-qrcode/${orderId}`
        );
        setPaymentData(response.data.result);
      } catch (error) {
        console.error("Error creating payment QR code:", error);
        Alert.alert("Lỗi", "Không thể tạo mã QR thanh toán. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    createPaymentQRCode();
  }, [orderId]);

  const handleCashPayment = async () => {
    try {
      setPaymentStatus("processing");
      await axios.post(
        `https://vietsac.id.vn/pizza-service/api/payments/pay-order-by-cash/${orderId}`
      );
      setPaymentStatus("completed");
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error("Error processing cash payment:", error);
      setPaymentStatus("pending");
      Alert.alert(
        "Lỗi",
        "Không thể xử lý thanh toán tiền mặt. Vui lòng thử lại."
      );
    }
  };

  const refreshQRCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://vietsac.id.vn/pizza-service/api/payments/create-payment-qrcode/${orderId}`
      );
      setPaymentData(response.data.result);
    } catch (error) {
      console.error("Error refreshing payment QR code:", error);
      Alert.alert(
        "Lỗi",
        "Không thể làm mới mã QR thanh toán. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return amount ? amount.toLocaleString("vi-VN") : "0";
  };

  return (
    <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-row items-center mb-4 px-4 pt-2">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4 p-2.5 bg-white/20 rounded-xl"
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Thanh Toán</Text>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center items-center px-4">
            {/* Payment Method Selector */}
            <View className="flex-row bg-white/20 rounded-xl p-1 mb-6 w-full max-w-xs">
              <TouchableOpacity
                onPress={() => setPaymentMethod("qr")}
                className={`flex-1 py-3 rounded-lg flex-row justify-center items-center ${
                  paymentMethod === "qr" ? "bg-white" : ""
                }`}
              >
                <CreditCard
                  size={18}
                  color={paymentMethod === "qr" ? "#f26b0f" : "white"}
                  className="mr-2"
                />
                <Text
                  className={`font-medium ${
                    paymentMethod === "qr" ? "text-[#f26b0f]" : "text-white"
                  }`}
                >
                  QR Code
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setPaymentMethod("cash")}
                className={`flex-1 py-3 rounded-lg flex-row justify-center items-center ${
                  paymentMethod === "cash" ? "bg-white" : ""
                }`}
              >
                <Banknote
                  size={18}
                  color={paymentMethod === "cash" ? "#f26b0f" : "white"}
                  className="mr-2"
                />
                <Text
                  className={`font-medium ${
                    paymentMethod === "cash" ? "text-[#f26b0f]" : "text-white"
                  }`}
                >
                  Tiền Mặt
                </Text>
              </TouchableOpacity>
            </View>

            {/* Payment Amount */}
            <View className="bg-white/20 rounded-xl p-4 mb-6 w-full">
              <Text className="text-white text-base text-center mb-1">
                Tổng tiền thanh toán
              </Text>
              <Text className="text-white text-4xl font-bold text-center">
                {totalAmount.toLocaleString("vi-VN")} VNĐ
              </Text>
            </View>

            {/* QR Code Payment */}
            {paymentMethod === "qr" && (
              <View className="items-center">
                <Text className="text-white text-xl mb-4">
                  Quét mã QR để thanh toán
                </Text>
                <View className="bg-white p-6 rounded-xl mb-4 items-center">
                  {loading ? (
                    <ActivityIndicator
                      size="large"
                      color="#f26b0f"
                      style={{ height: 250, width: 250 }}
                    />
                  ) : (
                    <>
                      <QRCode value={paymentData} size={250} />
                      <TouchableOpacity
                        onPress={refreshQRCode}
                        className="absolute top-3 right-2 bg-gray-100 p-2 rounded-full"
                      >
                        <RefreshCw size={16} color="#f26b0f" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            )}

            {/* Cash Payment */}
            {paymentMethod === "cash" && (
              <View className="items-center w-full">
                <View className="bg-white/20 rounded-xl p-6 mb-6 w-full">
                  <Text className="text-white text-center text-lg mb-4">
                    Xác nhận thanh toán bằng tiền mặt
                  </Text>

                  {paymentStatus === "pending" && (
                    <TouchableOpacity
                      onPress={handleCashPayment}
                      className="bg-white py-3 px-6 rounded-xl w-full items-center"
                      activeOpacity={0.7}
                    >
                      <Text className="text-[#ff7e5f] text-lg font-bold">
                        Xác nhận thanh toán
                      </Text>
                    </TouchableOpacity>
                  )}

                  {paymentStatus === "processing" && (
                    <View className="bg-white/30 py-3 px-6 rounded-xl w-full items-center flex-row justify-center">
                      <ActivityIndicator
                        size="small"
                        color="white"
                        className="mr-2"
                      />
                      <Text className="text-white text-lg">Đang xử lý...</Text>
                    </View>
                  )}

                  {paymentStatus === "completed" && (
                    <View className="bg-green-500 py-3 px-6 rounded-xl w-full items-center flex-row justify-center">
                      <Check size={20} color="white" className="mr-2" />
                      <Text className="text-white text-lg font-bold">
                        Thanh toán thành công
                      </Text>
                    </View>
                  )}
                </View>

                <Text className="text-white text-sm text-center">
                  Vui lòng xác nhận khi đã nhận đủ số tiền từ khách hàng
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
