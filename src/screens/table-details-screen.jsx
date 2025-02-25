import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { ChevronLeft } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import LoadingScreen from "./LoadingScreen";
import { PAYMENT_STATUS } from "../base/constant";

const API_URL = "https://vietsac.id.vn/pizza-service";

export default function TableDetailsScreen() {
  const [orderItems, setOrderItems] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const navigation = useNavigation();
  const route = useRoute();
  const { currentOrderId, code } = route.params;

  useEffect(() => {
    fetchOrderItems();
    const unsubscribe = navigation.addListener("focus", fetchOrderItems);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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

  const renderOrderItem = ({ item, index }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          },
        ],
      }}
    >
      <View className="bg-white rounded-lg p-4 mb-3 shadow-md relative">
        {/* Status Badge - Moved to top right */}
        <View className="absolute top-4 right-4 bg-gray-100 rounded-full px-3 py-1">
          <Text
            className="text-sm font-medium"
            style={{
              color: item.orderItemStatus === "Done" ? "#22c55e" : "#eab308",
            }}
          >
            {item.orderItemStatus === "Done" ? "Hoàn thành" : "Đang chuẩn bị"}
          </Text>
        </View>

        {/* Main content */}
        <Text className="text-lg font-semibold text-gray-800 pr-32">
          {item.name}
        </Text>
        <View className="flex-row justify-between mt-2">
          <Text className="text-sm text-gray-600">
            Số lượng: {item.quantity}
          </Text>
          <Text className="text-sm text-gray-600">
            {item.price.toLocaleString("vi-VN")} VNĐ
          </Text>
        </View>

        {item.orderItemDetails && item.orderItemDetails.length > 0 && (
          <View className="mt-2">
            <Text className="text-sm font-medium text-gray-700">Tùy chọn:</Text>
            {item.orderItemDetails.map((detail, index) => (
              <View key={detail.id} className="flex-row justify-between mt-1">
                <Text className="text-xs text-gray-600">{detail.name}</Text>
                <Text className="text-xs text-gray-600">
                  +{detail.additionalPrice.toLocaleString("vi-VN")} VNĐ
                </Text>
              </View>
            ))}
            <View className="h-px bg-gray-200 my-2" />
            <Text className="text-sm font-medium text-gray-700">
              Tổng: {item.totalPrice.toLocaleString("vi-VN")} VNĐ
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  if (loading) {
    return (
      <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 justify-center items-center">
          <LoadingScreen />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const handlePayment = () => {
    navigation.navigate("QRCodePayment", {
      orderId: currentOrderId,
      totalAmount: order.totalPrice,
    });
  };

  return (
    <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={{ flex: 1 }}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-row items-center mb-6 px-4 pt-2">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4 p-2.5 bg-white/20 rounded-xl"
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">
            Chi tiết bàn {code}
          </Text>
        </View>

        {error ? (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-white text-lg text-center mb-4">{error}</Text>
            <TouchableOpacity
              className="bg-white rounded-xl py-3 px-6 shadow-lg"
              onPress={fetchOrderItems}
              activeOpacity={0.7}
            >
              <Text className="text-[#ff7e5f] font-bold">Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {loading ? (
              <LoadingScreen />
            ) : (
              <FlatList
                data={orderItems}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingBottom: 100,
                  flexGrow: 1,
                }}
                ListEmptyComponent={
                  <View className="flex-1 justify-center items-center p-4">
                    <Text className="text-white text-lg text-center mb-4">
                      Bàn chưa có đơn hàng nào!
                    </Text>
                  </View>
                }
              />
            )}
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-white/10 backdrop-blur-sm">
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
                    ? handlePayment
                    : handleCheckout
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
          </>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
