import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { getMyBucketList } from '../services/dbService';
import myDestinationLogo from '../assets/images/myDestinationLogo.png';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'path_to_your_types_file'; // Adjust the import path as necessary
import { StackNavigationProp } from '@react-navigation/stack';

interface CardData {
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

const HomeScreen = () => {
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'HomeScreen'>>();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activities = await getMyBucketList();
        setCardData(activities);
        setError(null);
      } catch (e) {
        setError('Failed to fetch activities');
        console.error(e);
      }
      setIsLoading(false);
    };

    fetchActivities();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const handleCardPress = (id: string) => {
    navigation.navigate('ActivityScreen', { id });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.introContainer}>
        <Image source={myDestinationLogo} style={styles.logo} />
        <Text style={styles.introTitle}>My Destination</Text>
        <Text style={styles.introText}>
          Welcome to MyDestination, your ultimate travel companion app. Discover and explore the exciting adventures around the world!
        </Text>
      </View>

      <View style={styles.cardsWrapper}>
        {cardData.map((card, index) => (
          <TouchableOpacity key={card.id} style={styles.cardContainer} onPress={() => handleCardPress(card.id)}>
            <Text style={styles.cardTitle}>{card.activityName}</Text>
            <View style={styles.cardStatsContainer}>
              <Text style={styles.cardStats}>{card.location}</Text>
              <Text style={styles.cardStats}>{card.totalDistance} km</Text>
              <Text style={styles.cardStats}>{card.time} min</Text>
            </View>
            
            {card.route && card.route.length > 0 ? (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: (card.route.reduce((acc, cur) => acc + cur.latitude, 0) / card.route.length),
                  longitude: (card.route.reduce((acc, cur) => acc + cur.longitude, 0) / card.route.length),
                  latitudeDelta: Math.max(...card.route.map(point => point.latitude)) - Math.min(...card.route.map(point => point.latitude)) + 0.0005,
                  longitudeDelta: Math.max(...card.route.map(point => point.longitude)) - Math.min(...card.route.map(point => point.longitude)) + 0.0005,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
              >
                <Polyline
                  coordinates={card.route}
                  strokeColor="#FFCE1C" // fallback for when `strokeColors` is not supported by the map-provider
                  strokeWidth={6}
                />
              </MapView>
            ) : (
              <Text>No route data available</Text>
            )}
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
  introContainer: {
    alignItems: 'center',
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderBottomColor: '#F3C94F',
    borderBottomWidth: 3,
    marginBottom: 20,
  },
  logo: {
    width: '40%',
    resizeMode: 'contain',
  },
  introTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    color: '#FFCE1C',
  },
  introText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
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
  cardStatsContainer:{
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
  cardDescription: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  mapContainer: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 12
  },
  map: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    
    
  },
});

export default HomeScreen;

