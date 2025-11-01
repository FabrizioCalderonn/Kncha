import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as bookingService from '../services/bookingService';

export default function CreateBookingScreen({ route, navigation }) {
  const { field } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const { theme } = useContext(ThemeContext);

  const calculateTotal = () => {
    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);
    const hours = end - start;
    return hours * field.price_per_hour;
  };

  const handleCreateBooking = async () => {
    try {
      const start = parseInt(startTime.split(':')[0]);
      const end = parseInt(endTime.split(':')[0]);
      const totalHours = end - start;

      if (totalHours <= 0) {
        Alert.alert('Error', 'La hora de fin debe ser mayor a la hora de inicio');
        return;
      }

      const bookingData = {
        field_id: field.id,
        booking_date: selectedDate,
        start_time: startTime,
        end_time: endTime,
        total_hours: totalHours,
        total_price: calculateTotal(),
        payment_method: 'pending',
        notes: ''
      };

      const response = await bookingService.createBooking(bookingData);

      if (response.success) {
        navigation.navigate('PaymentMethod', { booking: response.data });
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'No se pudo crear la reserva');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Reserva</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.fieldName}>{field.name}</Text>
          <Text style={styles.sportType}>{field.sport_type}</Text>
          <Text style={styles.pricePerHour}>${field.price_per_hour}/hora</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fecha y Horario</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>{selectedDate}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hora de inicio:</Text>
            <Text style={styles.value}>{startTime}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hora de fin:</Text>
            <Text style={styles.value}>{endTime}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: theme.primary }]}
          onPress={handleCreateBooking}
        >
          <Text style={styles.bookButtonText}>Reservar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  fieldName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sportType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  pricePerHour: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  bookButton: {
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
