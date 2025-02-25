import React from "react";
import "./global.css";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/screens/HomeScreen";
import StoreScreen from "./src/screens/StoreScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import BottomBar from "./src/components/BottomBar";
import LoginScreen from "./src/screens/LoginScreen";
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen";
import PaymentScreen from "./src/screens/PaymentScreen";
import ToDoWeekScreen from "./src/screens/ToDoWeek";
import TableDetailsScreen from "./src/screens/table-details-screen";
import QRCodePaymentScreen from "./src/screens/QRCodePaymentScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          tabBarLabel: "Bàn",
        }}
      />
      <Tab.Screen
        name="Store"
        component={StoreScreen}
        options={{
          tabBarLabel: "Cửa hàng",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Cá nhân",
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="TableDetails" component={TableDetailsScreen} />
        <Stack.Screen name="QRCodePayment" component={QRCodePaymentScreen} />
        <Stack.Screen
          name="ToDoWeek"
          component={ToDoWeekScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
