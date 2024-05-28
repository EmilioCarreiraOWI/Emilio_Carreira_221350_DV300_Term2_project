import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import MapView from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import { getMyBucketList } from '../services/dbService';

const ActivityScreen = () => {
  const route = useRoute();
  const [activityData, setActivityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const activities = await getMyBucketList();
        const activity = activities.find(act => act.id === route.params?.id);
        if (activity) {
          setActivityData(activity);
        } else {
          setError('Activity not found');
        }
      } catch (e) {
        setError('Failed to fetch activity data');
        console.error(e);
      }
      setIsLoading(false);
    };

    fetchActivityData();
  }, [route.params?.id]);

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
      {/* Map and additional activity information */}
      <View style={styles.mapContainer}>
        {/* Map view showing location */}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: activityData.route[0].latitude,
            longitude: activityData.route[0].longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        {/* Activity details like distance, duration, and difficulty */}
        <View style={styles.mainInfo}>
          <Text style={styles.infoText}>Distance: {activityData.totalDistance} km</Text>
          <Text style={styles.infoText}>Duration: {activityData.time} min</Text>
          <Text style={styles.infoText}>Difficulty: {activityData.difficulty}</Text>
        </View>
        {/* Additional activity details like location, date, and type */}
        <View style={styles.mainInfo}>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoText: {
    color: '#fff',
    fontSize: 20,
    marginVertical: 'auto',
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
