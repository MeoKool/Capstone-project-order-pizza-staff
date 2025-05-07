"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
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
import ErrorModal from "../components/ErrorModal";

const { width } = Dimensions.get("window");
const API_URL = "https://vietsac.id.vn";

export default function QRCodePaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId, orderItems = [] } = route.params;
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(null); // Start with no method selected
  const [paymentStatus, setPaymentStatus] = useState("pending"); // 'pending', 'processing', 'completed'
  const [order, setOrder] = useState(null);
  const [cancellingPayment, setCancellingPayment] = useState(false);
  const [error, setError] = useState(null);
  const [switchingMethod, setSwitchingMethod] = useState(false);

  // Add the following state variables after the other state declarations (around line 40)
  const [splitBillModalVisible, setSplitBillModalVisible] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState("2");
  const [amountPerPerson, setAmountPerPerson] = useState(0);

  // Error modal states
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalTitle, setErrorModalTitle] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [errorModalIsSuccess, setErrorModalIsSuccess] = useState(false);
  const [errorModalCallback, setErrorModalCallback] = useState(() => {});
  const [errorModalIsWarning, setErrorModalIsWarning] = useState(false);
  const [errorModalCancelText, setErrorModalCancelText] = useState("Hủy");
  const [errorModalOnCancel, setErrorModalOnCancel] = useState(() => {});

  // Use backend total if available, otherwise calculate from items
  const totalAmount = order?.totalPrice || calculateTotalAmount(orderItems);

  // Helper function to show error modal
  const showErrorModal = (
    title,
    message,
    isSuccess = false,
    callback = () => {}
  ) => {
    setErrorModalTitle(title);
    setErrorModalMessage(message);
    setErrorModalIsSuccess(isSuccess);
    setErrorModalIsWarning(false);
    setErrorModalCallback(() => callback);
    setErrorModalVisible(true);
  };

  // Helper function to show confirmation modal
  const showConfirmationModal = (
    title,
    message,
    onConfirm,
    cancelText = "Hủy"
  ) => {
    setErrorModalTitle(title);
    setErrorModalMessage(message);
    setErrorModalIsSuccess(false);
    setErrorModalIsWarning(true);
    setErrorModalCallback(() => onConfirm);
    setErrorModalCancelText(cancelText);
    setErrorModalOnCancel(() => {});
    setErrorModalVisible(true);
  };

  // Helper function to close error modal and execute callback
  const closeErrorModal = () => {
    setErrorModalVisible(false);
    errorModalCallback();
  };

  // Helper function to cancel modal action
  const cancelModalAction = () => {
    setErrorModalVisible(false);
    errorModalOnCancel();
  };

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

        // Don't automatically create QR code here anymore
        setLoading(false);
      } catch (error) {
        console.error("Error initializing payment:", error);

        // Just pass the error directly from backend
        if (error.response && error.response.data) {
          setError(error.response.data);
          showErrorModal(
            "Lỗi",
            error.response.data.error?.message ||
              "Không thể khởi tạo thanh toán"
          );
        } else {
          showErrorModal(
            "Lỗi",
            error.message || "Không thể khởi tạo thanh toán"
          );
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const cancelQRPayment = async () => {
    try {
      setSwitchingMethod(true);
      setError(null);

      const response = await axios.post(
        `${API_URL}/api/payments/cancel-payment-qrcode/${orderId}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Không thể hủy thanh toán QR");
      }

      // Clear any existing QR data
      setPaymentData(null);

      return true;
    } catch (error) {
      console.error("Cancel QR payment error:", error);

      // Just pass the error directly from backend
      if (error.response && error.response.data) {
        setError(error.response.data);
        showErrorModal(
          "Lỗi",
          error.response.data.message || "Không thể hủy thanh toán QR"
        );
      } else {
        showErrorModal("Lỗi", error.message || "Không thể hủy thanh toán QR");
      }
      return false;
    } finally {
      setSwitchingMethod(false);
    }
  };

  const handlePaymentMethodSelect = async (method) => {
    // If already on this method, do nothing
    if (method === paymentMethod) return;

    // If switching to cash and we have QR payment data, cancel it first
    if (method === "cash" && paymentData) {
      const cancelled = await cancelQRPayment();
      if (!cancelled) return; // Don't proceed if cancellation failed
    }

    setPaymentMethod(method);

    if (method === "qr") {
      try {
        setLoading(true);
        setError(null);

        // Create payment QR code
        const qrResponse = await axios.post(
          `${API_URL}/api/payments/create-payment-qrcode/${orderId}`
        );
        setPaymentData(qrResponse.data.result);
      } catch (qrError) {
        console.error("QR code generation error:", qrError);

        // Just pass the error directly from backend
        if (qrError.response && qrError.response.data) {
          setError(qrError.response.data.error?.message);
          showErrorModal(
            "Lỗi",
            qrError.response.data.error?.message ||
              "Không thể tạo mã QR thanh toán"
          );
        } else {
          showErrorModal(
            "Lỗi",
            qrError.message || "Không thể tạo mã QR thanh toán"
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

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
        showErrorModal(
          "Lỗi",
          error.response.data.message || "Không thể xử lý thanh toán tiền mặt"
        );
      } else {
        showErrorModal(
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
        showErrorModal(
          "Lỗi",
          error.response.data.error?.message ||
            "Không thể làm mới mã QR thanh toán"
        );
      } else {
        showErrorModal(
          "Lỗi",
          error.message || "Không thể làm mới mã QR thanh toán"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPayment = async () => {
    showConfirmationModal(
      "Xác nhận hủy",
      "Bạn có chắc chắn muốn hủy thanh toán này?",
      async () => {
        try {
          setCancellingPayment(true);
          setError(null);

          const response = await axios.post(
            `${API_URL}/api/payments/cancel-payment-qrcode/${orderId}`
          );

          if (response.data.success) {
            showErrorModal(
              "Thành công",
              "Đã hủy thanh toán thành công",
              true,
              () => {
                navigation.goBack();
              }
            );
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
            showErrorModal(
              "Lỗi",
              error.response.data.message || "Không thể hủy thanh toán"
            );
          } else {
            showErrorModal("Lỗi", error.message || "Không thể hủy thanh toán");
          }
        } finally {
          setCancellingPayment(false);
        }
      }
    );
  };

  // Function to handle returning to order screen to fix voucher issues
  const handleFixVoucher = () => {
    navigation.goBack();
  };

  // Add the following function before the return statement
  const handleSplitBill = () => {
    setSplitBillModalVisible(true);
    // Initialize with default calculation for 2 people
    setAmountPerPerson(Math.ceil(totalAmount / 2));
  };

  const calculateSplitAmount = (people) => {
    const peopleNum = Number.parseInt(people, 10);
    if (peopleNum > 0) {
      return Math.ceil(totalAmount / peopleNum);
    }
    return 0;
  };

  const handleNumberOfPeopleChange = (value) => {
    setNumberOfPeople(value);
    setAmountPerPerson(calculateSplitAmount(value));
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
                onPress={() => handlePaymentMethodSelect("qr")}
                disabled={loading || switchingMethod}
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
                onPress={() => handlePaymentMethodSelect("cash")}
                disabled={loading || switchingMethod}
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

            {/* Split Bill Button */}
            <TouchableOpacity
              onPress={handleSplitBill}
              className="bg-white/20 rounded-xl p-4 mb-6 w-full flex-row justify-center items-center"
              activeOpacity={0.7}
            >
              <Text className="text-white text-lg font-medium">Chia Bill</Text>
            </TouchableOpacity>

            {/* Loading indicator when switching payment methods */}
            {switchingMethod && (
              <View className="items-center mb-6">
                <ActivityIndicator size="large" color="white" />
                <Text className="text-white mt-2">
                  Đang chuyển phương thức thanh toán...
                </Text>
              </View>
            )}

            {/* Prompt to select payment method if none selected */}
            {!paymentMethod && !loading && !switchingMethod && (
              <View className="items-center mb-6">
                <Text className="text-white text-xl text-center">
                  Vui lòng chọn phương thức thanh toán ở trên
                </Text>
              </View>
            )}

            {/* QR Code Payment */}
            {paymentMethod === "qr" && !switchingMethod && (
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
                      <TouchableOpacity
                        onPress={refreshQRCode}
                        className="mt-4 bg-[#f26b0f] py-2 px-4 rounded-lg flex-row items-center"
                      >
                        <RefreshCw size={16} color="white" className="mr-2" />
                        <Text className="text-white font-medium">Thử lại</Text>
                      </TouchableOpacity>
                    </View>
                  ) : !paymentData ? (
                    <View className="h-250 w-250 items-center justify-center">
                      <X size={64} color="#f26b0f" />
                      <Text className="text-red-500 text-center mt-4 font-medium">
                        Không thể tạo mã QR
                      </Text>
                      <TouchableOpacity
                        onPress={refreshQRCode}
                        className="mt-4 bg-[#f26b0f] py-2 px-4 rounded-lg flex-row items-center"
                      >
                        <RefreshCw size={16} color="white" className="mr-2" />
                        <Text className="text-white font-medium">Thử lại</Text>
                      </TouchableOpacity>
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
            {paymentMethod === "cash" && !switchingMethod && (
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
            {paymentStatus !== "completed" &&
              paymentMethod &&
              !switchingMethod && (
                <TouchableOpacity
                  onPress={handleCancelPayment}
                  disabled={cancellingPayment || switchingMethod}
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

        {/* Split Bill Modal */}
        <Modal
          visible={splitBillModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSplitBillModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-xl p-6 w-[90%] max-w-md">
              <Text className="text-xl font-bold text-center mb-4">
                Chia Bill
              </Text>

              <Text className="text-base mb-2">Số người:</Text>
              <View className="flex-row items-center mb-4">
                <TouchableOpacity
                  onPress={() => {
                    const newValue = Math.max(
                      1,
                      Number.parseInt(numberOfPeople, 10) - 1
                    );
                    handleNumberOfPeopleChange(newValue.toString());
                  }}
                  className="bg-gray-200 p-3 rounded-l-lg"
                >
                  <Text className="text-lg font-bold">-</Text>
                </TouchableOpacity>

                <TextInput
                  value={numberOfPeople}
                  onChangeText={(text) => {
                    // Only allow numbers
                    const numericValue = text.replace(/[^0-9]/g, "");
                    if (
                      numericValue === "" ||
                      Number.parseInt(numericValue, 10) === 0
                    ) {
                      handleNumberOfPeopleChange("1");
                    } else {
                      handleNumberOfPeopleChange(numericValue);
                    }
                  }}
                  keyboardType="numeric"
                  className="bg-gray-100 p-2 text-center text-lg w-16"
                />

                <TouchableOpacity
                  onPress={() => {
                    const newValue = Number.parseInt(numberOfPeople, 10) + 1;
                    handleNumberOfPeopleChange(newValue.toString());
                  }}
                  className="bg-gray-200 p-3 rounded-r-lg"
                >
                  <Text className="text-lg font-bold">+</Text>
                </TouchableOpacity>
              </View>

              <View className="bg-orange-100 p-4 rounded-lg mb-4">
                <Text className="text-base text-center">
                  Tổng tiền: {totalAmount.toLocaleString("vi-VN")} VNĐ
                </Text>
                <Text className="text-xl font-bold text-center text-orange-600 mt-2">
                  Mỗi người: {amountPerPerson.toLocaleString("vi-VN")} VNĐ
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setSplitBillModalVisible(false)}
                className="bg-orange-500 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-bold">Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Error Modal */}
        <ErrorModal
          visible={errorModalVisible}
          title={errorModalTitle}
          message={errorModalMessage}
          buttonText="OK"
          isSuccess={errorModalIsSuccess}
          isWarning={errorModalIsWarning}
          onClose={closeErrorModal}
          onCancel={errorModalIsWarning ? cancelModalAction : undefined}
          cancelText={errorModalCancelText}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
