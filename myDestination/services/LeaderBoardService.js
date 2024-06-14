import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

// Function to fetch all activities along with their scores from Firestore
export const fetchAllActivitiesScores = async () => {
  // Reference to the 'activities' collection in Firestore
  const activitiesRef = collection(db, "activities");
  const allActivities = [];
  // Fetch all documents from the 'activities' collection
  const querySnapshot = await getDocs(activitiesRef);

  // Iterate through each activity document
  for (const doc of querySnapshot.docs) {
    // Reference to the 'scores' sub-collection for the current activity
    const scoresRef = collection(db, "activities", doc.id, "scores");
    // Fetch all documents from the 'scores' sub-collection
    const scoresSnapshot = await getDocs(scoresRef);
    // Extract scores from each score document
    const scores = scoresSnapshot.docs.map(scoreDoc => scoreDoc.data().score);

    // Construct an object for the current activity with all details and scores
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
      route: doc.data().route || [], // Default to an empty array if no route data
      scores
    });
  }

  // Return the array of all activities with their details and scores
  return allActivities;
};

