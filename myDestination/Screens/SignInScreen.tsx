import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import myDestinationLogo from '../assets/images/myDestinationLogo.png';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    // Handle sign in logic here
    console.log('Sign In pressed');
  };

  const handleSignUp = () => {
    // Handle navigation to sign up screen here
    console.log('Sign Up pressed');
  };

  return (
    <View style={styles.container}>
      <Image source={myDestinationLogo} style={styles.logo} />
      <Text style={styles.title}>My Destination</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ffffff"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ffffff"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <View style={styles.buttonSecondary}>
            <Button
            title="Sign Up" 
            color="#ffffff"
            onPress={handleSignUp} 
            
            />
        </View>
        <View style={styles.buttonPrimary}>
            <Button 
            title="Sign In" 
            color="#ffffff"
            onPress={handleSignIn} 
            />
        </View>
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
    marginTop: -20,
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    color: '#FFCE1C',
  },
  input: {
    width: '100%',
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
    width: '100%',
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
});

export default SignInScreen;
