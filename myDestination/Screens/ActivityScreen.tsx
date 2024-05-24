import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import MapView from 'react-native-maps';
import ProfileCover1 from '../assets/images/profile-cover1.jpg';
import User1 from '../assets/images/user1.jpg';

const ActivityScreen = () => {
  return (
    <View style={styles.container}>
      {/* Background image with user profile and activity details */}
      <ImageBackground 
        source={ProfileCover1} 
        style={styles.profileContainer}
        resizeMode="cover"
      >
        {/* User profile image */}
        <Image 
          source={User1} 
          style={styles.profileImage}
        />
        {/* User name */}
        <Text style={styles.profileName}>John Doe</Text>
        {/* User activity type */}
        <Text style={styles.userActivity}>Mountain Hiking</Text>
      </ImageBackground>
      {/* Map and additional activity information */}
      <View style={styles.mapContainer}>
        {/* Map view showing location */}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -25.7479,
            longitude: 28.2293,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        {/* Activity details like distance, duration, and difficulty */}
        <View style={styles.mainInfo}>
          <Text style={styles.infoText}>Distance: 8 km</Text>
          <Text style={styles.infoText}>Duration: 3 hours</Text>
          <Text style={styles.infoText}>Difficulty: Moderate</Text>
          
        </View>
        {/* Additional activity details like location, date, and type */}
        <View style={styles.mainInfo}>
          <Text style={styles.infoText}>Location: Mount Kilimanjaro</Text>
          <Text style={styles.infoText}>Date: 10/05/2024</Text>
          <Text style={styles.infoText}>Type: Hiking</Text>
        </View>
      </View>
      {/* Description of the activity */}
      <View style={styles.descriptionContainer}>
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Description</Text>
        </View>
        <Text style={styles.descriptionText}>
          Join John Doe on his latest adventure, mountain hiking! Experience the thrill and beauty of the mountains.
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
