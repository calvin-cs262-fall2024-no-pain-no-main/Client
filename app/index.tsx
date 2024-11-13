import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // For icons
import Icon from 'react-native-vector-icons/FontAwesome5';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
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
      console.log('Login successful:', data);

      router.push(`/workouts`); // Adjust to your desired route
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Login Failed :(', error.message);
    }
  };

  const handleSignUp = () => {
    router.push('/sign-up'); // Adjust to your desired route
  };

  const handleAdmin = () => {
    router.push('/(tabs)/workouts'); // Adjust to your desired route for admin
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/VigilFullLogo.png')} style={styles.titleImage} resizeMode='contain'/>

      <TouchableOpacity style={styles.adminButton} onPress={handleAdmin}>
        <Text style={styles.adminText}>Admin</Text>
      </TouchableOpacity>

      {/* Username Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={24} color="white" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={24} color="white" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInText}>Log in</Text>
      </TouchableOpacity>

      {/* Sign-up Link */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signUpLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#0D1B2A',
  },
  titleImage: {
    width: '90%',
    height : '20%',
    alignSelf: 'center',
    marginBottom: 100,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginBottom: 20,
    marginHorizontal: 40, // Add margin to center the input fields more
  },
  icon: {
    marginRight: 0,
  },
  input: {
    height: 40,
    flex: 1,
    paddingHorizontal: 8,
    fontFamily: 'SpaceMono',
    color: 'white',
  },
  signInButton: {
    backgroundColor: '#0E2A2B', // Dark green background color
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10, // Rounded corners
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: 40,
    borderWidth: 1.5,
    borderColor: '#A5D6A7', // Light green border color
    shadowColor: '#A5D6A7', // Glow effect color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5, // For Android shadow effect
  },
  signInText: {
    color: '#A5D6A7', // Light green text color
    fontSize: 16,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    color: 'white',
    fontSize: 16,
  },
  signUpLink: {
    color: '#A5D6A7',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  adminButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 5,
  },
  adminText: {
    color: '#333',
    fontSize: 12,
  },
});

export default Login;
