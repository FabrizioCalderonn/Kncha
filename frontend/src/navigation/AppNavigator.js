import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

// Auth Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Client Screens
import ExploreScreen from '../screens/ExploreScreen';
import MapScreen from '../screens/MapScreen';
import BookingsScreen from '../screens/BookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import VenueDetailScreen from '../screens/VenueDetailScreen';
import BookingDetailScreen from '../screens/BookingDetailScreen';
import CreateBookingScreen from '../screens/CreateBookingScreen';
import PaymentMethodScreen from '../screens/PaymentMethodScreen';

// Owner Screens
import MyVenuesScreen from '../screens/MyVenuesScreen';
import VenueBookingsScreen from '../screens/VenueBookingsScreen';
import OwnerStatsScreen from '../screens/OwnerStatsScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminUsersScreen from '../screens/AdminUsersScreen';
import AdminVenuesScreen from '../screens/AdminVenuesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Client Tabs
function ClientTabs() {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, size }) => (
            <Icon name="soccer-field" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <Icon name="map-marker" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          title: 'Reservas',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-check" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Owner Tabs
function OwnerTabs() {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="MyVenues"
        component={MyVenuesScreen}
        options={{
          title: 'Mis Canchas',
          tabBarIcon: ({ color, size }) => (
            <Icon name="soccer-field" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="VenueBookings"
        component={VenueBookingsScreen}
        options={{
          title: 'Reservas',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-check" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={OwnerStatsScreen}
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color, size}) => (
            <Icon name="chart-bar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Admin Tabs
function AdminTabs() {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Users"
        component={AdminUsersScreen}
        options={{
          title: 'Usuarios',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Venues"
        component={AdminVenuesScreen}
        options={{
          title: 'Canchas',
          tabBarIcon: ({ color, size }) => (
            <Icon name="soccer-field" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main Navigator
export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null; // Podrías mostrar un splash screen aquí
  }

  // Seleccionar tabs según el rol
  const getMainScreen = () => {
    if (!user) return null;

    switch (user.role) {
      case 'owner':
        return <Stack.Screen name="MainTabs" component={OwnerTabs} />;
      case 'admin':
        return <Stack.Screen name="MainTabs" component={AdminTabs} />;
      default:
        return <Stack.Screen name="MainTabs" component={ClientTabs} />;
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          {getMainScreen()}
          <Stack.Screen name="VenueDetail" component={VenueDetailScreen} />
          <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
          <Stack.Screen name="CreateBooking" component={CreateBookingScreen} />
          <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
