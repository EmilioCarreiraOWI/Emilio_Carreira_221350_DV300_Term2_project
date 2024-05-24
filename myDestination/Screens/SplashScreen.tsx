import React from 'react';
import { View, StyleSheet } from 'react-native';
import myDestinationLogo from '../assets/images/myDestinationLogo.png';
import { Animated } from 'react-native';

// SplashScreen component definition
const SplashScreen = () => {
  // Initialize animation state for logo scaling
  const logoScale = new Animated.Value(1);

  // Define looping animation for logo scaling
  Animated.loop(
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1.1, // Scale up to 110%
        duration: 1000, // Duration of 1000 milliseconds
        useNativeDriver: true, // Use native driver for better performance
      }),
      Animated.timing(logoScale, {
        toValue: 1, // Scale back to 100%
        duration: 1000, // Duration of 1000 milliseconds
        useNativeDriver: true, // Use native driver for better performance
      }),
    ])
  ).start(); // Start the animation

  // Render the SplashScreen UI
  return (
    <View style={styles.container}>
      <View style={styles.SplashContainer}>
        <Animated.Image 
          source={myDestinationLogo} 
          style={{ transform: [{ scale: logoScale }] }} // Apply animated scale transformation
        />
      </View>
    </View>
  );
};

// StyleSheet for layout and styling
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
});

export default SplashScreen;
