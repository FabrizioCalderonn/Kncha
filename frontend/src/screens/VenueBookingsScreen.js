import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function VenueBookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useContext(ThemeContext);

  const renderBooking = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.userName}>{item.user_name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: theme.primary }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.fieldName}>{item.field_name}</Text>
      <View style={styles.bookingInfo}>
        <Icon name="calendar" size={16} color="#666" />
        <Text style={styles.infoText}>{item.booking_date}</Text>
      </View>
      <View style={styles.bookingInfo}>
        <Icon name="clock" size={16} color="#666" />
        <Text style={styles.infoText}>
          {item.start_time} - {item.end_time}
        </Text>
      </View>
      <Text style={styles.price}>${item.total_price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.headerTitle}>Reservas</Text>
      </View>

      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {}} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Cargando...' : 'No hay reservas'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  list: {
    padding: 15,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fieldName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  bookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#4CAF50',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});
