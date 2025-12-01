import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../lib/auth';
import { useApi } from '../../lib/api';
import { useRouter } from 'expo-router';
import axios from 'axios';

export type User ={
  id: string;
  email: string;
  name: string;
}

export default function HomeTab() {
  const { user, signOut } = useAuth();
  const api = useApi();
  const router = useRouter();
  const [userResponse, setUserResponse] = useState<User>();
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/user');
      setUserResponse(response.data);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to fetch data';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('../login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.name || user?.email}</Text>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : userResponse ? (
        <Text style={styles.text}>{userResponse.id + ' - ' + userResponse.email + ' - ' + userResponse.name}</Text>
      ) : (
        <Text style={styles.text}>No data yet</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#25292e',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    marginBottom: 20,
    color: '#ffffffff',
  },
  text: {
    fontSize: 14,
    marginBottom: 20,
    color: '#ffffffff',
  },
  loader: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
