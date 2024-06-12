import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchAllActivitiesScores } from '../services/LeaderBoardService';
import { fetchAllUsers } from '../services/usersService';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

interface LeaderBoardEntry {
  activityName: string;
  description: string; // Added description to the interface
  scores: number[]; // Array of scores
  userName: string; // Added userName to the interface
}

const RewardScreen = () => {
  const [leaderBoard, setLeaderBoard] = useState<LeaderBoardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderBoard = async () => {
      try {
        const activitiesScores = await fetchAllActivitiesScores();
        const users = await fetchAllUsers();
        const userMap = new Map(users.map(user => [user.id, user.profileName]));

        const leaderBoardData = activitiesScores.map(activity => ({
          activityName: activity.activityName,
          description: activity.description, // Added description mapping
          scores: activity.scores,
          userName: userMap.get(activity.userId) || 'Unknown User' // Fetching userName from usersService
        }));

        // Sort leaderBoardData by the total score in descending order
        leaderBoardData.sort((a, b) => b.scores.reduce((acc, score) => acc + score, 0) - a.scores.reduce((acc, score) => acc + score, 0));

        setLeaderBoard(leaderBoardData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch leaderboard data');
        console.error(err);
      }
      setLoading(false);
    };

    fetchLeaderBoard();

    const unsubscribe = onSnapshot(collection(db, "activities"), (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          fetchLeaderBoard();
        }
      });
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const scoredActivities = leaderBoard.filter(entry => entry.scores && entry.scores.length > 0);
  const unscoredActivities = leaderBoard.filter(entry => !entry.scores || entry.scores.length === 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      {scoredActivities.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Scored Activities</Text>
          {scoredActivities.map((entry, index) => (
            <View key={index} style={[styles.card, index < 3 ? (styles as any)[`top${index + 1}Card`] : null]}>
              <Text style={styles.cardText}>
                {index + 1}. {entry.activityName} - {entry.scores.join(', ')} points
              </Text>
              {index < 3 && (
                <Ionicons
                  name={index === 0 ? "trophy" : index === 1 ? "medal" : "ribbon"}
                  size={24}
                  color={index === 0 ? "gold" : index === 1 ? "silver" : "bronze"}
                  style={styles.icon}
                />
              )}
            </View>
          ))}
        </>
      )}
      {unscoredActivities.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Unscored Activities</Text>
          {unscoredActivities.map((entry, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardText}>{index + 1}. {entry.activityName}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#24252A',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 10,
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#3C3E47',
    borderRadius: 25,
    alignItems: 'center',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  top1Card: {
    borderColor: 'gold',
    borderWidth: 2,
  },
  top2Card: {
    borderColor: 'silver',
    borderWidth: 2,
  },
  top3Card: {
    borderColor: 'bronze',
    borderWidth: 2,
  },
  cardText: {
    fontSize: 20,
    color: '#FFFFFF',
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
} as const); // Adding 'as const' to ensure the styles are treated as specific values rather than general strings.

export default RewardScreen;
