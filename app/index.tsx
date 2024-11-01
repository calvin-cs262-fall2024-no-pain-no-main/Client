import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    // Start loading
    try {
      const response = await fetch('https://no-pain-no-main.azurewebsites.net/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message || 'Login failed :(');
      }

      const data = await response.json();
      console.log('Login successful:', data); // Log the response from server

      // If successful, navigate to the next page
      router.push(`/workouts`); // Adjust to your desired route
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Login Failed :(', error.message);
    }
  };

  const handleGetStarted = () => {
    // Handle "Get Started" button press
    router.push('/get-started'); // Adjust to your desired route
  };

  const handleAdmin = () => {
    // Handle "Admin" button press
    router.push('/(tabs)/workouts'); // Adjust to your desired route
  };

  const handleSignUp = () => {
    // Handle sign-up navigation
    router.push('/sign-up'); // Adjust to your desired route
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.adminButton} onPress={handleAdmin}>
        <Text style={styles.adminText}>Admin</Text>
      </TouchableOpacity>

      <Text style={styles.title}>REVIVE+</Text>
      <Image 
        source={require('../assets/images/gym-buddy.png')} // Correct image source
        style={styles.image}
        resizeMode="contain"
      />


      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignUp} style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Not a user yet? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',  // Background color
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    width: 250,
    height: 250,
    marginVertical: 20,
    alignSelf: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  getStartedButton: {
    backgroundColor: '#6200ea',  // Purple color
    padding: 12,
    borderRadius: 5,
    marginBottom: 12,
    alignItems: 'center',
  },
  getStartedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInButton: {
    backgroundColor: '#007BFF', // Blue color for Sign In button
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 12,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  adminButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#f0f0f0', // Light gray background
    padding: 8,
    borderRadius: 5,
  },
  adminText: {
    color: '#333',
    fontSize: 12,
  },
  signUpContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  signUpText: {
    color: '#007BFF', // Blue color for sign-up text
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default Login;
