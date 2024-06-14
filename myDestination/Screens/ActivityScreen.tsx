import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, Animated, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the thumbs up icon
import MapView, { Polyline } from 'react-native-maps';
import { useRoute, RouteProp } from '@react-navigation/native';
import { addOrUpdateScore, getScore, getMyBucketList, getActivityById } from '../services/dbService';
import { fetchAllUsers } from '../services/usersService'; // Import fetchAllUsers to get user profile image

import { RootStackParamList } from '../app/index';

// Define the Activity interface
interface Activity {
  id: string;
  userId: string; // Ensure we have userId in the Activity interface
  profileCoverUrl: string;
  userImageUrl: string;
  userName: string;
  activityName: string;
  route: { latitude: number; longitude: number }[];
  totalDistance: number;
  startTime: string; // New field
  endTime: string; // New field
  difficulty: string;
  location: string;
  date: string;
  type: string;
  description: string;
  caloriesBurned: number; // New field
  averageSpeed: number; // New field
}

type ActivityScreenRouteProp = RouteProp<RootStackParamList, 'ActivityScreen'>;

interface ActivityScreenProps {
  userId: string;
}

const ActivityScreen = ({ userId }: ActivityScreenProps) => {
  const route = useRoute<ActivityScreenRouteProp>();
  const { id } = route.params;
  const [activityData, setActivityData] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [userProfileName, setUserProfileName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const scaleValue = new Animated.Value(1);
  const scrollViewRef = useRef<ScrollView>(null);

  // Calculate workout time in minutes
  const calculateWorkoutTime = () => {
    if (!activityData || !activityData.startTime || !activityData.endTime) return 0;
    const startTime = new Date(activityData.startTime);
    const endTime = new Date(activityData.endTime);
    const diffInMs = endTime.getTime() - startTime.getTime();
    const diffInMinutes = Math.round(diffInMs / 60000); // Corrected division by 60000
    return diffInMinutes;
  };

  // Fetch activity data and user profile information
  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const activities = await getMyBucketList();
        const activity = activities.find((act: Activity) => act.id === id);
        if (activity) {
          setActivityData(activity);
          const users = await fetchAllUsers();
          const user = users.find(user => user.id === activity.userId);
          if (user) {
            setUserProfileImage(user.profileImage);
            setUserProfileName(user.profileName);
            setUserRole(user.role);
          }
        } else {
          setError('Activity not found');
          console.error('Activity with ID ' + id + ' not found in the bucket list.');
        }
      } catch (e) {
        setError("Failed to fetch activity data");
        console.error("Error in fetchActivityData:", e);
      }
      setIsLoading(false);
    };

    fetchActivityData();
  }, [id]);

  // Check and set user score for the activity
  useEffect(() => {
    const checkScore = async () => {
      try {
        if (activityData) {
          const existingScore = await getScore(activityData.id);
          setUserScore(existingScore);
        }
      } catch (e) {
        console.error("Error in checkScore:", e);
        setError("Failed to check score");
      }
    };

    if (activityData) {
      checkScore();
    }
  }, [activityData]);

  // Handle score update when user likes the activity
  const handleScore = async () => {
    if (activityData && activityData.userId !== userId && !liked) {
      const newScore = userScore ? userScore + 1 : 1; // Increment score if already exists, otherwise start at 1
      try {
        const success = await addOrUpdateScore(activityData.id, newScore);
        if (success) {
          alert('Score updated successfully!');
          setUserScore(newScore);
          setLiked(true);
          Animated.spring(scaleValue, {
            toValue: 1.5,
            friction: 2,
            useNativeDriver: true,
          }).start(() => {
            Animated.spring(scaleValue, {
              toValue: 1,
              friction: 2,
              useNativeDriver: true,
            }).start();
          });
        } else {
          alert('Failed to update score.');
        }
      } catch (e) {
        alert('Failed to update score due to an error.');
        console.error("Error in handleScore:", e);
      }
    } else {
      if (activityData?.userId === userId) {
        alert('You cannot like your own activity.');
      } else {
        alert('You have already liked this activity.');
      }
    }
  };

  // Display loading indicator while data is being fetched
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#108DF9" />
      </View>
    );
  }

  // Display error message if there is an error
  if (error) {
    return <Text>Error: {error}</Text>;
  }

  // Display message if no activity data is available
  if (!activityData) {
    return <Text>No activity data available. Please check if the activity ID is correct or if the activity has been removed.</Text>;
  }

  // Main render of the activity screen
  return (
    <ScrollView style={styles.container}>
      <ImageBackground 
        source={{ uri: userProfileImage || activityData.profileCoverUrl }} 
        style={styles.profileContainer}
        resizeMode="cover"
      >
        <Image 
          source={{ uri: userProfileImage || activityData.userImageUrl }} 
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userProfileName || activityData.userName}</Text>
        <Text style={styles.userRole}>{userRole}</Text>
      </ImageBackground>

      <View style={styles.mainInfo}>
        <Text style={styles.userActivity}>{activityData.activityName}</Text>
        <Text style={styles.descriptionText}>{activityData.description}</Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: activityData.route[0].latitude,
          longitude: activityData.route[0].longitude,
          latitudeDelta: 0.0005,
          longitudeDelta: 0.0005,
        }}
      >
        <Polyline
          coordinates={activityData.route}
          strokeColor="#FFCE1C"
          strokeWidth={6}
        />
      </MapView>

      <View style={styles.mainInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>{activityData.location}</Text>
          <Text style={styles.infoText}>{activityData.totalDistance} km</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>{calculateWorkoutTime()} min</Text>
          <Text style={styles.infoText}>Type: {activityData.type}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Average Speed: {activityData.averageSpeed} km/h</Text>
        </View>
        <TouchableOpacity 
          onPress={handleScore} 
          disabled={activityData.userId === userId || liked} 
          style={[styles.scoreButton, (activityData.userId === userId || liked) && styles.likedButton]}
        >
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <Ionicons name="thumbs-up" size={24} color="white" />
          </Animated.View>
          <Text style={styles.scoreText}>{userScore} Like</Text>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#24252A',
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 3,
    borderColor: '#F3C94F'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderColor: '#F3C94F',
    borderWidth: 2,
    borderRadius: 50,
    marginTop: 50,
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
    marginBottom: 50
  },
  userActivity: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#108DF9',
  },
  map: {
    width: '100%',
    height: 400,
  },
  mainInfo: {
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#F3C94F',
    padding: 15,
    width: '100%',
    backgroundColor: '#3C3E47',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 20,
    marginVertical: 5,
    flex: 1,
    textAlign: 'center',
  },
  descriptionText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 15
  },
  scoreButton: {
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
  likedButton: {
    backgroundColor: '#FFCE1C',
  },
  scoreText: {
    marginLeft: 5,
    color: '#fff',
    fontSize: 18,
  },
});

export default ActivityScreen;
