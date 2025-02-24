import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import { ChevronLeft } from "lucide-react-native";
import axios from "axios";

export default function QRCodePaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId, totalAmount } = route.params;
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createPaymentQRCode = async () => {
      try {
        const response = await axios.post(
          `https://vietsac.id.vn/pizza-service/api/payments/create-payment-qrcode`,
          { orderId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setPaymentData(response.data.result);
      } catch (error) {
        console.error("Error creating payment QR code:", error);
      } finally {
        setLoading(false);
      }
    };

    createPaymentQRCode();
  }, [orderId, totalAmount]);

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
          <Text className="text-white text-2xl font-bold">Scan to Pay</Text>
        </View>

        <View className="flex-1 justify-center items-center">
          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <View className="bg-white p-4 rounded-xl">
              <QRCode value={paymentData} size={300} />
            </View>
          )}
          <Text className="text-white text-4xl mt-4">
            Tổng tiền: {totalAmount.toLocaleString("vi-VN")} VNĐ
          </Text>
          <Text className="text-white text-2xl mt-2">
            Quét mã để thanh toán
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
