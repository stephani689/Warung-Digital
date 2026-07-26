import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import HistoryScreen from '../screens/HistoryScreen';
import DetailScreen from '../screens/DetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import colors from '../constants/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Katalog: 'pricetags',
  Keranjang: 'cart',
  Riwayat: 'receipt',
  Profil: 'person-circle',
};

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={focused ? TAB_ICONS[route.name] : `${TAB_ICONS[route.name]}-outline`}
            size={size ? size - 2 : 20}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Katalog" component={HomeScreen} options={{ title: 'Katalog Warung', headerShown: false }} />
      <Tab.Screen name="Keranjang" component={CartScreen} options={{ title: 'Keranjang Belanja', headerShown: false }} />
      <Tab.Screen name="Riwayat" component={HistoryScreen} options={{ title: 'Riwayat Transaksi', headerShown: false }} />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ title: 'Profil UMKM', headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainApp" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} options={{ title: 'Detail Produk' }} />
    </Stack.Navigator>
  );
}
