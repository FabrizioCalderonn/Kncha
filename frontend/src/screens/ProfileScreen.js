import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'client':
        return 'Cliente';
      case 'owner':
        return 'Dueño';
      case 'admin':
        return 'Administrador';
      default:
        return role;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <View style={styles.avatar}>
          <Icon name="account" size={50} color="#fff" />
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{getRoleText(user?.role)}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          <View style={styles.infoRow}>
            <Icon name="email" size={20} color="#666" />
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>

          {user?.phone && (
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color="#666" />
              <Text style={styles.infoText}>{user?.phone}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="account-edit" size={24} color={theme.primary} />
            <Text style={styles.menuText}>Editar Perfil</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="lock" size={24} color={theme.primary} />
            <Text style={styles.menuText}>Cambiar Contraseña</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Icon name="logout" size={24} color="#F44336" />
            <Text style={[styles.menuText, { color: '#F44336' }]}>
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
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
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  infoText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
});
