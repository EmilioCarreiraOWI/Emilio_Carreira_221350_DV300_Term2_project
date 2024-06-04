import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getMyBucketList } from '../services/dbService'; // Import getMyBucketList from dbService

interface RouteParams {
  userId: string;
}

interface UserDetails {
  profileImage: string;
  profileName: string;
  role: string;
  email: string | null | undefined; // Allow undefined as well
  location: string;
  interests: string[] | null; // Allow interests to be null
}

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

const DetailedUserScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = (route.params as RouteParams).userId; // Type assertion here
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserDetails(docSnap.data() as UserDetails);
      } else {
        console.log("No such document!");
      }
    };

    const fetchActivities = async () => {
      const activities = await getMyBucketList();
      setUserActivities(activities.filter(activity => activity.userId === userId));
    };

    fetchUserDetails();
    fetchActivities();
  }, [userId]);

  if (!userDetails) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <ImageBackground source={{ uri: userDetails.profileImage }} style={styles.profileContainer}>
        <Image source={{ uri: userDetails.profileImage }} style={styles.profileImage} />
        <Text style={styles.profileName}>{userDetails.profileName}</Text>
        <Text style={styles.userActivity}>{userDetails.role}</Text>
      </ImageBackground>
      <View style={styles.detailsSection}>
        <Text style={styles.detailText}>Email: {userDetails.email}</Text>
        <Text style={styles.detailText}>Location: {userDetails.location}</Text>
        <Text style={styles.detailText}>Interests: {userDetails.interests ? userDetails.interests.join(', ') : 'No interests listed'}</Text>
      </View>
      <View style={styles.cardsWrapper}>
        {userActivities.map((activity, index) => (
          <TouchableOpacity key={activity.id} style={styles.cardContainer} onPress={() => navigation.navigate('ActivityScreen', { id: activity.id })}>
            <Text style={styles.cardTitle}>{activity.activityName}</Text>
            <View style={styles.cardStatsContainer}>
              <Text style={styles.cardStats}>{activity.location}</Text>
              <Text style={styles.cardStats}>{activity.totalDistance} km</Text>
              <Text style={styles.cardStats}>{activity.time} min</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 300,
    borderBottomWidth: 3,
    borderColor: '#F3C94F',
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
  detailsSection: {
    padding: 20,
  },
  detailText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
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
  }
});

export default DetailedUserScreen;
