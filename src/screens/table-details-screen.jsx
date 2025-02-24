import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { ChevronLeft } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import LoadingScreen from "./LoadingScreen";

const API_URL = "https://vietsac.id.vn/pizza-service";

export default function TableDetailsScreen() {
  const [orderItems, setOrderItems] = useState([]);
  const [Order, setOrder] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { currentOrderId } = route.params;
  const { code } = route.params;

  useEffect(() => {
    fetchOrderItems();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchOrderItems();
    });

    return unsubscribe;
  }, []);

  const fetchOrderItems = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/api/order-items`, {
        params: { OrderId: currentOrderId },
      });
      setOrderItems(response.data.result.items);
      setError(null);
      const response1 = await axios.get(
        `${API_URL}/api/orders/${currentOrderId}`
      );
      setOrder(response1.data.result);

      setError(null);
    } catch (err) {
      setError("Bàn chưa có đơn hàng nào!!!");
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
        Alert.alert("Success", "Checkout completed successfully");
        navigation.navigate("QRCodePayment", {
          orderId: currentOrderId,
          totalAmount: Order.totalPrice,
        });
      } else {
        throw new Error(response.data.message || "Checkout failed");
      }
    } catch (err) {
      Alert.alert(
        "Error",
        err.message || "Failed to checkout. Please try again."
      );
    } finally {
      setCheckingOut(false);
    }
  };

  const handleCreateQR = () => {
    navigation.navigate("QRCodePayment", {
      orderId: currentOrderId,
      totalAmount: Order.totalPrice,
    });
  };

  const renderOrderItem = ({ item }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
      <Text className="text-sm text-gray-600">Số lượng: {item.quantity}</Text>
      <Text className="text-sm text-gray-600">
        Giá: {item.price.toLocaleString("vi-VN")} VNĐ
      </Text>
      <Text className="text-sm text-gray-600">
        Tổng: {item.price.toLocaleString("vi-VN")} VNĐ
      </Text>
      <Text
        className="text-sm font-medium mt-1"
        style={{
          color: item.orderItemStatus === "Done" ? "#22c55e" : "#eab308",
        }}
      >
        Status: {item.orderItemStatus}
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={{ flex: 1 }}>
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

        {loading ? (
          <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={{ flex: 1 }}>
            <SafeAreaView className="flex-1 justify-center items-center">
              <LoadingScreen />
            </SafeAreaView>
          </LinearGradient>
        ) : error ? (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-white text-lg text-center mb-4">{error}</Text>
            <TouchableOpacity
              className="bg-white rounded-xl py-3 px-6 shadow-lg"
              onPress={fetchOrderItems}
              activeOpacity={0.7}
            >
              <Text className="text-[#f26b0f] font-bold">Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={orderItems}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 80,
              }}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center p-4">
                  <Text className="text-white text-lg text-center mb-4">
                    {error}
                  </Text>
                  <TouchableOpacity
                    className="bg-white rounded-xl py-3 px-6 shadow-lg"
                    onPress={fetchOrderItems}
                    activeOpacity={0.7}
                  >
                    <Text className="text-[#f26b0f] font-bold">Thử lại</Text>
                  </TouchableOpacity>
                </View>
              }
            />
            <View className="absolute bottom-0 left-0 right-0 p-4">
              <TouchableOpacity
                className={`py-3 px-6 rounded-xl ${
                  orderItems.length === 0 ||
                  checkingOut ||
                  Order.status === "Paid"
                    ? "bg-gray-300"
                    : "bg-[#f26b0f]"
                }`}
                onPress={
                  Order.status === "Paid"
                    ? null
                    : Order.status !== "Unpaid"
                    ? handleCreateQR
                    : handleCheckout
                }
                disabled={
                  orderItems.length === 0 ||
                  checkingOut ||
                  Order.status === "Paid"
                }
              >
                <Text className="text-white text-center font-bold text-lg">
                  {checkingOut
                    ? "Processing..."
                    : Order.status === "Paid"
                    ? "Đã Thanh Toán"
                    : Order.status !== "Unpaid"
                    ? "Tạo QR"
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
