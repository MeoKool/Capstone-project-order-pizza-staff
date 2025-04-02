import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import AsyncStorage from "@react-native-async-storage/async-storage";

class SignalRService {
  constructor(hubUrl) {
    this.hubUrl = hubUrl;
    this.connection = null;
    this.connectionPromise = null;
    this.listeners = new Map();
    this.isConnected = false;
  }

  async start() {
    if (this.connection) {
      return this.connectionPromise;
    }

    try {
      // Get the authentication token from AsyncStorage
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.warn("SignalR: No authentication token found in AsyncStorage");
      } else {
        console.log("SignalR: Retrieved authentication token");
      }

      // Create the connection with the authentication token
      this.connection = new HubConnectionBuilder()
        .withUrl(this.hubUrl, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();

      // Set up event handlers for connection state changes
      this.connection.onreconnecting(() => {
        console.log("SignalR: Reconnecting...");
        this.isConnected = false;
      });

      this.connection.onreconnected(() => {
        console.log("SignalR: Reconnected successfully");
        this.isConnected = true;
      });

      this.connection.onclose(() => {
        console.log("SignalR: Connection closed");
        this.isConnected = false;
      });

      // Start the connection
      this.connectionPromise = this.connection.start();

      await this.connectionPromise;
      console.log("SignalR: Connected successfully");
      this.isConnected = true;

      // Register all listeners after connection is established
      this.registerAllListeners();
    } catch (error) {
      console.error("SignalR: Error starting connection:", error);
      this.connection = null;
      this.connectionPromise = null;
      this.isConnected = false;
      throw error;
    }

    return this.connectionPromise;
  }

  async stop() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.connectionPromise = null;
      this.isConnected = false;
    }
  }

  on(methodName, callback) {
    // Create a set for this method if it doesn't exist
    if (!this.listeners.has(methodName)) {
      this.listeners.set(methodName, new Set());
    }

    // Add the callback to the set
    this.listeners.get(methodName).add(callback);

    // Register the listener if we're already connected
    if (this.connection && this.isConnected) {
      this.registerListener(methodName);
    }

    // Return a function to unsubscribe
    return () => {
      const methodListeners = this.listeners.get(methodName);
      if (methodListeners) {
        methodListeners.delete(callback);
      }
    };
  }

  async invoke(methodName, ...args) {
    if (!this.connection || !this.isConnected) {
    }

    try {
      return await this.connection.invoke(methodName, ...args);
    } catch (error) {
      console.error(`SignalR: Error invoking ${methodName}:`, error);
      throw error;
    }
  }

  registerAllListeners() {
    if (!this.connection) return;

    // Register all method listeners
    for (const methodName of this.listeners.keys()) {
      this.registerListener(methodName);
    }
  }

  registerListener(methodName) {
    if (!this.connection || !this.listeners.has(methodName)) return;

    this.connection.on(methodName, (data) => {
      console.log(`SignalR: Received data from "${methodName}":`, data);

      const callbacks = this.listeners.get(methodName);
      if (callbacks) {
        callbacks.forEach((callback) => {
          try {
            callback(data);
          } catch (error) {
            console.error(`SignalR: Error in ${methodName} callback:`, error);
          }
        });
      }
    });
  }

  // Method to reconnect with a new token (useful after login)
  async reconnect() {
    await this.stop();
    return this.start();
  }
}

// Create a singleton instance for the specified hub
const signalRService = new SignalRService(
  "https://vietsac.id.vn/notificationHub"
);

export default signalRService;
