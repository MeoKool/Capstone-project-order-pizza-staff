import Toast from "react-native-toast-message";
import signalRService from "./SignalRService";
import AsyncStorage from "@react-native-async-storage/async-storage";

class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.unsubscribe = null;
    this.authCheckInterval = null;
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

    // Show toast notification
    Toast.show({
      type: "success",
      text1: title,
      text2: message,
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
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

  // Method to manually test toast notifications with the exact format
  testToast() {
    console.log("NotificationService: Testing toast notification");
    this.handleNotification({
      id: 0,
      type: 1,
      title: "Gọi nhân viên",
      message: "Có yêu cầu gọi nhân viên tại bàn 2 - khu vực A",
      payload: "A",
      createdAt: "2025-04-01T11:39:42.7108467+00:00",
    });
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService;
