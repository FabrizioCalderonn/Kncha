import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as venueService from '../services/venueService';

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const response = await venueService.getVenues();
      setVenues(response.data);
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Mi ubicación"
          pinColor="blue"
        />

        {venues.map((venue) => (
          venue.latitude && venue.longitude && (
            <Marker
              key={venue.id}
              coordinate={{
                latitude: parseFloat(venue.latitude),
                longitude: parseFloat(venue.longitude),
              }}
              title={venue.name}
              description={venue.address}
              onCalloutPress={() => navigation.navigate('VenueDetail', { venueId: venue.id })}
            />
          )
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
