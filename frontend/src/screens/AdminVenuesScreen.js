import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function AdminVenuesScreen() {
  const { theme } = useContext(ThemeContext);
  const [venues] = React.useState([]);

  const renderVenue = ({ item }) => (
    <View style={styles.venueCard}>
      <View style={styles.venueInfo}>
        <Text style={styles.venueName}>{item.name}</Text>
        <Text style={styles.venueAddress}>{item.address}</Text>
        <Text style={styles.venueOwner}>Dueño: {item.owner_name}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#999" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.headerTitle}>Canchas</Text>
      </View>

      <FlatList
        data={venues}
        renderItem={renderVenue}
        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay canchas registradas</Text>
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
  venueCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  venueOwner: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});
