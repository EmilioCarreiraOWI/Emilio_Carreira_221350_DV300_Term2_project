import { db } from "../config/firebaseConfig";
import { collection, addDoc, doc, getDocs } from "firebase/firestore";

export const createNewBucketActivity = async(activity) => {
  try {
    // docRef - our reference to our newly created document
    const docRef = await addDoc(collection(db, "activities"), activity);
    console.log("Activity written with ID: ", docRef.id);
    return true;
  } catch (e) {
    console.error("Error adding activity: ", e);
    return false;
  }
}

export const getMyBucketList = async() => {
  let allActivities = [];

  // Fetch all documents from the 'activities' collection
  const querySnapshot = await getDocs(collection(db, "activities"));

  // Check if the querySnapshot is not empty
  if (!querySnapshot.empty) {
    querySnapshot.forEach((doc) => {
      console.log("Document data:", doc.data());
      // Push each document's data into the allActivities array
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
        route: doc.data().route || []  // Include the route property, defaulting to an empty array if undefined
      });
    });
  } else {
    // Log if no documents are found in the 'activities' collection
    console.log("No such document!");
  }

  return allActivities;
}

