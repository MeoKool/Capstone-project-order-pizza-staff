"use client";

import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useSignalR } from "../hooks/useSignalR";

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const { isConnected, on } = useSignalR();

  useEffect(() => {
    if (isConnected) {
      // Subscribe to notification events
      const unsubscribe = on("ReceiveNotification", (notification) => {
        console.log("Received notification:", notification);
        setNotifications((prev) => [notification, ...prev]);
      });

      return unsubscribe;
    }
  }, [isConnected, on]);

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTime}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  if (!isConnected) {
    return null;
  }

  return (
    <FlatList
      data={notifications}
      renderItem={renderNotification}
      keyExtractor={(item) => item.id}
      style={styles.notificationList}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No notifications yet</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  notificationList: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  notificationItem: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationMessage: {
    fontSize: 16,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#757575",
  },
  emptyText: {
    textAlign: "center",
    color: "#757575",
    marginTop: 24,
  },
});
