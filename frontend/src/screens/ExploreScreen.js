import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as venueService from '../services/venueService';

export default function ExploreScreen({ navigation }) {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const response = await venueService.getVenues({ search });
      setVenues(response.data);
    } catch (error) {
      console.error('Error loading venues:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadVenues();
  };

  const renderVenue = ({ item }) => (
    <TouchableOpacity
      style={styles.venueCard}
      onPress={() => navigation.navigate('VenueDetail', { venueId: item.id })}
    >
      <View style={styles.venueInfo}>
        <Text style={styles.venueName}>{item.name}</Text>
        <Text style={styles.venueAddress}>{item.address}</Text>
        <Text style={styles.venueFields}>{item.fields_count || 0} canchas disponibles</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.headerTitle}>Explorar Canchas</Text>

        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar canchas..."
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={loadVenues}
          />
        </View>
      </View>

      <FlatList
        data={venues}
        renderItem={renderVenue}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Cargando...' : 'No se encontraron canchas'}
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
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
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
  venueFields: {
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
