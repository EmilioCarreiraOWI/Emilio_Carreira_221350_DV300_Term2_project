import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import MapView from 'react-native-maps';
import ProfileCover1 from '../assets/images/profile-cover1.jpg';
import User1 from '../assets/images/user1.jpg';

const ActivityScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={ProfileCover1} 
        style={styles.profileContainer}
        resizeMode="cover"
      >
        <Image 
          source={User1} 
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.userActivity}>Mountain Hiking</Text>
      </ImageBackground>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -25.7479,
            longitude: 28.2293,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        <View style={styles.mainInfo}>
          <Text style={styles.infoText}>Distance: 8 km</Text>
          <Text style={styles.infoText}>Duration: 3 hours</Text>
          <Text style={styles.infoText}>Difficulty: Moderate</Text>
        </View>
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
    flex: 1,
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
    height: '10%',
    width: '100%',
    backgroundColor: '#3C3E47',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    
    alignContent: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 20,
    marginVertical: 'auto',
  },
});

export default ActivityScreen;
