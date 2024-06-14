import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchAllActivitiesScores } from '../services/LeaderBoardService';
import { fetchAllUsers } from '../services/usersService';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

interface LeaderBoardEntry {
  userName: string;
  totalScore: number;
}

const RewardScreen = () => {
  const [topUsers, setTopUsers] = useState<LeaderBoardEntry[]>([]);
  const [scoredUsers, setScoredUsers] = useState<LeaderBoardEntry[]>([]);
  const [unscoredUsers, setUnscoredUsers] = useState<LeaderBoardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderBoard = async () => {
      try {
        // Fetch activity scores and user data
        const activitiesScores = await fetchAllActivitiesScores();
        const users = await fetchAllUsers();
        const userMap = new Map(users.map(user => [user.id, user.profileName]));

        // Calculate total scores for each user
        const scoresMap = new Map<string, number>();
        activitiesScores.forEach(activity => {
          const userName = userMap.get(activity.userId) || 'Unknown User';
          const totalActivityScore = activity.scores.reduce((acc, score) => acc + score, 0);
          scoresMap.set(userName, (scoresMap.get(userName) || 0) + totalActivityScore);
        });

        // Convert scoresMap to an array and sort by total score
        const leaderBoardData = Array.from(scoresMap, ([userName, totalScore]) => ({
          userName,
          totalScore
        }));
        leaderBoardData.sort((a, b) => b.totalScore - a.totalScore);

        // Separate top 3 users and other users
        const topUsersData = leaderBoardData.slice(0, 3);
        const otherUsersData = leaderBoardData.slice(3);

        // Separate users with scores and without scores
        const scoredUsersData = otherUsersData.filter(user => user.totalScore > 0);
        const unscoredUsersData = users
          .map(user => user.profileName)
          .filter(userName => !scoresMap.has(userName))
          .map(userName => ({ userName, totalScore: 0 }));

        // Update state with fetched data
        setTopUsers(topUsersData);
        setScoredUsers(scoredUsersData);
        setUnscoredUsers(unscoredUsersData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch leaderboard data');
        console.error(err);
      }
      setLoading(false);
    };

    // Initial fetch of leaderboard data
    fetchLeaderBoard();

    // Set up real-time updates for new activities
    const unsubscribe = onSnapshot(collection(db, "activities"), (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          fetchLeaderBoard();
        }
      });
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#108DF9" />
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      {topUsers.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Top 3 Users</Text>
          {topUsers.map((entry, index) => (
            <View key={index} style={[styles.card, (styles as any)[`top${index + 1}Card`]]}>
              <Text style={styles.cardText}>
                {index + 1}. {entry.userName} - {entry.totalScore} points
              </Text>
              <Ionicons
                name={index === 0 ? "trophy" : index === 1 ? "medal" : "ribbon"}
                size={24}
                color={index === 0 ? "gold" : index === 1 ? "silver" : "bronze"}
                style={styles.icon}
              />
            </View>
          ))}
        </>
      )}
      {scoredUsers.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Users with Scores</Text>
          {scoredUsers.map((entry, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardText}>
                {entry.userName} - {entry.totalScore} points
              </Text>
            </View>
          ))}
        </>
      )}
      {unscoredUsers.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Users without Scores</Text>
          {unscoredUsers.map((entry, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardText}>
                {entry.userName}
              </Text>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#24252A',
  },
  title: {
    color: '#FFCE1C',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 50,
    marginBottom: 30
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
} as const);

export default RewardScreen;
