import { db } from "../config/firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

export const fetchUserWithActivities = async (userId) => {
    try {
        // Reference to the user's document in the Firestore database
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        // Check if the user document exists
        if (!userDoc.exists()) {
            console.log("No such user!");
            return null;
        }

        // Reference to the activities collection filtered by userId
        const userActivitiesRef = collection(db, "activities");
        const activitiesQuery = query(userActivitiesRef, where("userId", "==", userId));
        const activitiesSnapshot = await getDocs(activitiesQuery);

        // Map through each document to create a list of activities
        const activities = activitiesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Extract user data from the document
        const userData = userDoc.data();

        // Construct and return the user object with activities
        return {
            uid: userId,
            email: userData.email,
            profileName: userData.profileName,
            profileImage: userData.profileImage,
            role: userData.role,
            activities: activities
        };
    } catch (error) {
        // Log and handle any errors during the fetch operation
        console.error("Error fetching user with activities: ", error);
        return null;
    }
};
