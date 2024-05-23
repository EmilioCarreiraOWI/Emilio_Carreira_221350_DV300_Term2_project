import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { User } from 'firebase/auth'; // Import User type from firebase/auth
import '../config/firebaseConfig'; // Adjust the path to where Firebase is initialized

import ProfileCover from '../assets/images/profile-cover2.jpg'; // Correct path to the image
import User1 from '../assets/images/user1.jpg'; // Correct path to the image

const auth = getAuth(); // Ensure this is called after Firebase has been initialized

type RootStackParamList = {
  SignInScreen: undefined; // Add other screens as needed
  // other screens...
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Use User | null type for currentUser

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const getDisplayName = (email: string | null) => {
    return email ? email.split('@')[0] : 'No User';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
      <ImageBackground 
        source={ProfileCover} 
        style={styles.profileContainer}
        resizeMode="cover"
      >
        <Image 
          source={User1} 
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{currentUser ? getDisplayName(currentUser.email) : 'No User'}</Text>
        <Text style={styles.userActivity}>Mountain Hiking</Text>
      </ImageBackground>
      <View style={styles.signOutSection}>
        <TouchableOpacity onPress={() => {
          signOut(auth).then(() => {
            // Sign-out successful.
            // Optionally navigate to the sign-in screen or update the state
            navigation.navigate('SignInScreen');
            console.log(currentUser?.email + ' has been signed out.');
          }).catch((error) => {
            // An error happened.
            console.error('Sign out error', error);
          });
        }}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#24252A',
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 3,
    borderColor: '#F3C94F',
    backgroundColor: 'rgba(0, 0, 0, 0.5)' // Added to make the image darker
  },
  profileImage: {
    width: 100,
    height: 100,
    borderColor: '#F3C94F',
    borderWidth: 2,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userActivity: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  signOutSection: {
    width: '90%',
    height: 60,
    backgroundColor: '#F9A1A1',
    borderRadius: 25,
    borderColor: 'red',
    borderWidth: 3,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    marginBottom: 0
  },
  signOutText: {
    fontSize: 16,
    color: 'red',
  },
});

export default ProfileScreen;
