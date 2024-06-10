import { db } from "../config/firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

/**
 * Fetches a user and their associated activities from Firestore.
 * @param {string} userId - The ID of the user to fetch.
 * @returns {Promise<ExtendedUser | null>} - The user with their activities or null if not found.
 */
export const fetchUserWithActivities = async (userId) => {
    try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            console.log("No such user!");
            return null;
        }

        const userActivitiesRef = collection(db, "activities");
        const activitiesQuery = query(userActivitiesRef, where("userId", "==", userId));
        const activitiesSnapshot = await getDocs(activitiesQuery);
        const activities = activitiesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const userData = userDoc.data();
        return {
            uid: userId,
            email: userData.email,
            profileName: userData.profileName,
            profileImage: userData.profileImage,
            role: userData.role,
            activities: activities
        };
    } catch (error) {
        console.error("Error fetching user with activities: ", error);
        return null;
    }
};
