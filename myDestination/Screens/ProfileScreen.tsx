import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Your Activities</Text>
        {/* List of activities will be dynamically generated here */}
        <Text>Activity 1: Running 5km</Text>
        <Text>Activity 2: Cycling 20km</Text>
        <Text>Activity 3: Swimming 1km</Text>
      </View>
      <View style={styles.recordSection}>
        <Text style={styles.sectionTitle}>Your Records</Text>
        {/* List of records will be dynamically generated here */}
        <Text>Fastest 5km Run: 25 minutes</Text>
        <Text>Longest Cycle: 50km</Text>
        <Text>Longest Swim: 2km</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  activitySection: {
    marginBottom: 20,
  },
  recordSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ProfileScreen;
