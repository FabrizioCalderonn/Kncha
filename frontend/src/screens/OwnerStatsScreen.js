import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function OwnerStatsScreen() {
  const { theme } = useContext(ThemeContext);

  const stats = {
    totalRevenue: 2500,
    totalBookings: 45,
    confirmedBookings: 38,
    pendingBookings: 7,
  };

  const StatCard = ({ icon, title, value, color }) => (
    <View style={styles.statCard}>
      <Icon name={icon} size={40} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.headerTitle}>Estadísticas</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <StatCard
            icon="cash"
            title="Ingresos Totales"
            value={`$${stats.totalRevenue}`}
            color="#4CAF50"
          />
          <StatCard
            icon="calendar-check"
            title="Total Reservas"
            value={stats.totalBookings}
            color={theme.primary}
          />
          <StatCard
            icon="check-circle"
            title="Confirmadas"
            value={stats.confirmedBookings}
            color="#4CAF50"
          />
          <StatCard
            icon="clock-alert"
            title="Pendientes"
            value={stats.pendingBookings}
            color="#FF9800"
          />
        </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    margin: '1%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
