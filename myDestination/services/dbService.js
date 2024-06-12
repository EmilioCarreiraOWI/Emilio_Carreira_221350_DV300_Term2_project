import { db } from "../config/firebaseConfig";
import { collection, addDoc, doc, getDoc, setDoc, getDocs, query, where, updateDoc } from "firebase/firestore";

export const createNewBucketActivity = async(activity) => {
  try {
    const docRef = await addDoc(collection(db, "activities"), activity);
    console.log("Activity written with ID: ", docRef.id);
    // Ensure the 'scores' subcollection is created when a new activity is added
    await setDoc(doc(db, "activities", docRef.id, "scores", "totalScore"), { score: 0 });
    return true;
  } catch (e) {
    console.error("Error adding activity: ", e);
    return false;
  }
}

export const getMyBucketList = async(userId) => {
  let allActivities = [];
  const querySnapshot = await getDocs(collection(db, "activities"));

  if (!querySnapshot.empty) {
    querySnapshot.forEach((doc) => {
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
        route: doc.data().route || []
      });
    });
  } else {
    console.log("No activities found in the database.");
  }

  return allActivities;
}

export const addOrUpdateScore = async (activityId, scoreToAdd) => {
  const scoreDocRef = doc(db, "activities", activityId, "scores", "totalScore");
  try {
    const docSnap = await getDoc(scoreDocRef);
    if (docSnap.exists()) {
      const currentScore = docSnap.data().score;
      await updateDoc(scoreDocRef, { score: currentScore + scoreToAdd });
    } else {
      await setDoc(scoreDocRef, { score: scoreToAdd });
    }
    console.log("Score updated successfully");
    return true;
  } catch (e) {
    console.error("Error updating score: ", e);
    return false;
  }
};

export const getScore = async (activityId) => {
  const scoreDocRef = doc(db, "activities", activityId, "scores", "totalScore");
  try {
    const docSnap = await getDoc(scoreDocRef);
    return docSnap.exists() ? docSnap.data().score : 0;
  } catch (e) {
    console.error("Error fetching score: ", e);
    return 0;
  }
};

export const getTotalScoreForUser = async (userId) => {
  if (!userId) {
    console.error("Invalid user ID provided:", userId);
    return 0;
  }

  const activitiesRef = collection(db, "activities");
  const q = query(activitiesRef, where("userId", "==", userId));
  let totalScore = 0;

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      totalScore += doc.data().score || 0; // Ensure each activity has a score, default to 0 if not present
    });
    return totalScore;
  } catch (error) {
    console.error("Error fetching total score for user:", error);
    return 0;
  }
}
