import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { signOut, getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { updateUserInformation } from '../services/authService';
import { User } from 'firebase/auth';
import '../config/firebaseConfig';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';

import ProfileCover from '../assets/images/profile-cover2.jpg'; // Correct path to the image
import User1 from '../assets/images/user1.jpg'; // Correct path to the image
import { getMyBucketList } from '../services/dbService'; // Import getMyBucketList from dbService

const auth = getAuth(); // Ensure this is called after Firebase has been initialized
const db = getFirestore(); // Initialize Firestore

type RootStackParamList = {
  SignInScreen: undefined;
  ProfileEditedScreen: undefined; // Added missing screen type
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Activity {
  activityName: string;
  description: string;
  id: string;
  userId: string;
  location: string;
  route: { latitude: number; longitude: number }[];
  totalDistance: number; // in kilometers
  averageSpeed: number; // in km/h
  time: number; // in minutes
}

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Use User | null type for currentUser
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [profileName, setProfileName] = useState(''); // State to hold profile name input
  const [profileImage, setProfileImage] = useState(User1); // State to hold profile image input
  const [userRole, setUserRole] = useState(''); // State to hold user role input
  const [userActivities, setUserActivities] = useState<Activity[]>([]); // State to hold user activities

  // Effect to handle user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setProfileName(user.displayName || ''); // Initialize profileName with current user's displayName
        setUserRole('Explorer'); // Default role or fetched from user data
        fetchUserActivities();
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  // Fetch user activities from the database
  const fetchUserActivities = async () => {
    const activities = await getMyBucketList();
    setUserActivities(activities.filter(activity => activity.userId === currentUser?.uid));
  };

  // Function to extract display name from email
  const getDisplayName = (email: string | null) => {
    return email ? email.split('@')[0] : 'No User';
  };

  // Save profile changes function
  const saveProfileChanges = async () => {
    if (currentUser) {
      try {
        // Update the authentication profile
        await updateProfile(currentUser, {
          displayName: profileName,
          photoURL: profileImage
        }).then(() => {
          // Update the local state to reflect the changes
          setCurrentUser({...currentUser, displayName: profileName, photoURL: profileImage});

          // Update additional fields in Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          updateDoc(userDocRef, {
            role: userRole,
            profileName: profileName,
            profileImage: profileImage
          });
        }).catch((error) => {
          console.error('Failed to update profile', error);
        });
      } catch (error) {
        console.error('Failed to update profile', error);
      }
    }
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

      {/* List of user activities */}
      <View style={styles.cardsWrapper}>
        {userActivities.map((activity, index) => (
          <TouchableOpacity key={activity.id} style={styles.cardContainer} onPress={() => console.log('Activity selected:', activity.id)}>
            <Text style={styles.cardTitle}>{activity.activityName}</Text>
            <View style={styles.cardStatsContainer}>
              <Text style={styles.cardStats}>{activity.location}</Text>
              <Text style={styles.cardStats}>{activity.totalDistance} km</Text>
              <Text style={styles.cardStats}>{activity.time} min</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

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

              <TouchableOpacity style={styles.buttonPrimary} onPress={saveProfileChanges}>
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
  cardsWrapper: {
    alignItems: 'center',
  },
  cardContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#3C3E47',
    borderRadius: 25,
    width: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#108DF9',
    marginBottom: 10,
  },
  cardStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardStats: {
    fontSize: 16,
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
