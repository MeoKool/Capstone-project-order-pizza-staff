"use client";

import { useState, useEffect } from "react";
import { SafeAreaView, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LoadingScreen from "./LoadingScreen";
import OrderItemList from "../components/OrderDetail/OrderItemList";
import TotalAndCheckout from "../components/OrderDetail/TotalAndCheckout";
import Header from "../components/Header";
import { View } from "lucide-react-native";

const API_URL = "https://vietsac.id.vn/pizza-service";

export default function TableDetailsScreen() {
  const [orderItems, setOrderItems] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const { currentOrderId, code } = route.params;

  useEffect(() => {
    fetchOrderItems();
    const unsubscribe = navigation.addListener("focus", fetchOrderItems);
    return unsubscribe;
  }, [navigation]);

  // Update the fetchOrderItems function to properly set the applied voucher from the order data
  const fetchOrderItems = async () => {
    try {
      setLoading(true);
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

      // Check if there's an applied voucher directly from the order data
      if (
        orderResponse.data.result.orderVouchers &&
        orderResponse.data.result.orderVouchers.length > 0
      ) {
        const voucher = orderResponse.data.result.orderVouchers[0].voucher;
        if (voucher) {
          setAppliedVoucher(voucher);
        } else {
          setAppliedVoucher(null);
        }
      } else {
        setAppliedVoucher(null);
      }
    } catch (err) {
      setError("Bàn chưa có đơn hàng nào!");
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

        // Show success message
        Alert.alert("Thành công", "Checkout thành công");
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

      Alert.alert("Lỗi", errorMessage);
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

  const handleVoucherApplied = (voucher) => {
    setAppliedVoucher(voucher);
    fetchOrderItems(); // Refresh order data to get updated prices
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
          <OrderItemList
            orderItems={orderItems}
            error={error}
            onRetry={fetchOrderItems}
          />
          <View className="mb-6"></View>
          <TotalAndCheckout
            order={order}
            orderItems={orderItems}
            checkingOut={checkingOut}
            onCheckout={handleCheckout}
            onPayment={handlePayment}
            appliedVoucher={appliedVoucher}
            onVoucherApplied={handleVoucherApplied}
          />
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}
