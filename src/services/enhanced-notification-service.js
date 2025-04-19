import { EnhancedToast } from "../components/enhanced-toast-config";
import signalRService from "./SignalRService";
import AsyncStorage from "@react-native-async-storage/async-storage";

class EnhancedNotificationService {
  constructor() {
    this.isInitialized = false;
    this.unsubscribe = null;
    this.authCheckInterval = null;
    this.notificationHistory = [];
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      // Check if we have an auth token
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        this.setupAuthListener();
        return;
      }

      // Connect to SignalR hub
      await signalRService.start();

      // Subscribe to notification events
      this.unsubscribe = signalRService.on(
        "ReceiveNotification",
        this.handleNotification.bind(this)
      );

      this.isInitialized = true;

      // Setup auth token change listener
      this.setupAuthListener();
    } catch (error) {
      console.error("NotificationService: Failed to initialize:", error);
      // Try to reconnect after a delay
      setTimeout(() => this.initialize(), 5000);
    }
  }

  setupAuthListener() {
    // Clear any existing interval
    if (this.authCheckInterval) {
      clearInterval(this.authCheckInterval);
    }

    // Check for auth token changes every 10 seconds
    let lastToken = null;
    this.authCheckInterval = setInterval(async () => {
      try {
        const currentToken = await AsyncStorage.getItem("authToken");

        // If token changed and we have a new token
        if (currentToken !== lastToken && currentToken) {
          console.log(
            "NotificationService: Auth token changed, reconnecting..."
          );
          await signalRService.reconnect();

          if (!this.isInitialized) {
            // Subscribe to notification events if not already initialized
            this.unsubscribe = signalRService.on(
              "ReceiveNotification",
              this.handleNotification.bind(this)
            );
            this.isInitialized = true;
          }
        }

        // If token was removed (logout)
        if (lastToken && !currentToken) {
          console.log(
            "NotificationService: Auth token removed, disconnecting..."
          );
          this.shutdown();
          this.isInitialized = false;
        }

        lastToken = currentToken;
      } catch (error) {
        console.error("NotificationService: Error checking auth token:", error);
      }
    }, 10000);
  }

  handleNotification(notification) {
    try {
      console.log("Received notification:", notification);

      // Extract fields from the notification
      const {
        id = Date.now().toString(),
        title = "Thông báo",
        message = "",
        createdAt,
        payload = "",
        type,
      } = notification;

      // Format the message to include the zone (payload)
      const formattedMessage = this.formatNotificationMessage(message, payload);

      // Get notification type based on the type field
      const notificationType = this.getNotificationType(type);

      // Format timestamp
      const timestamp = createdAt ? new Date(createdAt) : new Date();

      // Add to notification history
      this.notificationHistory.push({
        id,
        title,
        message: formattedMessage, // Store the formatted message
        originalMessage: message, // Store the original message too
        type: notificationType,
        timestamp,
        payload,
        read: false,
        rawType: type,
      });

      // Limit history to last 50 notifications
      if (this.notificationHistory.length > 50) {
        this.notificationHistory.shift();
      }

      // Show toast notification using our enhanced toast
      EnhancedToast.show({
        type: notificationType,
        text1: title,
        text2: formattedMessage, // Use the formatted message
        payload,
      });
    } catch (error) {
      console.error("Error handling notification:", error);
      // Fallback to basic notification display
      EnhancedToast.show({
        type: "info",
        text1: "Thông báo mới",
        text2: "Bạn có thông báo mới",
      });
    }
  }

  formatNotificationMessage(message, payload) {
    // Clean up the payload (remove extra spaces)
    const cleanPayload = payload ? payload.trim() : "";

    // If we have a payload (zone), append it to the message
    if (cleanPayload) {
      return `${message} tại khu vực ${cleanPayload}`;
    }

    // If no payload, return the original message
    return message;
  }

  getNotificationType(type) {
    // Map numeric type to notification type
    switch (type) {
      case 0:
        return "info";
      case 1:
        return "warning";
      case 2:
        return "success";
      case 3:
        return "error";
      default:
        return "info";
    }
  }

  getNotificationHistory() {
    return [...this.notificationHistory];
  }

  markAsRead(id) {
    this.notificationHistory = this.notificationHistory.map((notification) => {
      if (notification.id === id) {
        return { ...notification, read: true };
      }
      return notification;
    });
  }

  clearHistory() {
    this.notificationHistory = [];
  }

  shutdown() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    if (this.authCheckInterval) {
      clearInterval(this.authCheckInterval);
      this.authCheckInterval = null;
    }

    signalRService.stop();
    this.isInitialized = false;
    console.log("NotificationService: Shutdown complete");
  }
}

// Create a singleton instance
const enhancedNotificationService = new EnhancedNotificationService();

export default enhancedNotificationService;
