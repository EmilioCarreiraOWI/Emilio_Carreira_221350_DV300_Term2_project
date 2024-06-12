import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const fetchAllActivitiesScores = async () => {
  const activitiesRef = collection(db, "activities");
  const allActivities = [];
  const querySnapshot = await getDocs(activitiesRef);

  for (const doc of querySnapshot.docs) {
    const scoresRef = collection(db, "activities", doc.id, "scores");
    const scoresSnapshot = await getDocs(scoresRef);
    const scores = scoresSnapshot.docs.map(scoreDoc => scoreDoc.data().score);
    allActivities.push({
      activityName: doc.data().activityName,
      description: doc.data().description,
      averageSpeed: doc.data().averageSpeed,
      startTime: doc.data().startTime,
      endTime: doc.data().endTime,
      totalDistance: doc.data().totalDistance,
      location: doc.data().location,
      userId: doc.data().userId,
      id: doc.id,
      route: doc.data().route || [],
      scores
    });
  }

  return allActivities;
};

