"use client";

import { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

/**
 * CustomModal - A modern, elegant modal component for React Native
 *
 * @param {boolean} visible - Controls modal visibility
 * @param {string} title - Modal title
 * @param {string} message - Modal message content
 * @param {string} type - Modal type: 'success', 'error', 'warning', 'info'
 * @param {function} onClose - Function called when modal is closed
 * @param {string} primaryButtonText - Text for primary button
 * @param {function} onPrimaryButtonPress - Function for primary button
 * @param {string} secondaryButtonText - Text for secondary button (optional)
 * @param {function} onSecondaryButtonPress - Function for secondary button (optional)
 * @param {boolean} autoClose - Whether to auto close the modal after a delay
 * @param {number} autoCloseTime - Time in ms before auto closing (default: 3000)
 */
const CustomModal = ({
  visible,
  title,
  message,
  type = "info", // 'success', 'error', 'warning', 'info'
  onClose,
  primaryButtonText = "OK",
  onPrimaryButtonPress,
  secondaryButtonText,
  onSecondaryButtonPress,
  autoClose = false,
  autoCloseTime = 3000,
}) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  // Auto close timer
  useEffect(() => {
    let timer;
    if (visible && autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
    }
    return () => clearTimeout(timer);
  }, [visible, autoClose, autoCloseTime, onClose]);

  // Animation when modal becomes visible
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations when modal is hidden
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
      translateY.setValue(20);
    }
  }, [visible, fadeAnim, scaleAnim, translateY]);

  // Handle primary button press
  const handlePrimaryButtonPress = () => {
    if (onPrimaryButtonPress) {
      onPrimaryButtonPress();
    } else {
      onClose();
    }
  };

  // Get icon and colors based on type
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle size={24} color="#10B981" />,
          color: "#10B981",
          lightColor: "#D1FAE5",
        };
      case "error":
        return {
          icon: <AlertTriangle size={24} color="#EF4444" />,
          color: "#EF4444",
          lightColor: "#FEE2E2",
        };
      case "warning":
        return {
          icon: <AlertCircle size={24} color="#F59E0B" />,
          color: "#F59E0B",
          lightColor: "#FEF3C7",
        };
      case "info":
      default:
        return {
          icon: <Info size={24} color="#3B82F6" />,
          color: "#3B82F6",
          lightColor: "#DBEAFE",
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ scale: scaleAnim }, { translateY: translateY }],
                },
              ]}
            >
              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: typeStyles.lightColor },
                ]}
              >
                {typeStyles.icon}
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                {secondaryButtonText && (
                  <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={onSecondaryButtonPress || onClose}
                  >
                    <Text style={styles.secondaryButtonText}>
                      {secondaryButtonText}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.primaryButton,
                    { backgroundColor: typeStyles.color },
                    secondaryButtonText ? { flex: 1 } : { minWidth: "100%" },
                  ]}
                  onPress={handlePrimaryButtonPress}
                >
                  <Text style={styles.primaryButtonText}>
                    {primaryButtonText}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 10000,
    padding: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "center",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#111827",
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    color: "#4B5563",
    lineHeight: 22,
    marginBottom: 24,
  },
  footer: {
    flexDirection: "row",
    marginTop: 8,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
  },
  secondaryButton: {
    backgroundColor: "#F3F4F6",
    marginRight: 12,
    flex: 1,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  secondaryButtonText: {
    color: "#4B5563",
    fontWeight: "600",
    fontSize: 15,
  },
});

export default CustomModal;
