import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

export default function PaymentMethodScreen({ route, navigation }) {
  const { booking } = route.params;
  const { theme } = useContext(ThemeContext);

  const bankDetails = {
    bankName: 'Banco Agrícola',
    accountType: 'Cuenta Corriente',
    accountNumber: '0123456789',
    accountHolder: 'Tu Empresa S.A. de C.V.',
    reference: `RESERVA-${booking.id}`
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copiado', 'Información copiada al portapapeles');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.headerTitle}>Método de Pago</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tu reserva fue creada exitosamente</Text>
          <Text style={styles.subtitle}>
            Por favor selecciona un método de pago para confirmar tu reserva
          </Text>
        </View>

        <View style={styles.paymentOption}>
          <View style={styles.optionHeader}>
            <Icon name="bank" size={30} color={theme.primary} />
            <Text style={styles.optionTitle}>Transferencia Bancaria</Text>
          </View>

          <View style={styles.bankDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Banco:</Text>
              <Text style={styles.detailValue}>{bankDetails.bankName}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tipo de cuenta:</Text>
              <Text style={styles.detailValue}>{bankDetails.accountType}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Número de cuenta:</Text>
              <Text style={styles.detailValue}>{bankDetails.accountNumber}</Text>
              <TouchableOpacity onPress={() => copyToClipboard(bankDetails.accountNumber)}>
                <Icon name="content-copy" size={20} color={theme.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Titular:</Text>
              <Text style={styles.detailValue}>{bankDetails.accountHolder}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Referencia:</Text>
              <Text style={styles.detailValue}>{bankDetails.reference}</Text>
              <TouchableOpacity onPress={() => copyToClipboard(bankDetails.reference)}>
                <Icon name="content-copy" size={20} color={theme.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total a pagar:</Text>
              <Text style={styles.totalValue}>${booking.total_price}</Text>
            </View>
          </View>

          <Text style={styles.note}>
            Nota: Una vez realizada la transferencia, el dueño de la cancha confirmará tu pago.
          </Text>
        </View>

        <View style={styles.paymentOption}>
          <View style={styles.optionHeader}>
            <Icon name="cash" size={30} color={theme.primary} />
            <Text style={styles.optionTitle}>Pago en Efectivo</Text>
          </View>

          <Text style={styles.cashNote}>
            Puedes pagar en efectivo directamente en la cancha antes de tu reserva.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('Bookings')}
        >
          <Text style={styles.continueButtonText}>Entendido</Text>
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
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  paymentOption: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 15,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bankDetails: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 120,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  note: {
    fontSize: 12,
    color: '#999',
    marginTop: 15,
    fontStyle: 'italic',
  },
  cashNote: {
    fontSize: 14,
    color: '#666',
  },
  continueButton: {
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
