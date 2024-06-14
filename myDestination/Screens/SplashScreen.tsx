import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import myDestinationLogo from '../assets/images/myDestinationLogo.png';

// SplashScreen component that displays an animated logo
const SplashScreen = () => {
  // State to manage the scale of the logo
  const logoScale = new Animated.Value(1);

  // Animation configuration for logo scaling
  Animated.loop(
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1.1, // Increase scale to 110%
        duration: 1000, // Animation duration of 1 second
        useNativeDriver: true, // Optimize animation performance
      }),
      Animated.timing(logoScale, {
        toValue: 1, // Reset scale to 100%
        duration: 1000, // Animation duration of 1 second
        useNativeDriver: true, // Optimize animation performance
      }),
    ])
  ).start(); // Initiate the animation loop

  // Component layout
  return (
    <View style={styles.container}>
      <View style={styles.splashContainer}>
        <Animated.Image 
          source={myDestinationLogo} 
          style={{ transform: [{ scale: logoScale }] }} // Apply dynamic scaling
        />
      </View>
    </View>
  );
};

// Styles for the SplashScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#24252A',
    width: '100%',
    height: '100%',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '50%',
  },
});

export default SplashScreen;
