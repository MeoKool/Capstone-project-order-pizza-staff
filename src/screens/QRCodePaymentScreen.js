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
  X,
} from "lucide-react-native";
import axios from "axios";
import { calculateTotalAmount } from "../components/OrderDetail/total-utils";
// Update the import to use the utility file

const { width } = Dimensions.get("window");
const API_URL = "https://vietsac.id.vn";

export default function QRCodePaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId, orderItems = [] } = route.params;
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("qr"); // 'qr' or 'cash'
  const [paymentStatus, setPaymentStatus] = useState("pending"); // 'pending', 'processing', 'completed'
  const [order, setOrder] = useState(null);
  const [cancellingPayment, setCancellingPayment] = useState(false);
  const [error, setError] = useState(null);

  // Use backend total if available, otherwise calculate from items
  const totalAmount = order?.totalPrice || calculateTotalAmount(orderItems);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch order details to get the backend-calculated total
        const orderResponse = await axios.get(
          `${API_URL}/api/orders/${orderId}?includeProperties=OrderItems%2CAdditionalFees`
        );
        setOrder(orderResponse.data.result);

        // Create payment QR code
        try {
          const qrResponse = await axios.post(
            `${API_URL}/api/payments/create-payment-qrcode/${orderId}`
          );
          setPaymentData(qrResponse.data.result);
        } catch (qrError) {
          console.error("QR code generation error:", qrError);

          // Just pass the error directly from backend
          if (qrError.response && qrError.response.data) {
            setError(qrError.response.data.error.message);
            Alert.alert(
              "Lỗi",
              qrError.response.data.error.message ||
                "Không thể tạo mã QR thanh toán"
            );
          } else {
            Alert.alert(
              "Lỗi",
              qrError.message || "Không thể tạo mã QR thanh toán"
            );
          }
        }
      } catch (error) {
        console.error("Error initializing payment:", error);

        // Just pass the error directly from backend
        if (error.response && error.response.data) {
          setError(error.response.data);
          Alert.alert(
            "Lỗi",
            error.response.data.error.message || "Không thể khởi tạo thanh toán"
          );
        } else {
          Alert.alert("Lỗi", error.message || "Không thể khởi tạo thanh toán");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const handleCashPayment = async () => {
    try {
      setPaymentStatus("processing");
      setError(null);

      await axios.post(`${API_URL}/api/payments/pay-order-by-cash/${orderId}`);
      setPaymentStatus("completed");
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error("Cash payment error:", error);
      setPaymentStatus("pending");

      // Just pass the error directly from backend
      if (error.response && error.response.data) {
        setError(error.response.data);
        Alert.alert(
          "Lỗi",
          error.response.data.message || "Không thể xử lý thanh toán tiền mặt"
        );
      } else {
        Alert.alert(
          "Lỗi",
          error.message || "Không thể xử lý thanh toán tiền mặt"
        );
      }
    }
  };

  const refreshQRCode = async () => {
    setLoading(true);
    setError(null);

    try {
      // Refresh order details
      const orderResponse = await axios.get(`${API_URL}/api/orders/${orderId}`);
      setOrder(orderResponse.data.result);

      // Refresh QR code
      const response = await axios.post(
        `${API_URL}/api/payments/create-payment-qrcode/${orderId}`
      );
      setPaymentData(response.data.result);
    } catch (error) {
      console.error("Error refreshing payment QR code:", error);

      // Just pass the error directly from backend
      if (error.response && error.response.data) {
        setError(error.response.data);
        Alert.alert(
          "Lỗi",
          error.response.data.error.message ||
            "Không thể làm mới mã QR thanh toán"
        );
      } else {
        Alert.alert(
          "Lỗi",
          error.message || "Không thể làm mới mã QR thanh toán"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPayment = async () => {
    Alert.alert("Xác nhận hủy", "Bạn có chắc chắn muốn hủy thanh toán này?", [
      {
        text: "Không",
        style: "cancel",
      },
      {
        text: "Có, hủy thanh toán",
        onPress: async () => {
          try {
            setCancellingPayment(true);
            setError(null);

            const response = await axios.post(
              `${API_URL}/api/payments/cancel-payment-qrcode/${orderId}`
            );

            if (response.data.success) {
              Alert.alert("Thành công", "Đã hủy thanh toán thành công");
              navigation.goBack();
            } else {
              throw new Error(
                response.data.message || "Không thể hủy thanh toán"
              );
            }
          } catch (error) {
            console.error("Cancel payment error:", error);

            // Just pass the error directly from backend
            if (error.response && error.response.data) {
              setError(error.response.data);
              Alert.alert(
                "Lỗi",
                error.response.data.message || "Không thể hủy thanh toán"
              );
            } else {
              Alert.alert("Lỗi", error.message || "Không thể hủy thanh toán");
            }
          } finally {
            setCancellingPayment(false);
          }
        },
      },
    ]);
  };

  // Function to handle returning to order screen to fix voucher issues
  const handleFixVoucher = () => {
    navigation.goBack();
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
                  ) : error ? (
                    <View className="h-250 w-250 items-center justify-center">
                      <X size={64} color="#f26b0f" />
                      <Text className="text-red-500 text-center mt-4 font-medium">
                        {error.message || "Không thể tạo mã QR"}
                      </Text>
                    </View>
                  ) : !paymentData ? (
                    <View className="h-250 w-250 items-center justify-center">
                      <X size={64} color="#f26b0f" />
                      <Text className="text-red-500 text-center mt-4 font-medium">
                        Không thể tạo mã QR
                      </Text>
                    </View>
                  ) : (
                    <>
                      <QRCode value={paymentData} size={250} />
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
                      disabled={!!error}
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

            {/* Cancel Payment Button */}
            {paymentStatus !== "completed" && (
              <TouchableOpacity
                onPress={handleCancelPayment}
                disabled={cancellingPayment}
                className="bg-red-500 py-3 px-6 rounded-xl mt-6 flex-row items-center"
                activeOpacity={0.7}
              >
                {cancellingPayment ? (
                  <ActivityIndicator
                    size="small"
                    color="white"
                    className="mr-2"
                  />
                ) : (
                  <X size={20} color="white" className="mr-2" />
                )}
                <Text className="text-white font-bold">
                  {cancellingPayment ? "Đang hủy..." : "Hủy thanh toán"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
