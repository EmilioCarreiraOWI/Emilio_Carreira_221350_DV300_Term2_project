import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import myDestinationLogo from '../assets/images/myDestinationLogo.png';
import { handleLogin } from '../services/authService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../app/index'; // Adjusted path

// Define the navigation prop type for SignInScreen
type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignInScreen'>;

const SignInScreen = () => {
  // State hooks for managing form inputs and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Function to handle sign in button press
  const handleSignIn = async () => {
    try {
      await handleLogin(email, password);
      console.log('Sign In pressed');
    } catch (err) {
      setError('Invalid email or password'); // Assuming the error thrown is related to invalid credentials
    }
  };

  // Hook to access navigation functionality
  const navigation = useNavigation<SignInScreenNavigationProp>();

  // Main component render function
  return (
    <View style={styles.container}>
      <Image source={myDestinationLogo} style={styles.logo} />
      <Text style={styles.title}>Welcome back!</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        placeholderTextColor="#ffffff"
        onChangeText={setEmail}
        defaultValue={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Your Password"
        placeholderTextColor="#ffffff"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for the SignInScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
    backgroundColor: '#24252A',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    marginTop: -10,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    flexShrink: 0,
    color: '#FFCE1C',
  },
  input: {
    width: '90%',
    height: 60,
    marginBottom: 10,
    borderRadius: 25,
    borderColor: '#108DF9',
    borderWidth: 3,
    padding: 10,
    backgroundColor: '#3C3E47',
    color: '#ffffff',
  },
  errorText: {
    width: '90%',
    color: 'red',
    marginBottom: 10,
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  buttonPrimary: {
    width: '100%',
    height: 60,
    backgroundColor: '#108DF9',
    borderRadius: 25,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  buttonText: {
    color: '#fff'
  }
});

export default SignInScreen;
