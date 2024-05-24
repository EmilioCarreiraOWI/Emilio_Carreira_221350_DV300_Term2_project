import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Modal, Button, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { User } from 'firebase/auth'; // Import User type from firebase/auth
import '../config/firebaseConfig'; // Adjust the path to where Firebase is initialized

import ProfileCover from '../assets/images/profile-cover2.jpg'; // Correct path to the image
import User1 from '../assets/images/user1.jpg'; // Correct path to the image

const auth = getAuth(); // Ensure this is called after Firebase has been initialized

type RootStackParamList = {
  SignInScreen: undefined;
  ProfileEditedScreen: undefined; // Added missing screen type
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Use User | null type for currentUser
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [profileName, setProfileName] = useState(''); // State to hold profile name input
  const [profileImage, setProfileImage] = useState(User1); // State to hold profile image input
  const [userRole, setUserRole] = useState(''); // State to hold user role input

  // Effect to handle user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setProfileName(user.displayName || ''); // Initialize profileName with current user's displayName
        setUserRole('Explorer'); // Default role or fetched from user data
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  // Function to extract display name from email
  const getDisplayName = (email: string | null) => {
    return email ? email.split('@')[0] : 'No User';
  };

  // Main profile screen layout
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
      <ImageBackground 
        source={ProfileCover} 
        style={styles.profileContainer}
        resizeMode="cover"
      >
        <Image 
          source={profileImage} 
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{currentUser ? getDisplayName(currentUser.email) : 'No User'}</Text>
        <Text style={styles.userActivity}>Mountain Hiking</Text>
      </ImageBackground>

      {/* Edit profile button */}
      <TouchableOpacity style={styles.EditSection} onPress={() => setModalVisible(true)}>
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
      
      {/* Modal for editing profile */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >

        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeading}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#ccc"
              value={profileName}
              onChangeText={setProfileName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter image URL"
              placeholderTextColor="#ccc"
              value={profileImage}
              onChangeText={setProfileImage}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your role"
              placeholderTextColor="#ccc"
              value={userRole}
              onChangeText={setUserRole}
            />

            <View style={styles.buttonContainer}>

              <TouchableOpacity style={styles.buttonSeconday} onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonPrimary} onPress={() => {
                  // Save the profile name, image, and role
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            
            </View>
          </View>
        </View>
      </Modal>

      {/* Sign out section */}
      <View style={styles.signOutSection}>
        <TouchableOpacity onPress={() => {
          // Function to handle user sign out
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
  editProfileText: { // Added missing style for editProfileText
    fontSize: 16,
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
    marginBottom: 10
  },
  EditSection: {
    width: '90%',
    height: 60,
    backgroundColor: '#108DF9',
    borderRadius: 25,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    marginVertical: 10
  },
  signOutText: {
    fontSize: 16,
    color: 'red',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: '#3C3E47',
    width: '90%',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalHeading: {
    marginBottom: 15,
    color: '#FFCE1C',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24
  },
  input: { // Style for the TextInput in the modal
    width: '100%',
    height: 60,
    marginBottom: 10,
    borderRadius: 25,
    borderColor: '#108DF9',
    borderWidth: 3,
    padding: 10,
    backgroundColor: '#3C3E47',
    color: '#fff',
  },
  buttonContainer: { // Added style for button container
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonPrimary: { // Added missing style for button
    width: '46%',
    height: 60,
    backgroundColor: '#108DF9',
    borderRadius: 25,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  buttonSeconday: { // Added missing style for button
    width: '46%',
    height: 60,
    borderWidth: 3,
    borderColor: '#108DF9',
    borderRadius: 25,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  buttonText: { // Added missing style for buttonText
    color: '#fff',
    textAlign: 'center',
  }
});

export default ProfileScreen;
