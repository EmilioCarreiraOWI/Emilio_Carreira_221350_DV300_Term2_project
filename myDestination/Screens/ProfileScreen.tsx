import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { saveOrUpdateUserProfile, fetchAllUsers, fetchUserWithActivities } from '../services/usersService';
import '../config/firebaseConfig';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';

import ProfileCover from '../assets/images/profile-cover2.jpg';
import User1 from '../assets/images/user1.jpg';
import { getMyBucketList } from '../services/dbService';

const auth = getAuth();
const db = getFirestore();

type RootStackParamList = {
  SignInScreen: undefined;
  ProfileEditedScreen: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Activity {
  activityName: string;
  description: string;
  id: string;
  userId: string;
  location: string;
  route: { latitude: number; longitude: number }[];
  totalDistance: number;
  averageSpeed: number;
  time: number;
}

interface ExtendedUser {
  uid: string;
  role?: string;
  profileName?: string;
  profileImage?: string;
  email: string | null;
  activities?: Activity[];
}

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileImage, setProfileImage] = useState(User1);
  const [userRole, setUserRole] = useState('');
  const [userActivities, setUserActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const currentUserDetails = await fetchUserWithActivities(user.uid);
        if (currentUserDetails) {
          setCurrentUser(currentUserDetails);
          setProfileName(currentUserDetails.profileName);
          setProfileImage(currentUserDetails.profileImage);
          setUserRole(currentUserDetails.role || 'Explorer');
          setUserActivities(currentUserDetails.activities || []);
        }
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const saveProfileChanges = async () => {
    if (currentUser) {
      try {
        const userProfile = {
          displayName: profileName,
          photoURL: profileImage,
          role: userRole,
          email: currentUser.email
        };

        const success = await saveOrUpdateUserProfile(currentUser.uid, userProfile);
        if (success) {
          console.log('Profile updated successfully');
          setCurrentUser({...currentUser, ...userProfile});
        } else {
          console.error('Failed to update profile');
        }
      } catch (error) {
        console.error('Failed to update profile', error);
      }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
      <ImageBackground 
        source={ProfileCover} 
        style={styles.profileContainer}
        resizeMode="cover"
      >
        <Image 
          source={{ uri: currentUser?.profileImage || User1 }} 
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{currentUser ? currentUser.profileName || 'Finish your profile' : 'Finish your profile'}</Text>
        <Text style={styles.userRole}>{currentUser ? currentUser.role || 'edit profile' : 'edit profile'}</Text>
      </ImageBackground>

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

      <TouchableOpacity style={styles.EditSection} onPress={() => setModalVisible(true)}>
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
      
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

      <View style={styles.signOutSection}>
        <TouchableOpacity onPress={() => {
          signOut(auth).then(() => {
            navigation.navigate('SignInScreen');
            console.log(currentUser?.email + ' has been signed out.');
          }).catch((error) => {
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
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
  userRole: {
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
  editProfileText: {
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
  input: {
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
  buttonContainer: {
    display: 'flex',
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
  buttonSeconday: {
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
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  }
});

export default ProfileScreen;
