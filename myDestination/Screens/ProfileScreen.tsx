import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { saveOrUpdateUserProfile, fetchAllUsers } from '../services/usersService';
import { fetchUserWithActivities } from '../services/fetchUserWithActivities';
import { fetchAllActivitiesScores } from '../services/LeaderBoardService';
import '../config/firebaseConfig';
import { getFirestore } from 'firebase/firestore';
import ProfileCover from '../assets/images/profile-cover2.jpg';
import User1 from '../assets/images/user1.jpg';
import { Ionicons } from '@expo/vector-icons';

// Firebase authentication and Firestore database initialization
const auth = getAuth();
const db = getFirestore();

// Type definitions for navigation and user activities
type RootStackParamList = {
  SignInScreen: undefined;
  ProfileEditedScreen: undefined;
  ActivityScreen: { id: string };
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
  scores: number[] | undefined; // Ensure this property is included
  time?: any; // Include this if 'time' is also used elsewhere in your code
}

interface ExtendedUser {
  uid: string;
  role?: string;
  profileName?: string;
  profileImage?: string;
  email: string | null;
  activities?: Activity[];
}

// Function to calculate total score for a user based on their activities
const getTotalScoreForUser = async (userId: string): Promise<number> => {
  const activities = await fetchAllActivitiesScores();
  const userActivities = activities.filter(activity => activity.userId === userId);
  return userActivities.reduce((acc, activity) => acc + (activity.scores ? activity.scores.reduce((scoreSum, score) => scoreSum + score, 0) : 0), 0);
};

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
  const [loading, setLoading] = useState(true);

  // Effect to handle user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        const userProfile = await fetchUserWithActivities(user.uid);
        setCurrentUser(userProfile);
        setUserActivities(userProfile.activities || []);
        const totalScore = await getTotalScoreForUser(user.uid);
        setTotalScore(totalScore);
        setLoading(false);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Effect to fetch all users and their activities
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
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
          scores: activity.scores || [] // Directly use scores from the activity
        })))
      })));
      setAllUsers(usersWithActivities);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // Loader view when data is being fetched
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#108DF9" />
      </View>
    );
  }

  // Function to handle profile updates
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
          console.log('Updated Profile:', userProfile);
          setCurrentUser({...currentUser, ...userProfile});
          setModalVisible(false);
        } else {
          console.error('Failed to update profile', success.message);
        }
      } catch (error) {
        console.error('Failed to update profile', error);
      }
    }
  };

  // Main profile screen layout
  return (
    <ScrollView style={styles.container}>
      <ImageBackground 
        source={{ uri: currentUser?.profileImage || ProfileCover }}
        style={styles.profileContainer}
        resizeMode="cover"
      >
        <Image 
          source={typeof currentUser?.profileImage === 'string' ? { uri: currentUser.profileImage } : User1}
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
              <Text style={styles.cardStats}>{activity.scores ? activity.scores.reduce((a, b) => a + b, 0) : '0'} pts</Text>
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

            <TextInput
              style={styles.input}
              onChangeText={setProfileName}
              value={profileName}
              placeholder="Enter Profile Name"
            />
            <TextInput
              style={styles.input}
              onChangeText={setUserRole}
              value={userRole}
              placeholder="Enter Role"
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveProfileChanges}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
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

// Styles for the Profile Screen
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
    height: 350,
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
  },
  saveButton: {
    width: '90%',
    height: 60,
    backgroundColor: '#108DF9',
    borderRadius: 25,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    marginBottom: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#24252A',
  },
});

export default ProfileScreen;
