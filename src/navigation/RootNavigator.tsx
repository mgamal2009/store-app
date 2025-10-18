import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import LoginScreen from "../screens/LoginScreen";
import AllProductsScreen from "../screens/AllProductsScreen";
import CategoryScreen from "../screens/CategoryScreen";
import {useSelector} from "react-redux";
import {RootState} from "../store";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="AllProducts" component={AllProductsScreen} options={{headerShown: false}}/>
      <Tab.Screen name="Category" component={CategoryScreen} options={{headerShown: false}}/>
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const token = useSelector((state: RootState) => state.auth.token);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!token ? (
        <Stack.Screen name="Login" component={LoginScreen}/>
      ) : (
        <Stack.Screen name="Main" component={MainTabs}/>
      )}
    </Stack.Navigator>
  );
}
