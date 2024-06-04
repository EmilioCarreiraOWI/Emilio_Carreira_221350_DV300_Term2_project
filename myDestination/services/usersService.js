import { db } from "../config/firebaseConfig";
import { collection, getDocs, query, where, doc, setDoc, addDoc } from "firebase/firestore";

export const fetchAllUsers = async () => {
    try {
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(usersCollectionRef);
        const usersList = await Promise.all(querySnapshot.docs.map(async doc => {
            const userActivitiesRef = collection(db, "activities");
            const activitiesQuery = query(userActivitiesRef, where("userId", "==", doc.id));
            const activitiesSnapshot = await getDocs(activitiesQuery);
            const activities = activitiesSnapshot.docs.map(activityDoc => ({
                id: activityDoc.id,
                ...activityDoc.data()
            }));
            return {
                id: doc.id,
                profileImage: doc.data().profileImage,
                profileName: doc.data().profileName,
                role: doc.data().role,
                activities: activities
            };
        }));
        console.log("Fetched all users with profile details and activities: ", usersList);
        return usersList;
    } catch (error) {
        console.error("Error fetching users from Firebase: ", error);
        return [];
    }
}

export const saveOrUpdateUserProfile = async (userId, userProfile) => {
    try {
        const userRef = doc(db, "users", userId);
        const updatedProfile = {
            profileName: userProfile.displayName,
            profileImage: userProfile.photoURL,
            email: userProfile.email,
            ...userProfile
        };
        if (userId) {
            await setDoc(userRef, updatedProfile, { merge: true });
            console.log("User profile updated: ", userId);
        } else {
            const newUserRef = await addDoc(collection(db, "users"), updatedProfile);
            console.log("New user profile added with ID: ", newUserRef.id);
        }
        return true;
    } catch (error) {
        console.error("Error saving or updating user profile: ", error);
        return false;
    }
}

export async function fetchUserWithActivities(userId) {
    // Implementation to fetch user with activities
}
