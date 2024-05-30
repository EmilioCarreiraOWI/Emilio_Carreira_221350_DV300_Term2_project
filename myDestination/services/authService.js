import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const handleLogin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Signed in 
        const user = userCredential.user;
        console.log("Logged in user: " + user.email);
        // Update or create user document
        await updateUserInformation(user.uid, { email: user.email });
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
    }
}

export const fetchAllUsers = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        if (!querySnapshot.empty) {
            const userList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            console.log("Fetched users: ", userList);
            return userList;
        } else {
            console.log("No users found.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching users: ", error);
        return [];
    }
}

export const updateUserInformation = async (userId, userInfo) => {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDocs(userRef);
        if (!userDoc.exists()) {
            // If the user document does not exist, create it
            await setDoc(userRef, userInfo);
            console.log("User document created for: ", userId);
        } else {
            // If the user document exists, update it
            await setDoc(userRef, userInfo, { merge: true });
            console.log("User information updated for: ", userId);
        }
        // Optionally, return some status or data indicating success
        return { success: true, userId: userId, updatedFields: userInfo };
    } catch (error) {
        console.error("Error updating user information: ", error);
        // Optionally, return error status or message
        return { success: false, error: error };
    }
}
