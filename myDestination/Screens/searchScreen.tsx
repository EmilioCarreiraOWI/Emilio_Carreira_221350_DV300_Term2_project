import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, Image } from 'react-native';
import { Colors } from '../constants/Colors';

// Define the User interface
interface User {
  id: string;
  name: string;
  image: any;
  activity: string;
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

const SearchScreen = () => {
  // State for handling search input
  const [searchQuery, setSearchQuery] = useState('');

  // Static user data
  const users: User[] = [
    { id: '1', name: 'John Doe', image: require('../assets/images/user1.jpg'), activity: 'Mountain Hiking' },
    { id: '2', name: 'Jane Smith', image: require('../assets/images/user2.jpg'), activity: 'Scuba Diving' },
    { id: '3', name: 'William Johnson', image: require('../assets/images/user3.jpg'), activity: 'Safari Adventure' },
    { id: '4', name: 'Emily Clark', image: require('../assets/images/user4.jpg'), activity: 'Skydiving' },
    { id: '5', name: 'Michael Brown', image: require('../assets/images/user5.jpg'), activity: 'City Tours' },
    { id: '6', name: 'Linda Gates', image: require('../assets/images/user6.jpg'), activity: 'Snowboarding' },
    { id: '7', name: 'Robert Lee', image: require('../assets/images/user7.jpg'), activity: 'Desert Safari' },
    { id: '8', name: 'Jessica Taylor', image: require('../assets/images/user8.jpg'), activity: 'Deep Sea Fishing' },
    { id: '9', name: 'Daniel Young', image: require('../assets/images/user9.jpg'), activity: 'Cycling' },
    { id: '10', name: 'Laura White', image: require('../assets/images/user10.jpg'), activity: 'Rock Climbing' },
  ];

  // Filter users based on search query
  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Render each user as a card
  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <Text style={styles.cardText}>{item.name} - </Text>
      <Text style={[styles.cardActivity, { color: activityColors[item.activity] }]}>{item.activity}</Text>
    </View>
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
      <Text style={styles.title}>{filteredUsers.length === 1 ? `${filteredUsers[0].name} - ${filteredUsers[0].activity}` : "All the users"}</Text>
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
