import "./global.css";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import BottomBar from "./src/components/BottomBar";
import LoginScreen from "./src/screens/LoginScreen";
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen";
import QRCodePaymentScreen from "./src/screens/QRCodePaymentScreen";
import WorkScheduleScreen from "./src/screens/WorkScheduleScreen";
import ToDoWeekScreen from "./src/screens/ToDoWeek";
import SwapScreen from "./src/screens/SwapScreen";
import TablesScreen from "./src/screens/TablesScreen";
import TableDetailsScreen from "./src/screens/OrderDetailScreen";
import QRCheckInScreen from "./src/screens/ScanQRCheckIn";
import RegisteredShiftsScreen from "./src/screens/RegisteredShiftsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Tables"
        component={TablesScreen}
        options={{ tabBarLabel: "Bàn" }}
      />
      <Tab.Screen
        name="Store"
        component={QRCheckInScreen}
        options={{ tabBarLabel: "Checkin" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Cá nhân" }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="TableDetails" component={TableDetailsScreen} />
        <Stack.Screen name="QRCodePayment" component={QRCodePaymentScreen} />
        <Stack.Screen name="WorkSchedule" component={WorkScheduleScreen} />
        <Stack.Screen
          name="RegisteredShifts"
          component={RegisteredShiftsScreen}
        />
        <Stack.Screen name="ToDoWeek" component={ToDoWeekScreen} />
        <Stack.Screen name="SwapSchedule" component={SwapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
