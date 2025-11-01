import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as venueService from '../services/venueService';
import * as fieldService from '../services/fieldService';

export default function VenueDetailScreen({ route, navigation }) {
  const { venueId } = route.params;
  const [venue, setVenue] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    loadVenueDetails();
  }, []);

  const loadVenueDetails = async () => {
    try {
      const venueResponse = await venueService.getVenue(venueId);
      setVenue(venueResponse.data);

      const fieldsResponse = await fieldService.getFieldsByVenue(venueId);
      setFields(fieldsResponse.data);
    } catch (error) {
      console.error('Error loading venue:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{venue?.name}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          <View style={styles.infoRow}>
            <Icon name="map-marker" size={20} color="#666" />
            <Text style={styles.infoText}>{venue?.address}</Text>
          </View>
          {venue?.phone && (
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color="#666" />
              <Text style={styles.infoText}>{venue.phone}</Text>
            </View>
          )}
          {venue?.description && (
            <Text style={styles.description}>{venue.description}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Canchas Disponibles ({fields.length})</Text>
          {fields.map((field) => (
            <TouchableOpacity
              key={field.id}
              style={styles.fieldCard}
              onPress={() =>
                navigation.navigate('CreateBooking', { field })
              }
            >
              <View style={styles.fieldInfo}>
                <Text style={styles.fieldName}>{field.name}</Text>
                <Text style={styles.fieldType}>{field.sport_type}</Text>
                <Text style={styles.fieldPrice}>${field.price_per_hour}/hora</Text>
              </View>
              <View>
                {field.has_lighting && <Icon name="lightbulb" size={20} color="#FFC107" />}
                {field.has_roof && <Icon name="umbrella" size={20} color="#2196F3" />}
              </View>
            </TouchableOpacity>
          ))}
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
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    lineHeight: 20,
  },
  fieldCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldInfo: {
    flex: 1,
  },
  fieldName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fieldType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  fieldPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
