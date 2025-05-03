"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { AlertCircle, Check, X } from "lucide-react-native";

const ConfirmationModal = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [opacityAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations when modal is hidden
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <Animated.View
              className="bg-white rounded-2xl w-5/6 p-5"
              style={{
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 10,
              }}
            >
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center">
                  <AlertCircle size={24} color="#FF6B6B" />
                </View>
                <Text className="text-gray-800 font-bold text-xl ml-3">
                  {title}
                </Text>
              </View>

              <Text className="text-gray-600 mb-5">{message}</Text>

              <View className="flex-row justify-end">
                {onCancel && (
                  <TouchableOpacity
                    onPress={onCancel}
                    className="flex-row items-center justify-center bg-gray-100 rounded-xl py-2.5 px-4 mr-3"
                  >
                    <X size={18} color="#6B7280" />
                    <Text className="text-gray-700 font-medium ml-1.5">
                      Hủy
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={onConfirm}
                  className="flex-row items-center justify-center bg-orange-500 rounded-xl py-2.5 px-4"
                >
                  <Check size={18} color="white" />
                  <Text className="text-white font-medium ml-1.5">
                    Xác nhận
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConfirmationModal;
