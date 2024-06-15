import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { getMyBucketList } from '../services/dbService'; // Import getMyBucketList from dbService
import { RootStackParamList } from '@/app';

// Define the structure for card data
interface CardData {
  activityName: string;
  description: string;
  id: string;
  userId: string;
  location: string;
  type: string;
  route: { latitude: number; longitude: number }[];
  totalDistance: number;
  averageSpeed: number;
}

// Define navigation type for HomeScreen
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Fetch activities on component mount
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

    // Real-time updates for activities
    const unsubscribe = onSnapshot(collection(db, "activities"), (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          fetchActivities();
        }
      });
    });

    return () => unsubscribe();
  }, []);

  // Filter card data based on search query
  const filteredCardData = cardData.filter(card => {
    return card.activityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           card.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           card.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           card.location?.toLowerCase().includes(searchQuery.toLowerCase()); // Added location to the search filter
  });

  // Display loader while data is loading
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#108DF9" />
      </View>
    );
  }

  // Display error message if error occurs
  if (error) {
    return <Text>Error: {error}</Text>;
  }

  // Handle card press to navigate to ActivityScreen
  const handleCardPress = (card: CardData) => {
    navigation.navigate('ActivityScreen', { userId: card.userId, id: card.id });
  };

  // Main component render
  return (
    <ScrollView style={styles.container}>
      <View style={styles.introContainer}>
        <Text style={styles.introTitle}>My Destination</Text>
        <Text style={styles.introText}>
          Welcome to MyDestination, your ultimate travel companion app. Discover and explore the exciting adventures around the world!
        </Text>
      </View>
      <TextInput
          style={styles.searchBar}
          placeholder="Search activities..."
          placeholderTextColor="#fff"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      <View style={styles.cardsWrapper}>
        {filteredCardData.map((card, index) => (
          <TouchableOpacity key={card.id} style={styles.cardContainer} onPress={() => handleCardPress(card)}>
            <Text style={styles.cardTitle}>{card.activityName}</Text>
            <View style={styles.cardStatsContainer}>
              <Text style={styles.cardStats}>{card.location}</Text>
              <Text style={styles.cardStats}>{card.type}</Text> 
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

// Styles for the HomeScreen
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
  searchBar: {
    height: 50,
    width: '90%',
    paddingHorizontal: 10,
    backgroundColor: '#3C3E47',
    borderColor: '#108DF9',
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16,
    color: '#fff',
    marginHorizontal: 'auto',
    marginBottom: 20,
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

