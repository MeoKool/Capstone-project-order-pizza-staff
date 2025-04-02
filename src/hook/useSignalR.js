import { useEffect, useState, useCallback } from "react";
import signalRService from "../SignalRService";

export function useSignalR(options = {}) {
  const { autoConnect = true } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async () => {
    if (isConnected || isConnecting) return;

    try {
      setIsConnecting(true);
      setError(null);
      await signalRService.start();
      setIsConnected(true);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to connect to SignalR")
      );
    } finally {
      setIsConnecting(false);
    }
  }, [isConnected, isConnecting]);

  const disconnect = useCallback(async () => {
    if (!isConnected) return;

    try {
      await signalRService.stop();
      setIsConnected(false);
    } catch (err) {
      console.error("Error disconnecting from SignalR:", err);
    }
  }, [isConnected]);

  const on = useCallback((methodName, callback) => {
    return signalRService.on(methodName, callback);
  }, []);

  const invoke = useCallback(
    async (methodName, ...args) => {
      if (!isConnected) {
        throw new Error("Cannot invoke method: SignalR is not connected");
      }
      return signalRService.invoke(methodName, ...args);
    },
    [isConnected]
  );

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    on,
    invoke,
  };
}
