import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { saveOrUpdateUserProfile, fetchAllUsers } from '../services/usersService';
import { fetchUserWithActivities } from '../services/fetchUserWithActivities';
import '../config/firebaseConfig';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';

import ProfileCover from '../assets/images/profile-cover2.jpg';
import User1 from '../assets/images/user1.jpg';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the settings icon
import { getMyBucketList, getScore } from '../services/dbService';

const auth = getAuth();
const db = getFirestore();

type RootStackParamList = {
  SignInScreen: undefined;
  ProfileEditedScreen: undefined;
  ActivityScreen: { id: string }; // Added this line
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
  score: number; // Added score field
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
  const [allUsers, setAllUsers] = useState<ExtendedUser[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const currentUserDetails = await fetchUserWithActivities(user.uid) as ExtendedUser;
        if (currentUserDetails) {
          setCurrentUser(currentUserDetails);
          setProfileName(currentUserDetails.profileName || '');
          setProfileImage(currentUserDetails.profileImage || User1);
          setUserRole(currentUserDetails.role || 'Explorer');
          setUserActivities(currentUserDetails.activities || []);
          const score = currentUserDetails.activities?.reduce((acc, activity) => acc + activity.score, 0) || 0;
          setTotalScore(score);
        } else {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    });

    const fetchUsers = async () => {
      const users = await fetchAllUsers();
      const usersWithActivities = await Promise.all(users.map(async user => ({
        ...user,
        uid: user.id,
        email: user.email || null,
        activities: await Promise.all(user.activities.map(async activity => ({
          id: activity.id,
          activityName: activity.activityName || 'Unknown',
          description: activity.description || 'No description',
          userId: user.id,
          location: activity.location || 'Unknown location',
          route: activity.route || [],
          totalDistance: activity.totalDistance || 0,
          averageSpeed: activity.averageSpeed || 0,
          time: activity.time || 0,
          score: await getScore(activity.id) || 0 // Ensure score is resolved here
        })))
      })));
      setAllUsers(usersWithActivities);
    };

    fetchUsers();

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
        if (success.success) {
          console.log('Profile updated successfully');
          setCurrentUser({...currentUser, ...userProfile});
        } else {
          console.error('Failed to update profile', success.message);
        }
      } catch (error) {
        console.error('Failed to update profile', error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
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

      <View style={styles.mainInfo}>
        <Text style={styles.infoText}>Total Score: {totalScore}</Text>
      </View>

      <View style={styles.cardsWrapper}>
        {userActivities.map((activity, index) => (
          <TouchableOpacity key={activity.id} style={styles.cardContainer} onPress={() => navigation.navigate('ActivityScreen', { id: activity.id })}>
            <Text style={styles.cardTitle}>{activity.activityName}</Text>
            <View style={styles.cardStatsContainer}>
              <Text style={styles.cardStats}>{activity.location}</Text>
              <Text style={styles.cardStats}>{activity.totalDistance} km</Text>
              <Text style={styles.cardStats}>{activity.score} pts</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.EditSection} onPress={() => setModalVisible(true)}>
        <Ionicons name="settings" size={30} color="#FFF" />
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
            <TouchableOpacity style={styles.closeModal} onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle" size={30} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.signOutSection} onPress={() => {
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
        </View>
      </Modal>
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
    height: 300,
    borderBottomWidth: 3,
    borderColor: '#F3C94F',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#F3C94F',
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
  mainInfo:{
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#F3C94F',
    padding: 15,
    width: '100%',
    backgroundColor: '#3C3E47',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  infoText: {
    color: '#fff',
    fontSize: 20,
    marginVertical: 5,
  },
  cardsWrapper: {
    alignItems: 'center',
  },
  cardContainer: {
    marginBottom: 10,
    marginTop: 10,
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
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#F3C94F',
    padding: 15,
    width: '100%',
    backgroundColor: '#3C3E47',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardStats: {
    color: '#fff',
    fontSize: 20,
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
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
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
  closeModal: {
    alignSelf: 'flex-end',
  },
  closeModalText: {
    fontSize: 24,
    color: '#fff',
  }
});

export default ProfileScreen;
