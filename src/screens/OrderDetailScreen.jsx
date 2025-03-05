import { useState, useEffect } from "react";
import { SafeAreaView, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LoadingScreen from "./LoadingScreen";
import { PAYMENT_STATUS } from "../base/constant";
import OrderItemList from "../components/OrderDetail/OrderItemList";
import TotalAndCheckout from "../components/OrderDetail/TotalAndCheckout";
import Header from "../components/Header";

const API_URL = "https://vietsac.id.vn/pizza-service";

export default function TableDetailsScreen() {
  const [orderItems, setOrderItems] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { currentOrderId, code } = route.params;

  useEffect(() => {
    fetchOrderItems();
    const unsubscribe = navigation.addListener("focus", fetchOrderItems);
    return unsubscribe;
  }, [navigation]);

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
        axios.get(`${API_URL}/api/orders/${currentOrderId}`),
      ]);

      setOrderItems(itemsResponse.data.result.items);
      setOrder(orderResponse.data.result);
      setError(null);
    } catch (err) {
      setError("Bàn chưa có đơn hàng nào!");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckingOut(true);
      const response = await axios.put(
        `${API_URL}/api/orders/check-out-order/${currentOrderId}`
      );
      if (response.data.success) {
        Alert.alert("Thành công", "Checkout thành công");
        setOrder({ ...order, status: PAYMENT_STATUS.CHECKOUT });
      } else {
        throw new Error(response.data.message || "Thanh toán thất bại");
      }
    } catch (err) {
      Alert.alert(
        "Lỗi",
        err.message || "Không thể thanh toán. Vui lòng thử lại."
      );
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
          <TotalAndCheckout
            order={order}
            orderItems={orderItems}
            checkingOut={checkingOut}
            onCheckout={handleCheckout}
            onPayment={handlePayment}
          />
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}
