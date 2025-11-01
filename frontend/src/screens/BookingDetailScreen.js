import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as bookingService from '../services/bookingService';

export default function BookingDetailScreen({ route, navigation }) {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    loadBooking();
  }, []);

  const loadBooking = async () => {
    try {
      const response = await bookingService.getBooking(bookingId);
      setBooking(response.data);
    } catch (error) {
      console.error('Error loading booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancelar Reserva',
      '¿Estás seguro que deseas cancelar esta reserva?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await bookingService.cancelBooking(bookingId);
              Alert.alert('Éxito', 'Reserva cancelada');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'No se pudo cancelar la reserva');
            }
          },
        },
      ]
    );
  };

  if (loading || !booking) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Reserva</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.venueName}>{booking.venue_name}</Text>
          <Text style={styles.fieldName}>{booking.field_name}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Icon name="calendar" size={20} color="#666" />
            <Text style={styles.infoLabel}>Fecha:</Text>
            <Text style={styles.infoValue}>{booking.booking_date}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="clock" size={20} color="#666" />
            <Text style={styles.infoLabel}>Horario:</Text>
            <Text style={styles.infoValue}>
              {booking.start_time} - {booking.end_time}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="cash" size={20} color="#666" />
            <Text style={styles.infoLabel}>Total:</Text>
            <Text style={[styles.infoValue, styles.price]}>${booking.total_price}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="check-circle" size={20} color="#666" />
            <Text style={styles.infoLabel}>Estado:</Text>
            <Text style={styles.infoValue}>{booking.status}</Text>
          </View>
        </View>

        {booking.status === 'pending' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelBooking}
          >
            <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 20,
  },
  venueName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  fieldName: {
    fontSize: 18,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
    width: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    color: '#4CAF50',
    fontSize: 20,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    padding: 16,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
