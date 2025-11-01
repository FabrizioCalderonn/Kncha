import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function WelcomeScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <View style={styles.content}>
        <Icon name="soccer" size={100} color="#fff" />
        <Text style={styles.title}>Cancha a la Vista</Text>
        <Text style={styles.subtitle}>
          Encuentra y reserva canchas deportivas en El Salvador
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#fff' }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={[styles.buttonText, { color: theme.primary }]}>
            Iniciar Sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonTextOutline}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.9,
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextOutline: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
