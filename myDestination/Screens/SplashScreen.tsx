import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import myDestinationLogo from '../assets/images/myDestinationLogo.png';

import { Animated } from 'react-native';

const SplashScreen = () => {
  const logoScale = new Animated.Value(1);

  Animated.loop(
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ])
  ).start();

  return (
    <View style={styles.container}>
      <View style={styles.SplashContainer}>
        <Animated.Image 
        source={myDestinationLogo} 
        style={{ transform: [{ scale: logoScale }] }}
        />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#24252A',
    width: '100%',
    height: '100%',
  },
  SplashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '50%',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
