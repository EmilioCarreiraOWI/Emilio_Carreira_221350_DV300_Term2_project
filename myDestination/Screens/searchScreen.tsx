import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../constants/Colors';
import { fetchAllUsers } from '../services/usersService';
import myDestinationLogo from '../assets/images/myDestinationLogo.png';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// User interface definition
interface User {
  id: string;
  name: string;
  image: string;
  activity: string;
  activities: Array<{ id: string; [key: string]: any }>;
}

// Mapping of activities to their respective colors
const activityColors: { [key: string]: string } = {
  'Mountain Hiking': '#FF6347',
  'Scuba Diving': '#4682B4',
  'Safari Adventure': '#DEB887',
  'Skydiving': '#00BFFF',
  'City Tours': '#FFD700',
  'Snowboarding': '#00CED1',
  'Desert Safari': '#DAA520',
  'Deep Sea Fishing': '#20B2AA',
  'Cycling': '#228B22',
  'Rock Climbing': '#A0522D'
};

// Navigation stack parameters
type RootStackParamList = {
  DetailedUser: { userId: string };
};

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Fetch and subscribe to user data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const fetchedUsers: User[] = [];
      snapshot.forEach(doc => {
        fetchedUsers.push({
          id: doc.id,
          name: doc.data().profileName,
          image: doc.data().profileImage,
          activity: doc.data().role,
          activities: doc.data().activities
        });
      });
      setUsers(fetchedUsers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter users by search query
  const filteredUsers = users.filter(user => user.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  // Handle navigation to user details
  const handleCardPress = (id: string) => {
    navigation.navigate('DetailedUser', { userId: id });
  };

  // Render user card
  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleCardPress(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardText}>{item.name} - </Text>
      <Text style={[styles.cardActivity, { color: activityColors[item.activity] }]}>{item.activity}</Text>
    </TouchableOpacity>
  );

  // Main component render
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#108DF9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search users..."
        placeholderTextColor={Colors.light.icon}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Text style={styles.title}>All the users</Text>
      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

// Styles for the SearchScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#24252A',
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#24252A',
  },
  searchBar: {
    height: 50,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#3C3E47',
    borderColor: '#108DF9',
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16,
    color: '#fff',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#3C3E47',
    borderRadius: 25,
    alignItems: 'center',
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderColor: '#F3C94F',
    borderWidth: 1,
  },
  cardText: {
    fontSize: 20,
    color: '#fff',
  },
  cardActivity: {
    fontSize: 16,
  },
});

export default SearchScreen;
