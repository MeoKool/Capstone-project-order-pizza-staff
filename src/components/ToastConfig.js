import { View, Text, StyleSheet } from "react-native";
import { BaseToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={styles.toast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.title}
      text2Style={styles.message}
      text1NumberOfLines={2}
      text2NumberOfLines={3}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={[styles.toast, styles.errorToast]}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.title}
      text2Style={styles.message}
      text1NumberOfLines={2}
      text2NumberOfLines={3}
    />
  ),
  notification: ({ text1, text2, ...props }) => (
    <View style={styles.customToast}>
      <Text style={styles.customTitle} numberOfLines={2}>
        {text1}
      </Text>
      <Text style={styles.customMessage} numberOfLines={3}>
        {text2}
      </Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  toast: {
    borderLeftColor: "#4CAF50",
    backgroundColor: "#ffffff",
    height: "auto",
    minHeight: 60,
    paddingVertical: 10,
    width: "90%",
  },
  errorToast: {
    borderLeftColor: "#F44336",
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  message: {
    fontSize: 14,
    color: "#333333",
  },
  customToast: {
    height: "auto",
    width: "90%",
    backgroundColor: "#333333",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  customTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  customMessage: {
    fontSize: 14,
    color: "#ffffff",
  },
});
