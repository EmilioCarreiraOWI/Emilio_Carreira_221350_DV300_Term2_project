import React from 'react';
import { View, Image, ScrollView, StyleSheet, Text } from 'react-native'; // Added Text to imports
import { useNavigation } from '@react-navigation/native';
import myDestinationLogo from '../assets/images/myDestinationLogo.png';

const HomeScreen = () => {
  const cardData = [
    {
      image: require('../assets/images/card1.jpg'),
      title: 'Mountain Hiking',
      description: 'Explore the best mountain trails with guided hiking tours.'
    },
    {
      image: require('../assets/images/card2.jpg'),
      title: 'Scuba Diving',
      description: 'Dive into the blue waters and discover the marine life.'
    },
    {
      image: require('../assets/images/card3.jpg'),
      title: 'Safari Adventure',
      description: 'Get close to wildlife with our exclusive safari packages.'
    },
    {
      image: require('../assets/images/card4.jpg'),
      title: 'Skydiving',
      description: 'Experience the thrill of skydiving with certified instructors.'
    },
    {
      image: require('../assets/images/card5.jpg'),
      title: 'City Tours',
      description: 'Discover the rich history and culture of iconic cities around the world.'
    },
    {
      image: require('../assets/images/card6.jpg'),
      title: 'Snowboarding',
      description: 'Hit the slopes with our exciting snowboarding adventures.'
    },
    {
      image: require('../assets/images/card7.jpg'),
      title: 'Desert Safari',
      description: 'Explore the vast deserts and experience traditional Bedouin life.'
    },
    {
      image: require('../assets/images/card8.jpg'),
      title: 'Deep Sea Fishing',
      description: 'Catch the biggest fish and enjoy thrilling deep sea fishing trips.'
    },
  ];

  return (
    <ScrollView style={styles.container}>

      <View style={styles.introContainer}>
        <Image source={myDestinationLogo} style={styles.logo} />
        <Text style={styles.introTitle}>My Destination</Text>
        <Text style={styles.introText}>
          Welcome to MyDestination, your ultimate travel companion app. Discover and book exciting adventures around the world!
        </Text>
      </View>

      <View style={styles.cardRow}>
        {cardData.map((card, index) => (
          <View key={index} style={styles.cardContainer}>
            <Image source={card.image} style={styles.cardImage} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
            </View>
          </View>
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
    height: '40%',
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
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  cardContainer: {
    width: '45%', // Adjust width for two cards per row
    backgroundColor: '#3C3E47',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0, // Padding set to 0 to allow image to fill the container
    borderRadius: 25,
    marginBottom: 20,
    overflow: 'hidden', // Ensures the image does not bleed outside the border radius
  },
  cardImage: {
    width: '100%',
    height: 120, // Height adjusted to 100% to fill the container
    resizeMode: 'cover', // Changed to 'cover' to crop and fit the image in the container
  },
  cardTextContainer: {
    marginTop: 10,
    alignItems: 'flex-start',
    padding: 10,
    width: '90%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#108DF9',
  },
  cardDescription: {
    fontSize: 14,
    color: '#fff',
  },
});

export default HomeScreen;
