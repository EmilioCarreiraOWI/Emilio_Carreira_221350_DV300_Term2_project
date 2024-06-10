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
                activityName: activityDoc.data().activityName || 'Unknown',
                description: activityDoc.data().description || 'No description',
                userId: doc.id,
                location: activityDoc.data().location || 'Unknown location',
                route: activityDoc.data().route || [],
                totalDistance: activityDoc.data().totalDistance || 0,
                averageSpeed: activityDoc.data().averageSpeed || 0,
                time: activityDoc.data().time || 0
            }));
            return {
                id: doc.id,
                email: doc.data().email || null,
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
    if (!userId || !userProfile) {
        console.error("Invalid input: userId and userProfile must be provided");
        return { success: false, message: "Invalid input: userId and userProfile must be provided" };
    }

    try {
        const userRef = doc(db, "users", userId);
        const updatedProfile = {
            profileName: userProfile.displayName, // Changed from userProfile.profileName to userProfile.displayName
            profileImage: userProfile.photoURL, // Changed from userProfile.profileImage to userProfile.photoURL
            email: userProfile.email,
            role: userProfile.role
        };
        await setDoc(userRef, updatedProfile, { merge: true });
        console.log("User profile updated: ", userId);
        return { success: true, message: "Profile updated successfully" };
    } catch (error) {
        console.error("Error saving or updating user profile: ", error);
        return { success: false, message: "Error saving or updating user profile" };
    }
}
