import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../constants/Colors';
import { fetchAllUsers } from '../services/usersService';
import myDestinationLogo from '../assets/images/myDestinationLogo.png';

// Define the User interface
interface User {
  id: string;
  name: string;
  image: string; // Updated type to string for image URLs
  activity: string;
  activities: Array<{ id: string; [key: string]: any }>;
}

// Define colors associated with different activities
const activityColors: { [key: string]: string } = {
  'Mountain Hiking': '#FF6347', // Tomato
  'Scuba Diving': '#4682B4', // SteelBlue
  'Safari Adventure': '#DEB887', // BurlyWood
  'Skydiving': '#00BFFF', // DeepSkyBlue
  'City Tours': '#FFD700', // Gold
  'Snowboarding': '#00CED1', // DarkTurquoise
  'Desert Safari': '#DAA520', // GoldenRod
  'Deep Sea Fishing': '#20B2AA', // LightSeaGreen
  'Cycling': '#228B22', // ForestGreen
  'Rock Climbing': '#A0522D' // Sienna
};

// Define the navigation stack parameters
type RootStackParamList = {
  DetailedUser: { userId: string };
  // Add other screens and their parameters here
};

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Define fetchUsers function outside of useEffect
  const fetchUsers = async () => {
    const fetchedUsers = await fetchAllUsers();
    const usersFormatted = fetchedUsers.map((user: any) => ({
      id: user.id,
      name: user.profileName,
      image: user.profileImage,
      activity: user.role,
      activities: user.activities
    }));
    setUsers(usersFormatted);
  };

  // Fetch all users from Firestore on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleCardPress = (id: string) => {
    navigation.navigate('DetailedUser', { userId: id });
  };

  // Render each user as a card
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
