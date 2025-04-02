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
    const title = notification.title || "Thông báo";
    const message = notification.message || "";
    const type = this.getNotificationType(notification);

    // Add to notification history
    this.notificationHistory.push({
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
    });

    // Limit history to last 50 notifications
    if (this.notificationHistory.length > 50) {
      this.notificationHistory.shift();
    }

    // Show toast notification using our enhanced toast
    EnhancedToast.show({
      type: "warning",
      text1: title,
      text2: message,
    });
  }

  getNotificationType(notification) {
    // Determine notification type based on content or priority
    if (notification.priority === "high" || notification.isUrgent) {
      return "error";
    }

    if (notification.priority === "medium" || notification.isWarning) {
      return "warning";
    }

    if (notification.isSuccess) {
      return "success";
    }

    return "info";
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
