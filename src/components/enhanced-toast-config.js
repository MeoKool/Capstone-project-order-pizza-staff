import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
} from "react-native";
import {
  X,
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
} from "lucide-react-native";

// Store for managing multiple toasts
const toastStore = {
  toasts: [],
  listeners: new Set(),

  addToast(toast) {
    const id = Date.now().toString();
    const newToast = { ...toast, id, createdAt: new Date() };
    this.toasts.unshift(newToast);
    this.notifyListeners();
    return id;
  },

  removeToast(id) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.notifyListeners();
  },

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.toasts));
  },
};

// Toast Manager Component
const ToastManager = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastStore.subscribe((newToasts) => {
      setToasts([...newToasts]);
    });

    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={toasts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ToastItem toast={item} />}
        contentContainerStyle={styles.toastList}
      />
    </View>
  );
};

// Individual Toast Item
const ToastItem = ({ toast }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDismiss = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      toastStore.removeToast(toast.id);
    });
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle size={24} color="#4CAF50" />;
      case "error":
        return <AlertCircle size={24} color="#F44336" />;
      case "info":
        return <Info size={24} color="#2196F3" />;
      case "warning":
      default:
        return <AlertTriangle size={24} color="#FF9800" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#F44336";
      case "info":
        return "#2196F3";
      case "warning":
      default:
        return "#FF9800";
    }
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          borderLeftColor: getBorderColor(),
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.iconContainer}>{getIcon()}</View>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {toast.text1}
        </Text>
        {toast.text2 ? (
          <Text style={styles.message} numberOfLines={3}>
            {toast.text2}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={handleDismiss}>
        <X size={18} color="#757575" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Enhanced Toast Configuration
export const enhancedToastConfig = {
  // Keep the original toast config for compatibility
  success: (props) => (
    <View style={[styles.toast, { borderLeftColor: "#4CAF50" }]}>
      <View style={styles.iconContainer}>
        <CheckCircle size={24} color="#4CAF50" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {props.text1}
        </Text>
        {props.text2 ? (
          <Text style={styles.message} numberOfLines={3}>
            {props.text2}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={props.onPress}>
        <X size={18} color="#757575" />
      </TouchableOpacity>
    </View>
  ),
  error: (props) => (
    <View style={[styles.toast, { borderLeftColor: "#F44336" }]}>
      <View style={styles.iconContainer}>
        <AlertCircle size={24} color="#F44336" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {props.text1}
        </Text>
        {props.text2 ? (
          <Text style={styles.message} numberOfLines={3}>
            {props.text2}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={props.onPress}>
        <X size={18} color="#757575" />
      </TouchableOpacity>
    </View>
  ),
  info: (props) => (
    <View style={[styles.toast, { borderLeftColor: "#2196F3" }]}>
      <View style={styles.iconContainer}>
        <Info size={24} color="#2196F3" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {props.text1}
        </Text>
        {props.text2 ? (
          <Text style={styles.message} numberOfLines={3}>
            {props.text2}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={props.onPress}>
        <X size={18} color="#757575" />
      </TouchableOpacity>
    </View>
  ),
  warning: (props) => (
    <View style={[styles.toast, { borderLeftColor: "#FF9800" }]}>
      <View style={styles.iconContainer}>
        <AlertTriangle size={24} color="#FF9800" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {props.text1}
        </Text>
        {props.text2 ? (
          <Text style={styles.message} numberOfLines={3}>
            {props.text2}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={props.onPress}>
        <X size={18} color="#757575" />
      </TouchableOpacity>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  toastList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  toast: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderLeftWidth: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 60,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: "#616161",
  },
  closeButton: {
    padding: 4,
  },
});

// Enhanced Toast API
export const EnhancedToast = {
  show: ({ type = "info", text1, text2, ...rest }) => {
    toastStore.addToast({ type, text1, text2, ...rest });
  },
  success: (text1, text2, options = {}) => {
    toastStore.addToast({ type: "success", text1, text2, ...options });
  },
  error: (text1, text2, options = {}) => {
    toastStore.addToast({ type: "error", text1, text2, ...options });
  },
  info: (text1, text2, options = {}) => {
    toastStore.addToast({ type: "info", text1, text2, ...options });
  },
  warning: (text1, text2, options = {}) => {
    toastStore.addToast({ type: "warning", text1, text2, ...options });
  },
  hide: (id) => {
    if (id) {
      toastStore.removeToast(id);
    }
  },
  ToastManager,
};
