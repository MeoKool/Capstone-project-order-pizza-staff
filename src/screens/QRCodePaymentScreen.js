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
const API_URL = "https://vietsac.id.vn/pizza-service";

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

          // Extract detailed error message from response
          let errorMessage = "Không thể tạo mã QR thanh toán.";

          if (qrError.response && qrError.response.data) {
            const errorData = qrError.response.data;
            if (errorData.error && errorData.message) {
              errorMessage = errorData.message;

              // Check for specific error codes
              if (errorData.code === 1003) {
                // This is the voucher invalid error
                setError({
                  title: "Lỗi voucher",
                  message: errorMessage,
                  type: "voucher",
                });
              } else {
                setError({
                  title: "Lỗi thanh toán",
                  message: errorMessage,
                  type: "payment",
                });
              }
            }
          }

          Alert.alert("Lỗi", errorMessage);
        }
      } catch (error) {
        console.error("Error initializing payment:", error);

        let errorMessage = "Không thể khởi tạo thanh toán. Vui lòng thử lại.";

        if (error.response && error.response.data) {
          const errorData = error.response.data;
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        }

        setError({
          title: "Lỗi kết nối",
          message: errorMessage,
          type: "connection",
        });

        Alert.alert("Lỗi", errorMessage);
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

      try {
        await axios.post(
          `${API_URL}/api/payments/pay-order-by-cash/${orderId}`
        );
        setPaymentStatus("completed");
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } catch (payError) {
        console.error("Cash payment error:", payError);

        let errorMessage = "Không thể xử lý thanh toán tiền mặt.";

        if (payError.response && payError.response.data) {
          const errorData = payError.response.data;
          if (errorData.message) {
            errorMessage = errorData.message;

            // Check for specific error codes
            if (errorData.code === 1003) {
              // This is the voucher invalid error
              setError({
                title: "Lỗi voucher",
                message: errorMessage,
                type: "voucher",
              });
            } else {
              setError({
                title: "Lỗi thanh toán",
                message: errorMessage,
                type: "payment",
              });
            }
          }
        }

        Alert.alert("Lỗi", errorMessage);
        setPaymentStatus("pending");
      }
    } catch (error) {
      console.error("Error in cash payment flow:", error);
      setPaymentStatus("pending");
      Alert.alert(
        "Lỗi",
        "Không thể xử lý thanh toán tiền mặt. Vui lòng thử lại."
      );
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
      try {
        const response = await axios.post(
          `${API_URL}/api/payments/create-payment-qrcode/${orderId}`
        );
        setPaymentData(response.data.result);
      } catch (qrError) {
        console.error("QR refresh error:", qrError);

        let errorMessage = "Không thể làm mới mã QR thanh toán.";

        if (qrError.response && qrError.response.data) {
          const errorData = qrError.response.data;
          if (errorData.message) {
            errorMessage = errorData.message;

            // Check for specific error codes
            if (errorData.code === 1003) {
              // This is the voucher invalid error
              setError({
                title: "Lỗi voucher",
                message: errorMessage,
                type: "voucher",
              });
            } else {
              setError({
                title: "Lỗi thanh toán",
                message: errorMessage,
                type: "payment",
              });
            }
          }
        }

        Alert.alert("Lỗi", errorMessage);
      }
    } catch (error) {
      console.error("Error refreshing payment QR code:", error);

      let errorMessage = "Không thể làm mới mã QR thanh toán.";

      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      }

      setError({
        title: "Lỗi kết nối",
        message: errorMessage,
        type: "connection",
      });

      Alert.alert("Lỗi", errorMessage);
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

            // Call the cancel payment API
            try {
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
            } catch (cancelError) {
              console.error("Cancel payment error:", cancelError);

              let errorMessage = "Không thể hủy thanh toán.";

              if (cancelError.response && cancelError.response.data) {
                const errorData = cancelError.response.data;
                if (errorData.message) {
                  errorMessage = errorData.message;
                }
              } else if (cancelError.message) {
                errorMessage = cancelError.message;
              }

              setError({
                title: "Lỗi hủy thanh toán",
                message: errorMessage,
                type: "cancel",
              });

              Alert.alert("Lỗi", errorMessage);
            }
          } catch (error) {
            console.error("Error in cancel payment flow:", error);

            let errorMessage = "Không thể hủy thanh toán. Vui lòng thử lại.";

            if (error.response && error.response.data) {
              errorMessage = error.response.data.message || errorMessage;
            } else if (error.message) {
              errorMessage = error.message;
            }

            Alert.alert("Lỗi", errorMessage);
          } finally {
            setCancellingPayment(false);
          }
        },
      },
    ]);
  };

  // Function to handle returning to order screen to fix voucher issues
  const handleFixVoucher = () => {
    Alert.alert(
      "Lỗi voucher",
      "Bạn cần quay lại màn hình đơn hàng để kiểm tra lại voucher đã áp dụng.",
      [
        {
          text: "Quay lại đơn hàng",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center items-center px-4">
            {/* Error Display */}
            {error && (
              <View className="bg-red-100 border border-red-400 rounded-lg p-4 mb-6 w-full">
                <Text className="text-red-800 font-bold text-lg mb-1">
                  {error.title}
                </Text>
                <Text className="text-red-700">{error.message}</Text>

                {error.type === "voucher" && (
                  <TouchableOpacity
                    onPress={handleFixVoucher}
                    className="bg-red-500 py-2 px-4 rounded-lg mt-3 self-start"
                  >
                    <Text className="text-white font-medium">
                      Kiểm tra voucher
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

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
                  ) : error && error.type === "voucher" ? (
                    <View className="h-250 w-250 items-center justify-center">
                      <X size={64} color="#f26b0f" />
                      <Text className="text-red-500 text-center mt-4 font-medium">
                        Không thể tạo mã QR do lỗi voucher
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
                      disabled={error && error.type === "voucher"}
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
