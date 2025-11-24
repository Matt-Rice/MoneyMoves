import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/auth';
import { useApi } from '../lib/api';
import axios from 'axios';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please enter username, email, and password');
      return;
    }

    setLoading(true);
    try {
      const api = useApi();
      // Call login API    
      const response = await api.post('/api/register', { name, email, password });
      const data = response.data;
      const token = data.token;

      if (!token) {
        throw new Error('No token received from server');
      }

      // Store token in SecureStore and update auth state
      await signIn(token, {
        id: data.user?.id || 'user',
        email: data.user?.email || email,
        name: data.user?.name,
      });

      // Navigate to home/dashboard
      router.replace('./(tabs)/index');
    } catch (error) {
      console.error('Login error:', error);
      let message = 'An error occurred';
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          message = 'Invalid email or password';
        } else if (error.response?.status === 404) {
          message = 'Account not found';
        } else if (error.response?.status === 422) {
          message = error.response?.data?.message || 'Validation error';
        } else {
          message = error.response?.data?.message || error.message;
        }
      }
      
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
        editable={!loading}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        editable={!loading}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

        <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => router.replace('./login')}
            disabled={loading}
        >
            {loading ? (
            <ActivityIndicator color="#fff" />
            ) : (
            <Text style={styles.buttonText}>Go to Login</Text>
            )}
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


