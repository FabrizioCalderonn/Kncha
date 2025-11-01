import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('client');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    const result = await register({ name, email, phone, password, role });
    setLoading(false);

    if (!result.success) {
      Alert.alert('Error', result.message || 'Error al registrarse');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: theme.primary }]}>
          Crear Cuenta
        </Text>
        <Text style={styles.subtitle}>
          Únete a Cancha a la Vista
        </Text>

        <View style={styles.inputContainer}>
          <Icon name="account" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="email" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Teléfono (opcional)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-check" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <Text style={styles.roleLabel}>Tipo de cuenta:</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'client' && { backgroundColor: theme.primary }]}
            onPress={() => setRole('client')}
          >
            <Text style={[styles.roleText, role === 'client' && styles.roleTextActive]}>
              Cliente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, role === 'owner' && { backgroundColor: theme.primary }]}
            onPress={() => setRole('owner')}
          >
            <Text style={[styles.roleText, role === 'owner' && styles.roleTextActive]}>
              Dueño
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Cargando...' : 'Registrarse'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>
            ¿Ya tienes cuenta? <Text style={{ color: theme.primary }}>Inicia sesión</Text>
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  roleLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  roleText: {
    color: '#666',
  },
  roleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
