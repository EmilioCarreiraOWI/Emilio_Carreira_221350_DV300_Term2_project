import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, Image } from 'react-native';
import { Colors } from '../constants/Colors';

interface User {
  id: string;
  name: string;
  image: any;
}

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const users: User[] = [
    { id: '1', name: 'John Doe', image: require('../assets/images/user1.jpg') },
    { id: '2', name: 'Jane Smith', image: require('../assets/images/user2.jpg') },
    { id: '3', name: 'William Johnson', image: require('../assets/images/user3.jpg') },
    { id: '4', name: 'Emily Clark', image: require('../assets/images/user4.jpg') },
    { id: '5', name: 'Michael Brown', image: require('../assets/images/user5.jpg') },
    { id: '6', name: 'Linda Gates', image: require('../assets/images/user6.jpg') },
    { id: '7', name: 'Robert Lee', image: require('../assets/images/user7.jpg') },
    { id: '8', name: 'Jessica Taylor', image: require('../assets/images/user8.jpg') },
    { id: '9', name: 'Daniel Young', image: require('../assets/images/user9.jpg') },
    { id: '10', name: 'Laura White', image: require('../assets/images/user10.jpg') },
  ];

  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <Text style={styles.cardText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search users..."
        placeholderTextColor={Colors.light.icon}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Text style={styles.title}>{filteredUsers.length === 1 ? filteredUsers[0].name : "All the users"}</Text>
      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#24252A',
    padding: 10,
  },
  searchBar: {
    height: 60,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#3C3E47',
    borderColor: '#108DF9',
    borderWidth: 3,
    borderRadius: 25,
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
    fontSize: 18,
    color: '#fff',
  },
});

export default SearchScreen;
