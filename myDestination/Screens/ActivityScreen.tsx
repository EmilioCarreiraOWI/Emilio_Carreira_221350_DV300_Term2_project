import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import MapView, { Polyline } from 'react-native-maps'; // Import Polyline for drawing routes
import { useRoute, RouteProp } from '@react-navigation/native';

import { RootStackParamList } from '../app/index'; // Adjust the import path as necessary
import { getMyBucketList } from '../services/dbService';

interface Activity {
  id: string;
  profileCoverUrl: string;
  userImageUrl: string;
  userName: string;
  activityName: string;
  route: { latitude: number; longitude: number }[];
  totalDistance: number;
  time: number;
  difficulty: string;
  location: string;
  date: string;
  type: string;
  description: string;
}

type ActivityScreenRouteProp = RouteProp<RootStackParamList, 'ActivityScreen'>;

const ActivityScreen = () => {
  const route = useRoute<ActivityScreenRouteProp>();
  const { id } = route.params;
  const [activityData, setActivityData] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const activities = await getMyBucketList();
        const activity = activities.find((act: Activity) => act.id === id);
        if (activity) {
          setActivityData(activity);
        } else {
          setError('Activity not found');
        }
      } catch (e) {
        setError("Failed to fetch activity data");
        console.error(e);
      }
      setIsLoading(false);
    };

    fetchActivityData();
  }, [id]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!activityData) {
    return <Text>No activity data available.</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Background image with user profile and activity details */}
      <ImageBackground 
        source={{ uri: activityData.profileCoverUrl }} 
        style={styles.profileContainer}
        resizeMode="cover"
      >
        {/* User profile image */}
        <Image 
          source={{ uri: activityData.userImageUrl }} 
          style={styles.profileImage}
        />
        {/* User name */}
        <Text style={styles.profileName}>{activityData.userName}</Text>
        {/* User activity type */}
        <Text style={styles.userActivity}>{activityData.activityName}</Text>
      </ImageBackground>
      {/* Map and activity information */}
      <View style={styles.mapContainer}>
        {/* Map view showing location and user activity route */}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: activityData.route[0].latitude,
            longitude: activityData.route[0].longitude,
            latitudeDelta: 0.0005,
            longitudeDelta: 0.0005,
          }}
        >
          {/* Polyline to show the route taken in the activity */}
          <Polyline
            coordinates={activityData.route}
            strokeColor="#FFCE1C" // red color for the route
            strokeWidth={6}
          />
        </MapView>
        {/* Combined activity details */}
        <View style={styles.mainInfo}>
          <Text style={styles.infoText}>Distance: {activityData.totalDistance} km</Text>
          <Text style={styles.infoText}>Duration: {activityData.time} min</Text>
          <Text style={styles.infoText}>Difficulty: {activityData.difficulty}</Text>
          <Text style={styles.infoText}>Location: {activityData.location}</Text>
          <Text style={styles.infoText}>Date: {activityData.date}</Text>
          <Text style={styles.infoText}>Type: {activityData.type}</Text>
        </View>
      </View>
      {/* Description of the activity */}
      <View style={styles.descriptionContainer}>
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Description</Text>
        </View>
        <Text style={styles.descriptionText}>
          {activityData.description}
        </Text>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#24252A',
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    borderBottomWidth: 3,
    borderColor: '#F3C94F'
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
  mapContainer: {
    flex: 5,
    width: '100%',
  },
  map: {
    width: '100%',
    height: '40%',
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
  headingContainer: {
    width: '100%',
    marginTop: 0,
  },
  headingText: {
    fontSize: 24,
    marginBottom: 10,
    color: '#fff',
  },
  descriptionContainer: {
    width: '90%',
    padding: 20,
  },
  descriptionText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ActivityScreen;
