"use client";

import { useState, useEffect } from "react";
import { SafeAreaView, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LoadingScreen from "./LoadingScreen";
import OrderItemList from "../components/OrderDetail/OrderItemList";
import TotalAndCheckout from "../components/OrderDetail/TotalAndCheckout";
import Header from "../components/Header";
import ErrorModal from "../components/ErrorModal";

const API_URL = "https://vietsac.id.vn";

export default function TableDetailsScreen() {
  const [orderItems, setOrderItems] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [tableId, setTableId] = useState(null);

  // Error modal states
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalTitle, setErrorModalTitle] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [errorModalIsSuccess, setErrorModalIsSuccess] = useState(false);
  const [errorModalCallback, setErrorModalCallback] = useState(() => {});

  const navigation = useNavigation();
  const route = useRoute();
  const { currentOrderId, code, tableId: routeTableId } = route.params;

  useEffect(() => {
    // Set tableId from route params if available
    if (routeTableId) {
      console.log("Table ID from route:", routeTableId);
      setTableId(routeTableId);
    } else {
      // If tableId is not provided in route params, try to fetch it
      fetchTableId();
    }

    fetchOrderItems();
    const unsubscribe = navigation.addListener("focus", fetchOrderItems);
    return unsubscribe;
  }, [navigation, routeTableId]);

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
    setErrorModalCallback(() => callback);
    setErrorModalVisible(true);
  };

  // Helper function to close error modal and execute callback
  const closeErrorModal = () => {
    setErrorModalVisible(false);
    errorModalCallback();
  };

  const fetchTableId = async () => {
    try {
      // Try to get table ID by code if not provided directly
      const response = await axios.get(`${API_URL}/api/tables`, {
        params: { Code: code },
      });

      if (response.data.success && response.data.result.items.length > 0) {
        const id = response.data.result.items[0].id;
        console.log("Fetched table ID:", id);
        setTableId(id);
      }
    } catch (err) {
      console.error("Error fetching table ID:", err);
    }
  };

  const fetchOrderItems = async () => {
    try {
      setLoading(true);
      if (currentOrderId) {
        const [itemsResponse, orderResponse] = await Promise.all([
          axios.get(`${API_URL}/api/order-items`, {
            params: {
              OrderId: currentOrderId,
              IncludeProperties: "OrderItemDetails",
            },
          }),
          axios.get(
            `${API_URL}/api/orders/${currentOrderId}?includeProperties=OrderItems%2CAdditionalFees%2COrderVouchers.Voucher`
          ),
        ]);

        setOrderItems(itemsResponse.data.result.items);
        setOrder(orderResponse.data.result);
        setError(null);
      } else {
        setOrderItems([]);
        setOrder(null);
      }
    } catch (err) {
      setOrderItems([]);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckingOut(true);

      // Make the checkout API call
      const checkoutResponse = await axios.put(
        `${API_URL}/api/orders/check-out-order/${currentOrderId}`
      );

      if (checkoutResponse.data.success) {
        // Immediately fetch the updated order with fees
        const orderResponse = await axios.get(
          `${API_URL}/api/orders/${currentOrderId}?includeProperties=OrderItems%2CAdditionalFees`
        );

        // Update the order state with the new data that includes fees
        setOrder(orderResponse.data.result);

        // Show success message using ErrorModal instead of Alert
        showErrorModal("Thành công", "Checkout thành công", true);
      } else {
        throw new Error(checkoutResponse.data.message || "Thanh toán thất bại");
      }
    } catch (err) {
      // Extract error message from the response if available
      let errorMessage = "Không thể thanh toán. Vui lòng thử lại.";

      if (err.response && err.response.data) {
        // Handle the specific error structure from the backend
        const errorData = err.response.data;
        errorMessage = errorData.message || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Show error message using ErrorModal instead of Alert
      showErrorModal("Lỗi", errorMessage);
    } finally {
      setCheckingOut(false);
    }
  };

  const handlePayment = () => {
    navigation.navigate("QRCodePayment", {
      orderId: currentOrderId,
      orderItems: orderItems,
    });
  };

  const handleVoucherApplied = () => {
    // Just refresh the order data to get updated prices and voucher information
    fetchOrderItems();
  };

  if (loading) {
    return (
      <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 justify-center items-center">
          <LoadingScreen />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={{ flex: 1 }}>
        <StatusBar style="light" />
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            title={"Chi tiết bàn " + code}
            onBack={() => navigation.goBack()}
            navigation={navigation}
          />
          <View style={{ flex: 1 }}>
            <OrderItemList
              orderItems={orderItems}
              error={error}
              onRetry={fetchOrderItems}
              tableId={tableId}
              navigation={navigation}
            />
            {currentOrderId && (
              <TotalAndCheckout
                order={order}
                orderItems={orderItems}
                checkingOut={checkingOut}
                onCheckout={handleCheckout}
                onPayment={handlePayment}
                onVoucherApplied={handleVoucherApplied}
              />
            )}
          </View>

          {/* Error Modal */}
          <ErrorModal
            visible={errorModalVisible}
            title={errorModalTitle}
            message={errorModalMessage}
            buttonText="OK"
            isSuccess={errorModalIsSuccess}
            onClose={closeErrorModal}
          />
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}
