"use client";

import { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  X,
  AlertTriangle,
  Info,
  SendHorizontal,
  Clock8,
  CheckCircle,
  XCircle,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar as RNCalendar } from "react-native-calendars";
import {
  fetchMyShifts,
  fetchAvailableShifts,
  submitShiftSwap,
  fetchConfigs,
  fetchSentSwapRequests,
  fetchReceivedSwapRequests,
  fetchWorkingSlotDetails,
  approveSwapRequest,
  rejectSwapRequest,
} from "../components/SwapSchedule/apiService";
import ConfirmationModal from "../components/RegisterWork/ConfirmationModal";

export default function ShiftSwapScreen({ navigation }) {
  // State for shifts and UI
  const [myShifts, setMyShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staffId, setStaffId] = useState("");
  const [staffStatus, setStaffStatus] = useState("");
  const [error, setError] = useState(null);

  // State for swap flow
  const [step, setStep] = useState(1); // 1: Select source date, 2: Select source shift, 3: Select target date, 4: Select target shift
  const [selectedSourceDate, setSelectedSourceDate] = useState("");
  const [selectedTargetDate, setSelectedTargetDate] = useState("");
  const [sourceShifts, setSourceShifts] = useState([]);
  const [targetShifts, setTargetShifts] = useState([]);
  const [selectedSourceShift, setSelectedSourceShift] = useState(null);
  const [selectedTargetShift, setSelectedTargetShift] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Add a new state variable for marked dates after the other state declarations
  const [markedDates, setMarkedDates] = useState({});

  // Add state for configuration values
  const [swapCutoffDay, setSwapCutoffDay] = useState(1);

  // Add state for swap requests
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loadingSentRequests, setLoadingSentRequests] = useState(false);
  const [loadingReceivedRequests, setLoadingReceivedRequests] = useState(false);

  // Add state for working slot details
  const [workingSlotDetails, setWorkingSlotDetails] = useState({});
  const [loadingSlotDetails, setLoadingSlotDetails] = useState(false);

  // Add state for request actions
  const [processingRequestIds, setProcessingRequestIds] = useState({});

  // Confirmation modal states
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState({
    title: "",
    message: "",
  });

  // Helper function to show confirmation modal
  const showConfirmModal = (
    title,
    message,
    isSuccess = false,
    callback = () => {}
  ) => {
    setConfirmModalData({
      title: title,
      message: message,
    });
    setConfirmModalVisible(true);
    setErrorModalCallback(() => callback);
  };

  // State for modal callback
  const [errorModalCallback, setErrorModalCallback] = useState(() => {});

  // Helper function to handle confirmation modal actions
  const handleConfirmModalConfirm = () => {
    setConfirmModalVisible(false);

    // If this is the full-time employee notification, navigate back
    if (
      confirmModalData.title === "Thông báo" &&
      confirmModalData.message ===
        "Nhân viên toàn thời gian không được đổi ca làm việc"
    ) {
      navigation.goBack();
      return;
    }

    // For other confirmations, execute the callback if it exists
    if (errorModalCallback) {
      errorModalCallback();
    }
  };

  const handleConfirmModalCancel = () => {
    setConfirmModalVisible(false);
  };

  // Load staff ID and configurations on component mount
  useEffect(() => {
    const getStaffId = async () => {
      const id = await AsyncStorage.getItem("staffId");
      const status = await AsyncStorage.getItem("staffStatus");
      if (id) {
        setStaffId(id);
        loadSwapRequests(id);
      }
      if (status) {
        setStaffStatus(status);
        // Check if staff is full-time and show message
        if (status === "FullTime") {
          setConfirmModalData({
            title: "Thông báo",
            message: "Nhân viên toàn thời gian không được đổi ca làm việc",
          });
          setConfirmModalVisible(true);
        }
      }
    };
    getStaffId();
    loadMyShifts();
    loadConfigurations();
  }, []);

  // Load swap requests
  const loadSwapRequests = async (id) => {
    try {
      setLoadingSentRequests(true);
      setLoadingReceivedRequests(true);

      // Fetch sent requests
      const sentData = await fetchSentSwapRequests(id);
      setSentRequests(sentData);

      // Fetch received requests
      const receivedData = await fetchReceivedSwapRequests(id);
      setReceivedRequests(receivedData);

      // Fetch working slot details for each request
      const allRequests = [...sentData, ...receivedData];
      const slotIds = new Set();

      allRequests.forEach((request) => {
        slotIds.add(request.workingSlotFromId);
        slotIds.add(request.workingSlotToId);
      });

      await loadWorkingSlotDetails(Array.from(slotIds));
    } catch (error) {
      console.error("Error loading swap requests:", error);
    } finally {
      setLoadingSentRequests(false);
      setLoadingReceivedRequests(false);
    }
  };

  // Handle approve swap request
  const handleApproveRequest = async (requestId) => {
    try {
      // Update processing state
      setProcessingRequestIds((prev) => ({
        ...prev,
        [requestId]: "approving",
      }));

      // Call API to approve the request
      await approveSwapRequest(requestId);

      // Show success message
      setConfirmModalData({
        title: "Thành công",
        message: "Yêu cầu đổi ca đã được chấp nhận",
      });
      setConfirmModalVisible(true);
      setErrorModalCallback(() => {
        // Reload swap requests
        loadSwapRequests(staffId);
      });
    } catch (error) {
      console.error("Error approving swap request:", error);
      setConfirmModalData({
        title: "Lỗi",
        message:
          error.message ||
          "Không thể chấp nhận yêu cầu đổi ca. Vui lòng thử lại.",
      });
      setConfirmModalVisible(true);
    } finally {
      // Clear processing state
      setProcessingRequestIds((prev) => {
        const newState = { ...prev };
        delete newState[requestId];
        return newState;
      });
    }
  };

  // Handle reject swap request
  const handleRejectRequest = async (requestId) => {
    try {
      // Update processing state
      setProcessingRequestIds((prev) => ({
        ...prev,
        [requestId]: "rejecting",
      }));

      // Call API to reject the request
      await rejectSwapRequest(requestId);

      // Show success message
      setConfirmModalData({
        title: "Thành công",
        message: "Yêu cầu đổi ca đã bị từ chối",
      });
      setConfirmModalVisible(true);
      setErrorModalCallback(() => {
        // Reload swap requests
        loadSwapRequests(staffId);
      });
    } catch (error) {
      console.error("Error rejecting swap request:", error);
      setConfirmModalData({
        title: "Lỗi",
        message:
          error.message ||
          "Không thể từ chối yêu cầu đổi ca. Vui lòng thử lại.",
      });
      setConfirmModalVisible(true);
    } finally {
      // Clear processing state
      setProcessingRequestIds((prev) => {
        const newState = { ...prev };
        delete newState[requestId];
        return newState;
      });
    }
  };

  // Load working slot details
  const loadWorkingSlotDetails = async (slotIds) => {
    try {
      setLoadingSlotDetails(true);
      const details = {};

      // Fetch details for each slot ID
      await Promise.all(
        slotIds.map(async (slotId) => {
          try {
            const slotDetails = await fetchWorkingSlotDetails(slotId);
            details[slotId] = slotDetails;
          } catch (error) {
            console.error(`Error fetching details for slot ${slotId}:`, error);
          }
        })
      );

      setWorkingSlotDetails(details);
    } catch (error) {
      console.error("Error loading working slot details:", error);
    } finally {
      setLoadingSlotDetails(false);
    }
  };

  // Load configurations
  const loadConfigurations = async () => {
    try {
      const configs = await fetchConfigs();
      if (configs.SWAP_WORKING_SLOT_CUTOFF_DAY) {
        setSwapCutoffDay(
          Number.parseInt(configs.SWAP_WORKING_SLOT_CUTOFF_DAY, 10)
        );
      }
    } catch (error) {
      console.error("Error loading configurations:", error);
      // Use default value if configs can't be loaded
    }
  };

  // Load my shifts
  const loadMyShifts = async () => {
    try {
      setLoading(true);
      setError(null);
      const id = await AsyncStorage.getItem("staffId");
      const status = await AsyncStorage.getItem("staffStatus");

      if (!id) {
        setError("Staff ID not found. Please login again.");
        return;
      }

      setStaffId(id);
      setStaffStatus(status);

      const shiftsData = await fetchMyShifts(id);
      setMyShifts(shiftsData);

      // Create marked dates object for the calendar
      const marked = {};
      shiftsData.forEach((shift) => {
        marked[shift.workingDate] = {
          marked: true,
          dotColor: "#ff7e5f",
          selectedColor: "#ff7e5f",
        };
      });

      // Add selected date if it exists
      if (selectedSourceDate) {
        marked[selectedSourceDate] = {
          ...marked[selectedSourceDate],
          selected: true,
          selectedColor: "#ff7e5f",
        };
      }

      setMarkedDates(marked);
    } catch (error) {
      console.error("Error loading shifts:", error);
      setError(
        error.message || "Failed to load your shifts. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle source date selection
  const handleSourceDateSelect = async (date) => {
    // Check if staff is full-time
    if (staffStatus === "FullTime") {
      setConfirmModalData({
        title: "Thông báo",
        message: "Nhân viên toàn thời gian không được đổi ca làm việc",
      });
      setConfirmModalVisible(true);
      return;
    }

    try {
      // Update marked dates to show selection while preserving dots
      const newMarkedDates = { ...markedDates };

      // Reset previous selection
      Object.keys(newMarkedDates).forEach((key) => {
        if (newMarkedDates[key].selected) {
          newMarkedDates[key] = {
            ...newMarkedDates[key],
            selected: false,
          };
        }
      });

      // Set new selection
      newMarkedDates[date.dateString] = {
        ...newMarkedDates[date.dateString],
        selected: true,
        selectedColor: "#ff7e5f",
      };

      setMarkedDates(newMarkedDates);
      setSelectedSourceDate(date.dateString);
      setLoading(true);

      const shiftsData = await fetchAvailableShifts(date.dateString);
      // Filter shifts for the current staff
      const myShiftsForDate = shiftsData.filter(
        (shift) => shift.staffId === staffId
      );
      setSourceShifts(myShiftsForDate);

      // Move to next step if there are shifts
      if (myShiftsForDate.length > 0) {
        setStep(2);
      } else {
        setConfirmModalData({
          title: "Thông báo",
          message: "Bạn không có ca làm nào vào ngày này",
        });
        setConfirmModalVisible(true);
      }
    } catch (error) {
      console.error("Error loading shifts:", error);
      setConfirmModalData({
        title: "Lỗi",
        message: "Không thể tải ca làm việc cho ngày đã chọn",
      });
      setConfirmModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle source shift selection
  const handleSourceShiftSelect = (shift) => {
    // Check if staff is full-time
    if (staffStatus === "FullTime") {
      setConfirmModalData({
        title: "Thông báo",
        message: "Nhân viên toàn thời gian không được đổi ca làm việc",
      });
      setConfirmModalVisible(true);
      return;
    }

    setSelectedSourceShift(shift);
    setStep(3);
  };

  // Handle target date selection
  const handleTargetDateSelect = async (date) => {
    // Check if staff is full-time
    if (staffStatus === "FullTime") {
      setConfirmModalData({
        title: "Thông báo",
        message: "Nhân viên toàn thời gian không được đổi ca làm việc",
      });
      setConfirmModalVisible(true);
      return;
    }

    try {
      setSelectedTargetDate(date.dateString);
      setLoading(true);

      const shiftsData = await fetchAvailableShifts(date.dateString);
      // Filter out the current staff's shifts
      const otherShifts = shiftsData.filter(
        (shift) => shift.staffId !== staffId
      );
      setTargetShifts(otherShifts);

      // Move to next step if there are shifts
      if (otherShifts.length > 0) {
        setStep(4);
      } else {
        setConfirmModalData({
          title: "Thông báo",
          message: "Không có ca làm nào khả dụng vào ngày này",
        });
        setConfirmModalVisible(true);
      }
    } catch (error) {
      console.error("Error loading shifts:", error);
      setConfirmModalData({
        title: "Lỗi",
        message: "Không thể tải ca làm việc cho ngày đã chọn",
      });
      setConfirmModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle target shift selection
  const handleTargetShiftSelect = (shift) => {
    // Check if staff is full-time
    if (staffStatus === "FullTime") {
      setConfirmModalData({
        title: "Thông báo",
        message: "Nhân viên toàn thời gian không được đổi ca làm việc",
      });
      setConfirmModalVisible(true);
      return;
    }

    setSelectedTargetShift(shift);
    setIsModalVisible(true);
  };

  // Handle swap submission
  const handleSubmitSwap = async () => {
    // Check if staff is full-time
    if (staffStatus === "FullTime") {
      setConfirmModalData({
        title: "Thông báo",
        message: "Nhân viên toàn thời gian không được đổi ca làm việc",
      });
      setConfirmModalVisible(true);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const swapData = {
        workingDateFrom: selectedSourceShift.workingDate,
        employeeFromId: staffId,
        workingSlotFromId: selectedSourceShift.workingSlotId,
        workingDateTo: selectedTargetShift.workingDate,
        employeeToId: selectedTargetShift.staffId,
        workingSlotToId: selectedTargetShift.workingSlotId,
      };

      await submitShiftSwap(swapData);

      setConfirmModalData({
        title: "Thành công",
        message: "Yêu cầu đổi ca đã được gửi thành công",
      });
      setConfirmModalVisible(true);
      setErrorModalCallback(() => {
        setIsModalVisible(false);
        resetFlow();
        loadMyShifts();
        loadSwapRequests(staffId);
      });
    } catch (error) {
      console.error("Error submitting shift swap:", error);
      setError(
        error.message ||
          "Failed to submit shift swap request. Please try again."
      );
      setConfirmModalData({
        title: "Lỗi",
        message:
          error.message || "Không thể gửi yêu cầu đổi ca. Vui lòng thử lại.",
      });
      setConfirmModalVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset the flow
  const resetFlow = () => {
    setStep(1);
    setSelectedSourceDate("");
    setSelectedTargetDate("");
    setSourceShifts([]);
    setTargetShifts([]);
    setSelectedSourceShift(null);
    setSelectedTargetShift(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format date and time for display
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "";

    // If timeString is already in HH:MM format, return it
    if (timeString.length <= 5) return timeString;

    // Otherwise, extract hours and minutes
    const parts = timeString.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }

    return timeString;
  };

  // Get status text and color
  const getStatusInfo = (status) => {
    switch (status) {
      case "PendingStaffAgree":
        return {
          text: "Chờ nhân viên đồng ý",
          color: "#F59E0B",
          icon: <Clock8 size={16} color="#F59E0B" />,
        };
      case "PendingManagerApprove":
        return {
          text: "Chờ quản lý duyệt",
          color: "#3B82F6",
          icon: <Clock8 size={16} color="#3B82F6" />,
        };
      case "Approved":
        return {
          text: "Đã duyệt",
          color: "#10B981",
          icon: <CheckCircle size={16} color="#10B981" />,
        };
      case "Rejected":
        return {
          text: "Từ chối",
          color: "#EF4444",
          icon: <XCircle size={16} color="#EF4444" />,
        };
      default:
        return {
          text: status,
          color: "#6B7280",
          icon: <Clock8 size={16} color="#6B7280" />,
        };
    }
  };

  // Render sent swap request item
  const renderSentRequestItem = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);
    const fromSlot = workingSlotDetails[item.workingSlotFromId];
    const toSlot = workingSlotDetails[item.workingSlotToId];

    return (
      <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center">
            <SendHorizontal size={16} color="#ff7e5f" />
            <Text className="text-gray-800 font-medium ml-2">
              Đổi ca với {item.employeeToName}
            </Text>
          </View>
          <View className="flex-row items-center">
            {statusInfo.icon}
            <Text className="ml-1 text-xs" style={{ color: statusInfo.color }}>
              {statusInfo.text}
            </Text>
          </View>
        </View>

        <View className="bg-orange-50 rounded-lg p-2 mb-2">
          <Text className="text-gray-600 text-xs mb-1">
            Ca hiện tại của bạn:
          </Text>
          <View className="flex-row items-center">
            <Calendar size={14} color="#6B7280" />
            <Text className="text-gray-700 ml-2 text-sm">
              Ngày: {formatDate(item.workingDateFrom)}
            </Text>
          </View>
          {fromSlot && (
            <View className="flex-row items-center mt-1">
              <Clock size={14} color="#6B7280" />
              <Text className="text-gray-700 ml-2 text-sm">
                {fromSlot.shiftName} ({formatTime(fromSlot.shiftStart)} -{" "}
                {formatTime(fromSlot.shiftEnd)})
              </Text>
            </View>
          )}
        </View>

        <View className="bg-blue-50 rounded-lg p-2 mb-2">
          <Text className="text-gray-600 text-xs mb-1">Ca muốn đổi:</Text>
          <View className="flex-row items-center">
            <Calendar size={14} color="#6B7280" />
            <Text className="text-gray-700 ml-2 text-sm">
              Ngày: {formatDate(item.workingDateTo)}
            </Text>
          </View>
          {toSlot && (
            <View className="flex-row items-center mt-1">
              <Clock size={14} color="#6B7280" />
              <Text className="text-gray-700 ml-2 text-sm">
                {toSlot.shiftName} ({formatTime(toSlot.shiftStart)} -{" "}
                {formatTime(toSlot.shiftEnd)})
              </Text>
            </View>
          )}
        </View>

        <Text className="text-gray-500 text-xs mt-1">
          Yêu cầu lúc: {formatDateTime(item.requestDate)}
        </Text>
      </View>
    );
  };

  // Render received swap request item
  const renderReceivedRequestItem = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);
    const fromSlot = workingSlotDetails[item.workingSlotFromId];
    const toSlot = workingSlotDetails[item.workingSlotToId];
    const isProcessing = processingRequestIds[item.id];
    const canRespond = item.status === "PendingStaffAgree";

    return (
      <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center">
            <SendHorizontal size={16} color="#3B82F6" />
            <Text className="text-gray-800 font-medium ml-2">
              Yêu cầu từ {item.employeeFromName}
            </Text>
          </View>
          <View className="flex-row items-center">
            {statusInfo.icon}
            <Text className="ml-1 text-xs" style={{ color: statusInfo.color }}>
              {statusInfo.text}
            </Text>
          </View>
        </View>

        <View className="bg-blue-50 rounded-lg p-2 mb-2">
          <Text className="text-gray-600 text-xs mb-1">
            Ca của {item.employeeFromName}:
          </Text>
          <View className="flex-row items-center">
            <Calendar size={14} color="#6B7280" />
            <Text className="text-gray-700 ml-2 text-sm">
              Ngày: {formatDate(item.workingDateFrom)}
            </Text>
          </View>
          {fromSlot && (
            <View className="flex-row items-center mt-1">
              <Clock size={14} color="#6B7280" />
              <Text className="text-gray-700 ml-2 text-sm">
                {fromSlot.shiftName} ({formatTime(fromSlot.shiftStart)} -{" "}
                {formatTime(fromSlot.shiftEnd)})
              </Text>
            </View>
          )}
        </View>

        <View className="bg-orange-50 rounded-lg p-2 mb-2">
          <Text className="text-gray-600 text-xs mb-1">Ca của bạn:</Text>
          <View className="flex-row items-center">
            <Calendar size={14} color="#6B7280" />
            <Text className="text-gray-700 ml-2 text-sm">
              Ngày: {formatDate(item.workingDateTo)}
            </Text>
          </View>
          {toSlot && (
            <View className="flex-row items-center mt-1">
              <Clock size={14} color="#6B7280" />
              <Text className="text-gray-700 ml-2 text-sm">
                {toSlot.shiftName} ({formatTime(toSlot.shiftStart)} -{" "}
                {formatTime(toSlot.shiftEnd)})
              </Text>
            </View>
          )}
        </View>

        <Text className="text-gray-500 text-xs mt-1">
          Yêu cầu lúc: {formatDateTime(item.requestDate)}
        </Text>

        {/* Add action buttons for pending requests */}
        {canRespond && (
          <View className="flex-row justify-end mt-3 space-x-2">
            {isProcessing ? (
              <ActivityIndicator size="small" color="#ff7e5f" />
            ) : (
              <>
                <TouchableOpacity
                  className="bg-green-500 py-2 px-3 rounded-lg flex-row items-center"
                  onPress={() => handleApproveRequest(item.id)}
                >
                  <Text className="text-white ml-1 text-xs font-medium">
                    Đồng ý
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-red-500 py-2 px-3 rounded-lg flex-row items-center ml-2"
                  onPress={() => handleRejectRequest(item.id)}
                >
                  <Text className="text-white ml-1 text-xs font-medium">
                    Từ chối
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    );
  };

  // Render source shift item
  const renderSourceShiftItem = ({ item }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 shadow-sm"
      onPress={() => handleSourceShiftSelect(item)}
      disabled={staffStatus === "FullTime"}
    >
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <Calendar size={16} color="#ff7e5f" />
          <Text className="text-gray-800 font-medium ml-2">
            {formatDate(item.workingDate)} ({item.workingSlot?.dayName})
          </Text>
        </View>
      </View>
      <View className="space-y-2">
        <View className="flex-row items-center">
          <MapPin size={16} color="#6B7280" />
          <Text className="text-gray-700 ml-2">Khu vực: {item.zoneName}</Text>
        </View>
        <View className="flex-row items-center">
          <Clock size={16} color="#6B7280" />
          <Text className="text-gray-700 ml-2">
            Ca: {item.workingSlot?.shiftName} ({item.workingSlot?.shiftStart} -{" "}
            {item.workingSlot?.shiftEnd})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render target shift item
  const renderTargetShiftItem = ({ item }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 shadow-sm"
      onPress={() => handleTargetShiftSelect(item)}
      disabled={staffStatus === "FullTime"}
    >
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <Calendar size={16} color="#ff7e5f" />
          <Text className="text-gray-800 font-medium ml-2">
            {formatDate(item.workingDate)} ({item.workingSlot?.dayName})
          </Text>
        </View>
      </View>
      <View className="space-y-2">
        <View className="flex-row items-center">
          <MapPin size={16} color="#6B7280" />
          <Text className="text-gray-700 ml-2">Khu vực: {item.zoneName}</Text>
        </View>
        <View className="flex-row items-center">
          <Clock size={16} color="#6B7280" />
          <Text className="text-gray-700 ml-2">
            Ca: {item.workingSlot?.shiftName} ({item.workingSlot?.shiftStart} -{" "}
            {item.workingSlot?.shiftEnd})
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-gray-700">Nhân viên: {item.staffName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render content based on current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ScrollView className="px-4">
            <Text className="text-white text-base mb-2">
              Chọn ngày có ca làm của bạn:
            </Text>
            <View className="bg-white rounded-xl overflow-hidden">
              <RNCalendar
                onDayPress={handleSourceDateSelect}
                markedDates={markedDates}
                theme={{
                  todayTextColor: "#ff7e5f",
                  selectedDayBackgroundColor: "#ff7e5f",
                  arrowColor: "#ff7e5f",
                }}
              />
            </View>

            {/* Sent Swap Requests Section */}
            <View className="mt-6">
              <Text className="text-white text-lg font-semibold mb-2">
                Yêu cầu đổi ca đã gửi
              </Text>

              {loadingSentRequests || loadingSlotDetails ? (
                <View className="bg-white/20 rounded-xl p-4 items-center">
                  <ActivityIndicator color="white" size="small" />
                </View>
              ) : sentRequests.length > 0 ? (
                <FlatList
                  data={sentRequests}
                  renderItem={renderSentRequestItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <View className="bg-white/20 rounded-xl p-4 items-center">
                  <Text className="text-white">
                    Bạn chưa gửi yêu cầu đổi ca nào
                  </Text>
                </View>
              )}
            </View>

            {/* Received Swap Requests Section */}
            <View className="mt-6 mb-6">
              <Text className="text-white text-lg font-semibold mb-2">
                Yêu cầu đổi ca nhận được
              </Text>

              {loadingReceivedRequests || loadingSlotDetails ? (
                <View className="bg-white/20 rounded-xl p-4 items-center">
                  <ActivityIndicator color="white" size="small" />
                </View>
              ) : receivedRequests.length > 0 ? (
                <FlatList
                  data={receivedRequests}
                  renderItem={renderReceivedRequestItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <View className="bg-white/20 rounded-xl p-4 items-center">
                  <Text className="text-white">
                    Bạn chưa nhận yêu cầu đổi ca nào
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        );

      case 2:
        return (
          <View className="px-4">
            <View className="flex-row items-center mb-4">
              <TouchableOpacity
                onPress={() => setStep(1)}
                className="w-8 h-8 bg-white/20 rounded-full items-center justify-center mr-2"
              >
                <ArrowLeft color="white" size={16} />
              </TouchableOpacity>
              <Text className="text-white text-base">
                Chọn ca làm của bạn ngày {formatDate(selectedSourceDate)}:
              </Text>
            </View>

            {loading ? (
              <View className="bg-white/20 rounded-xl p-6 items-center">
                <ActivityIndicator color="white" />
              </View>
            ) : sourceShifts.length > 0 ? (
              <FlatList
                data={sourceShifts}
                renderItem={renderSourceShiftItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            ) : (
              <View className="bg-white/20 rounded-xl p-6 items-center">
                <Text className="text-white text-center">
                  Bạn không có ca làm nào vào ngày này
                </Text>
              </View>
            )}
          </View>
        );

      case 3:
        return (
          <View className="px-4">
            <View className="flex-row items-center mb-4">
              <TouchableOpacity
                onPress={() => setStep(2)}
                className="w-8 h-8 bg-white/20 rounded-full items-center justify-center mr-2"
              >
                <ArrowLeft color="white" size={16} />
              </TouchableOpacity>
              <Text className="text-white text-base">
                Chọn ngày bạn muốn đổi:
              </Text>
            </View>

            <View className="bg-white/20 rounded-xl p-4 mb-4">
              <Text className="text-white font-semibold mb-1">
                Ca làm hiện tại của bạn:
              </Text>
              <Text className="text-white">
                Ngày: {formatDate(selectedSourceShift.workingDate)} (
                {selectedSourceShift.workingSlot?.dayName})
              </Text>
              <Text className="text-white">
                Khu vực: {selectedSourceShift.zoneName}
              </Text>
              <Text className="text-white">
                Ca: {selectedSourceShift.workingSlot?.shiftName} (
                {selectedSourceShift.workingSlot?.shiftStart} -{" "}
                {selectedSourceShift.workingSlot?.shiftEnd})
              </Text>
            </View>

            <View className="bg-white rounded-xl overflow-hidden">
              <RNCalendar
                onDayPress={handleTargetDateSelect}
                markedDates={{
                  [selectedTargetDate]: {
                    selected: true,
                    selectedColor: "#ff7e5f",
                  },
                }}
                theme={{
                  todayTextColor: "#ff7e5f",
                  selectedDayBackgroundColor: "#ff7e5f",
                  arrowColor: "#ff7e5f",
                }}
              />
            </View>
          </View>
        );

      case 4:
        return (
          <View className="px-4">
            <View className="flex-row items-center mb-4">
              <TouchableOpacity
                onPress={() => setStep(3)}
                className="w-8 h-8 bg-white/20 rounded-full items-center justify-center mr-2"
              >
                <ArrowLeft color="white" size={16} />
              </TouchableOpacity>
              <Text className="text-white text-base">
                Chọn ca làm muốn đổi ngày {formatDate(selectedTargetDate)}:
              </Text>
            </View>

            <View className="bg-white/20 rounded-xl p-4 mb-4">
              <Text className="text-white font-semibold mb-1">
                Ca làm hiện tại của bạn:
              </Text>
              <Text className="text-white">
                Ngày: {formatDate(selectedSourceShift.workingDate)} (
                {selectedSourceShift.workingSlot?.dayName})
              </Text>
              <Text className="text-white">
                Khu vực: {selectedSourceShift.zoneName}
              </Text>
              <Text className="text-white">
                Ca: {selectedSourceShift.workingSlot?.shiftName} (
                {selectedSourceShift.workingSlot?.shiftStart} -{" "}
                {selectedSourceShift.workingSlot?.shiftEnd})
              </Text>
            </View>

            {loading ? (
              <View className="bg-white/20 rounded-xl p-6 items-center">
                <ActivityIndicator color="white" />
              </View>
            ) : targetShifts.length > 0 ? (
              <FlatList
                data={targetShifts}
                renderItem={renderTargetShiftItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            ) : (
              <View className="bg-white/20 rounded-xl p-6 items-center">
                <Text className="text-white text-center">
                  Không có ca làm nào khả dụng vào ngày này
                </Text>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  // Confirmation modal
  const renderConfirmationModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 h-3/4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Xác nhận đổi ca
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
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

          {/* Full-time employee warning */}
          {staffStatus === "FullTime" && (
            <View className="bg-orange-50 rounded-xl p-4 mb-4 border border-orange-200 flex-row items-start">
              <AlertTriangle size={20} color="#FF9800" className="mr-2" />
              <Text className="text-orange-600 flex-1">
                Nhân viên toàn thời gian không được đổi ca làm việc
              </Text>
            </View>
          )}

          <ScrollView className="flex-1 mb-4">
            <View className="bg-orange-50 rounded-xl p-4 mb-4 border border-orange-200">
              <Text className="font-semibold text-gray-800 mb-2">
                Ca làm hiện tại của bạn:
              </Text>
              <View className="flex-row items-center mb-1">
                <Calendar size={16} color="#ff7e5f" />
                <Text className="text-gray-700 ml-2">
                  {formatDate(selectedSourceShift?.workingDate)} (
                  {selectedSourceShift?.workingSlot?.dayName})
                </Text>
              </View>
              <View className="flex-row items-center mb-1">
                <MapPin size={16} color="#ff7e5f" />
                <Text className="text-gray-700 ml-2">
                  Khu vực: {selectedSourceShift?.zoneName}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Clock size={16} color="#ff7e5f" />
                <Text className="text-gray-700 ml-2">
                  Ca: {selectedSourceShift?.workingSlot?.shiftName} (
                  {selectedSourceShift?.workingSlot?.shiftStart} -{" "}
                  {selectedSourceShift?.workingSlot?.shiftEnd})
                </Text>
              </View>
            </View>

            <View className="items-center my-2">
              <ChevronDown size={24} color="#6B7280" />
            </View>

            <View className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
              <Text className="font-semibold text-gray-800 mb-2">
                Ca làm muốn đổi:
              </Text>
              <View className="flex-row items-center mb-1">
                <Calendar size={16} color="#10B981" />
                <Text className="text-gray-700 ml-2">
                  {formatDate(selectedTargetShift?.workingDate)} (
                  {selectedTargetShift?.workingSlot?.dayName})
                </Text>
              </View>
              <View className="flex-row items-center mb-1">
                <MapPin size={16} color="#10B981" />
                <Text className="text-gray-700 ml-2">
                  Khu vực: {selectedTargetShift?.zoneName}
                </Text>
              </View>
              <View className="flex-row items-center mb-1">
                <Clock size={16} color="#10B981" />
                <Text className="text-gray-700 ml-2">
                  Ca: {selectedTargetShift?.workingSlot?.shiftName} (
                  {selectedTargetShift?.workingSlot?.shiftStart} -{" "}
                  {selectedTargetShift?.workingSlot?.shiftEnd})
                </Text>
              </View>
              <Text className="text-gray-700">
                Nhân viên: {selectedTargetShift?.staffName}
              </Text>
            </View>

            <View className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
              <View className="flex-row items-center mb-2">
                <Info size={16} color="#3B82F6" />
                <Text className="font-semibold text-gray-800 ml-2">Lưu ý:</Text>
              </View>
              <Text className="text-gray-700">
                - Yêu cầu đổi ca sẽ được gửi đến nhân viên khác và quản lý để
                phê duyệt.
              </Text>
              <Text className="text-gray-700">
                - Bạn sẽ nhận được thông báo khi yêu cầu được phê duyệt hoặc từ
                chối.
              </Text>
              <Text className="text-gray-700">
                - Yêu cầu đổi ca phải được tạo trước ít nhất {swapCutoffDay}{" "}
                ngày và trước thứ hai đầu tuần.
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            className={`rounded-xl py-4 items-center ${
              submitting || staffStatus === "FullTime"
                ? "bg-gray-400"
                : "bg-orange-500"
            }`}
            onPress={handleSubmitSwap}
            disabled={submitting || staffStatus === "FullTime"}
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

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <LinearGradient
        colors={["#ff7e5f", "#feb47b"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="px-6 pt-12 pb-4 flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4"
            >
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold flex-1">
              Đổi ca làm
            </Text>
          </View>

          {/* Main content */}
          <View className="flex-1">{renderStepContent()}</View>

          {/* Confirmation Modal */}
          {renderConfirmationModal()}

          {/* Confirmation Modal for alerts */}
          <ConfirmationModal
            visible={confirmModalVisible}
            title={confirmModalData.title}
            message={confirmModalData.message}
            onConfirm={handleConfirmModalConfirm}
          />
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
