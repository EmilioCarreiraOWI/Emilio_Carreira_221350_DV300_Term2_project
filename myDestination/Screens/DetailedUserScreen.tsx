import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { fetchAllActivitiesScores } from '../services/LeaderBoardService'; // Import fetchAllActivitiesScores from LeaderBoardService
import { StackNavigationProp } from '@react-navigation/stack'; // Added import for StackNavigationProp

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
  scores: number[]; // Array of scores
}

type RootStackParamList = {
  Home: undefined;
  ActivityScreen: { id: string };
  // other screens...
};

const DetailedUserScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const userId = (route.params as RouteParams).userId; // Type assertion here
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0); // Define totalScore state
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
      const activities = await fetchAllActivitiesScores(); // Fetch scores from LeaderBoardService
      const userActivities = activities
        .filter(activity => activity.userId === userId)
        .map(activity => ({
          ...activity,
          time: (new Date(activity.endTime).getTime() - new Date(activity.startTime).getTime()) / 60000 // Calculate time in minutes
        }));
      setUserActivities(userActivities);
      const totalScore = userActivities.reduce((acc, activity) => acc + activity.scores.reduce((scoreSum, score) => scoreSum + score, 0), 0);
      setTotalScore(totalScore);
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

      <View style={styles.mainInfo}>
        <Text style={styles.infoText}>Total Score: {totalScore}</Text>
      </View>

      <Text style={styles.title}>All the Activities</Text>

      <View style={styles.cardsWrapper}>
        {userActivities.map((activity, index) => (
          <TouchableOpacity key={activity.id} style={styles.cardContainer} onPress={() => navigation.navigate('ActivityScreen', { id: activity.id })}>
            <Text style={styles.cardTitle}>{activity.activityName}</Text>
            <View style={styles.cardStatsContainer}>
              <Text style={styles.cardStats}>{activity.location}</Text>
              <Text style={styles.cardStats}>{activity.totalDistance} km</Text>
              <Text style={styles.cardStats}>{activity.scores.join(', ')} pts</Text>
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
    marginBottom: 10
  },
  infoText: {
    color: '#fff',
    fontSize: 20,
    marginVertical: 5,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    width: '90%',
    marginLeft: '6%'
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
