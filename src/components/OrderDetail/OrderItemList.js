"use client";

import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronUp, X } from "lucide-react-native";
import OrderItem from "./OrderItem";
import axios from "axios";
import ErrorModal from "../ErrorModal";

const API_URL = "https://vietsac.id.vn"; // Define API_URL

export default function OrderItemList({
  orderItems,
  error,
  onRetry,
  tableId,
  navigation,
}) {
  const [expandedSections, setExpandedSections] = useState({
    "Chưa hoàn thành": true,
    "Hoàn thành": true,
    Combo: true,
  });
  const [closingTable, setClosingTable] = useState(false);

  // Error modal state
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalTitle, setErrorModalTitle] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");

  // Process order items to separate combos and regular items
  const processOrderItems = () => {
    // Find all combo items
    const comboItems = orderItems.filter((item) => item.isProductCombo);

    // Find all non-combo items that don't have a parentId (not part of a combo)
    const regularItems = orderItems.filter(
      (item) => !item.isProductCombo && !item.parentId
    );

    // Separate regular items by completion status
    const pendingItems = regularItems.filter(
      (item) => item.orderItemStatus !== "Done"
    );
    const completedItems = regularItems.filter(
      (item) => item.orderItemStatus === "Done"
    );

    return {
      comboItems,
      pendingItems,
      completedItems,
    };
  };

  // Get children for a combo item
  const getComboChildren = (comboId) => {
    return orderItems.filter((item) => item.parentId === comboId);
  };

  const { comboItems, pendingItems, completedItems } = processOrderItems();

  const sections = [
    {
      title: "Chưa hoàn thành",
      data: pendingItems,
      count: pendingItems.length,
      color: "#f97316",
    },
    {
      title: "Hoàn thành",
      data: completedItems,
      count: completedItems.length,
      color: "#10b981",
    },
    {
      title: "Combo",
      data: comboItems,
      count: comboItems.length,
      color: "#6366f1", // Indigo color for combos to match screenshot
    },
  ];

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const renderSectionHeader = ({ section }) => (
    <TouchableOpacity
      onPress={() => toggleSection(section.title)}
      className="bg-white px-4 py-2 mb-2 rounded-lg flex-row justify-between items-center"
      style={{ borderLeftWidth: 4, borderLeftColor: section.color }}
    >
      <Text className="font-bold text-lg" style={{ color: section.color }}>
        {section.title} ({section.count})
      </Text>
      {expandedSections[section.title] ? (
        <ChevronUp size={24} color={section.color} />
      ) : (
        <ChevronDown size={24} color={section.color} />
      )}
    </TouchableOpacity>
  );

  const handleCloseTable = async () => {
    if (!tableId) return;

    try {
      setClosingTable(true);
      const response = await axios.put(
        `https://vietsac.id.vn/api/tables/close-table/${tableId}`
      );

      if (response.data && response.data.success) {
        navigation && navigation.goBack();
      } else {
        // Show error modal instead of Alert
        setErrorModalTitle("Lỗi");
        setErrorModalMessage("Không thể đóng bàn. Vui lòng thử lại sau.");
        setErrorModalVisible(true);
      }
    } catch (err) {
      console.error("Error closing table:", err);
      const errorMessage =
        err.response?.data?.error?.message || "Có lỗi xảy ra khi đóng bàn";

      // Show error modal instead of Alert
      setErrorModalTitle("Lỗi");
      setErrorModalMessage(errorMessage);
      setErrorModalVisible(true);
    } finally {
      setClosingTable(false);
    }
  };

  // Show error message with retry button
  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-white text-lg text-center mb-4">{error}</Text>

        {/* Add Close Table button when there are no orders */}
        {tableId && (
          <View className="mt-4">
            <TouchableOpacity
              className="bg-red-500 rounded-xl py-3 px-6 shadow-lg flex-row items-center mb-4"
              onPress={handleCloseTable}
              disabled={closingTable}
              activeOpacity={0.7}
            >
              <X size={18} color="white" />
              <Text className="text-white font-bold ml-2">
                {closingTable ? "Đang đóng bàn..." : "Đóng bàn"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          className="bg-white rounded-xl py-3 px-6 shadow-lg"
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Text className="text-[#ff7e5f] font-bold">Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If there are no order items, show empty message with close table button
  if (orderItems.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        {tableId && (
          <TouchableOpacity
            className="bg-red-500 rounded-xl py-3 px-6 shadow-lg flex-row items-center"
            onPress={handleCloseTable}
            disabled={closingTable}
            activeOpacity={0.7}
          >
            <X size={18} color="white" />
            <Text className="text-white font-bold ml-2">
              {closingTable ? "Đang đóng bàn..." : "Đóng bàn"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // If there are order items, show the sections
  return (
    <>
      <FlatList
        data={sections}
        renderItem={({ item: section }) => (
          <View>
            {renderSectionHeader({ section })}
            {expandedSections[section.title] && (
              <View>
                {section.data.map((orderItem) => {
                  if (section.title === "Combo") {
                    // For combo section, render combo items with their children
                    return (
                      <ComboItem
                        key={orderItem.id}
                        combo={orderItem}
                        children={getComboChildren(orderItem.id)}
                        onRefresh={onRetry}
                      />
                    );
                  } else {
                    // For regular sections, render normal items
                    return (
                      <OrderItem
                        key={orderItem.id}
                        item={orderItem}
                        onRefresh={onRetry}
                      />
                    );
                  }
                })}
              </View>
            )}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100,
        }}
      />

      {/* Error Modal */}
      <ErrorModal
        visible={errorModalVisible}
        title={errorModalTitle}
        message={errorModalMessage}
        buttonText="OK"
        onClose={() => setErrorModalVisible(false)}
      />
    </>
  );
}

// New component for combo items
function ComboItem({ combo, children, onRefresh }) {
  const [expanded, setExpanded] = useState(true);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultModalTitle, setResultModalTitle] = useState("");
  const [resultModalMessage, setResultModalMessage] = useState("");
  const [resultModalIsSuccess, setResultModalIsSuccess] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
        return "#22c55e";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#eab308";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Done":
        return "Hoàn thành";
      case "Cancelled":
        return "Đã hủy";
      default:
        return "Chưa hoàn thành";
    }
  };

  const handleCancelItem = async () => {
    try {
      // Show confirmation modal
      setConfirmModalVisible(true);
    } catch (err) {
      // Show error modal
      setResultModalTitle("Lỗi");
      setResultModalMessage(
        err.message || "Không thể hủy món. Vui lòng thử lại."
      );
      setResultModalIsSuccess(false);
      setResultModalVisible(true);
    }
  };

  const confirmCancelItem = async () => {
    try {
      setConfirmModalVisible(false);

      const response = await axios.put(
        `${API_URL}/api/order-items/cancelled/${combo.id}`
      );

      if (response.data.success) {
        // Show success modal
        setResultModalTitle("Thành công");
        setResultModalMessage("Đã hủy món thành công");
        setResultModalIsSuccess(true);
        setResultModalVisible(true);

        // Refresh the list after closing the modal
        if (onRefresh) onRefresh();
      } else {
        throw new Error(response.data.message || "Hủy món thất bại");
      }
    } catch (err) {
      // Show error modal
      setResultModalTitle("Lỗi");
      setResultModalMessage(
        err.message || "Không thể hủy món. Vui lòng thử lại."
      );
      setResultModalIsSuccess(false);
      setResultModalVisible(true);
    }
  };

  return (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-md">
      {/* Status Badge - only the dot indicator, no text */}
      {!combo.isProductCombo && (
        <View
          className="absolute top-4 right-4 rounded-full p-1"
          style={{
            backgroundColor: `${getStatusColor(combo.orderItemStatus)}20`,
          }}
        >
          <View
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getStatusColor(combo.orderItemStatus) }}
          />
        </View>
      )}

      {/* Main content */}
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-semibold text-gray-800 pr-20 flex-1">
          {combo.name}
        </Text>

        {/* Combo toggle button */}
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          className="p-1"
        >
          {expanded ? (
            <ChevronUp size={20} color="#666" />
          ) : (
            <ChevronDown size={20} color="#666" />
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-gray-600">
          Số lượng: {combo.quantity}
        </Text>
        <Text className="text-sm text-gray-600">
          {combo.price.toLocaleString("vi-VN")} VNĐ
        </Text>
      </View>

      {/* Combo badge */}
      <View className="mt-2 bg-blue-50 rounded-md px-2 py-1 self-start">
        <Text className="text-xs text-blue-600 font-medium">Combo</Text>
      </View>

      {/* Combo child items */}
      {expanded && children.length > 0 && (
        <View className="mt-3 bg-gray-50 rounded-lg p-3">
          {children.map((childItem) => (
            <View
              key={childItem.id}
              className="mb-2 border-b border-gray-100 pb-2 last:border-b-0 last:pb-0"
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-medium text-gray-700">
                  {childItem.name}
                </Text>

                {/* Status indicator for child item */}
                <View
                  className="rounded-full px-2 py-0.5 flex-row items-center"
                  style={{
                    backgroundColor: `${getStatusColor(
                      childItem.orderItemStatus
                    )}20`,
                  }}
                >
                  <View
                    className="w-1.5 h-1.5 rounded-full mr-1"
                    style={{
                      backgroundColor: getStatusColor(
                        childItem.orderItemStatus
                      ),
                    }}
                  />
                  <Text
                    className="text-xs font-medium"
                    style={{ color: getStatusColor(childItem.orderItemStatus) }}
                  >
                    {getStatusText(childItem.orderItemStatus)}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between mt-1">
                <Text className="text-xs text-gray-500">
                  Số lượng: {childItem.quantity}
                </Text>
                {childItem.price > 0 && (
                  <Text className="text-xs text-gray-500">
                    {childItem.price.toLocaleString("vi-VN")} VNĐ
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Confirmation Modal */}
      <ErrorModal
        visible={confirmModalVisible}
        title="Xác nhận"
        message={`Bạn có chắc muốn hủy "${combo.name}"?`}
        buttonText="Xác nhận"
        cancelText="Hủy"
        isWarning={true}
        onClose={confirmCancelItem}
        onCancel={() => setConfirmModalVisible(false)}
      />

      {/* Result Modal (Success/Error) */}
      <ErrorModal
        visible={resultModalVisible}
        title={resultModalTitle}
        message={resultModalMessage}
        buttonText="OK"
        isSuccess={resultModalIsSuccess}
        onClose={() => setResultModalVisible(false)}
      />
    </View>
  );
}
