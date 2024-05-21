import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import myDestinationLogo from '../assets/images/myDestinationLogo.png';
import SignUpScreen from './SignUpScreen';
import { handleLogin } from '../services/authService';
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    handleLogin(email, password);
    console.log('Sign In pressed');
  };

  const handleSignUp = () => {
    // Handle navigation to sign up screen here
    console.log('Sign Up pressed');
  };

  const navigation = useNavigation();

  const navigateToRegister = () => {
    navigation.navigate('SignUpScreen');
  }

  return (
    <View style={styles.container}>
      <Image source={myDestinationLogo} style={styles.logo} />
      <Text style={styles.title}>Welcome back!</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        placeholderTextColor="#ffffff"
        onChangeText={newText => setEmail(newText)}
        defaultValue={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ffffff"
        value={password}
        onChangeText={newText => setPassword(newText)}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.buttonSecondary} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  buttonPrimary: {
    width: '46%',
    height: 60,
    backgroundColor: '#108DF9',
    borderRadius: 25,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  buttonSecondary: {
    width: '46%',
    height: 60,
    borderColor: '#108DF9',
    backgroundColor: '#3C3E47',
    borderWidth: 3,
    borderRadius: 25,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  buttonText: {

  }
});

export default SignInScreen;
