import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function AdminUsersScreen() {
  const { theme } = useContext(ThemeContext);
  const [users] = React.useState([]);

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <Icon name="account" size={40} color={theme.primary} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userRole}>{item.role}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.headerTitle}>Usuarios</Text>
      </View>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay usuarios</Text>
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
  userCard: {
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
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userRole: {
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
