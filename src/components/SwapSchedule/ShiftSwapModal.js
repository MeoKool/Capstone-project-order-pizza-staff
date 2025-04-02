import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { X, Calendar, Clock, MapPin, AlertTriangle } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAvailableShifts, submitShiftSwap } from "./apiService";

export default function ShiftSwapModal({
  isVisible,
  onClose,
  selectedShift,
  onSuccess,
}) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [availableShifts, setAvailableShifts] = useState([]);
  const [selectedSwapShift, setSelectedSwapShift] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isVisible && selectedShift) {
      setError(null);
      loadAvailableShifts();
    }
  }, [isVisible, selectedShift]);

  const loadAvailableShifts = async () => {
    try {
      setLoading(true);
      setError(null);
      const workingDate = selectedShift.workingDate;
      const shifts = await fetchAvailableShifts(workingDate);

      // Filter out the current staff's shifts
      const staffId = await AsyncStorage.getItem("staffId");
      const filteredShifts = shifts.filter(
        (shift) => shift.staffId !== staffId
      );

      setAvailableShifts(filteredShifts);
    } catch (error) {
      console.error("Error loading available shifts:", error);
      setError(
        error.message || "Failed to load available shifts. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSwapShift) {
      Alert.alert("Lỗi", "Vui lòng chọn ca làm muốn đổi");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const staffId = await AsyncStorage.getItem("staffId");

      const swapData = {
        workingDateFrom: selectedShift.workingDate,
        employeeFromId: staffId,
        workingSlotFromId: selectedShift.workingSlotId,
        workingDateTo: selectedSwapShift.workingDate,
        employeeToId: selectedSwapShift.staffId,
        workingSlotToId: selectedSwapShift.workingSlotId,
      };

      await submitShiftSwap(swapData);

      Alert.alert("Thành công", "Yêu cầu đổi ca đã được gửi thành công");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting shift swap:", error);
      setError(
        error.message ||
          "Failed to submit shift swap request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 h-3/4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Chọn ca làm muốn đổi
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Error message */}
          {error && (
            <View className="bg-red-50 rounded-xl p-4 mb-4 border border-red-200 flex-row items-start">
              <AlertTriangle size={20} color="#EF4444" className="mr-2" />
              <Text className="text-red-600 flex-1">{error}</Text>
            </View>
          )}

          {/* Selected shift info */}
          <View className="bg-orange-50 rounded-xl p-4 mb-4 border border-orange-200">
            <Text className="font-semibold text-gray-800 mb-2">
              Ca làm hiện tại của bạn:
            </Text>
            <View className="flex-row items-center mb-1">
              <Calendar size={16} color="#ff7e5f" />
              <Text className="text-gray-700 ml-2">
                {formatDate(selectedShift?.workingDate)} (
                {selectedShift?.workingSlot?.dayName})
              </Text>
            </View>
            <View className="flex-row items-center mb-1">
              <MapPin size={16} color="#ff7e5f" />
              <Text className="text-gray-700 ml-2">
                Khu vực: {selectedShift?.zoneName}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={16} color="#ff7e5f" />
              <Text className="text-gray-700 ml-2">
                Ca: {selectedShift?.workingSlot?.shiftName} (
                {selectedShift?.workingSlot?.shiftStart} -{" "}
                {selectedShift?.workingSlot?.shiftEnd})
              </Text>
            </View>
          </View>

          <Text className="font-semibold text-gray-800 mb-2">
            Chọn ca làm muốn đổi:
          </Text>

          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color="#ff7e5f" />
            </View>
          ) : (
            <ScrollView className="mb-4 flex-1">
              {availableShifts.length > 0 ? (
                availableShifts.map((shift) => (
                  <TouchableOpacity
                    key={shift.id}
                    className={`border rounded-xl p-4 mb-3 ${
                      selectedSwapShift?.id === shift.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200"
                    }`}
                    onPress={() => setSelectedSwapShift(shift)}
                  >
                    <View className="flex-row items-center mb-1">
                      <Calendar size={16} color="#6B7280" />
                      <Text className="text-gray-800 font-medium ml-2">
                        {formatDate(shift.workingDate)} (
                        {shift.workingSlot?.dayName})
                      </Text>
                    </View>
                    <View className="flex-row items-center mb-1">
                      <MapPin size={16} color="#6B7280" />
                      <Text className="text-gray-700 ml-2">
                        Khu vực: {shift.zoneName}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Clock size={16} color="#6B7280" />
                      <Text className="text-gray-700 ml-2">
                        Ca: {shift.workingSlot?.shiftName} (
                        {shift.workingSlot?.shiftStart} -{" "}
                        {shift.workingSlot?.shiftEnd})
                      </Text>
                    </View>
                    <Text className="text-gray-500 mt-2">
                      Nhân viên: {shift.staffName}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="flex-1 items-center justify-center py-8">
                  <Text className="text-gray-500">
                    Không có ca làm nào khả dụng để đổi
                  </Text>
                </View>
              )}
            </ScrollView>
          )}

          <TouchableOpacity
            className={`rounded-xl py-4 items-center ${
              submitting || loading || availableShifts.length === 0
                ? "bg-gray-400"
                : "bg-orange-500"
            }`}
            onPress={handleSubmit}
            disabled={submitting || loading || availableShifts.length === 0}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold">Gửi yêu cầu đổi ca</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
