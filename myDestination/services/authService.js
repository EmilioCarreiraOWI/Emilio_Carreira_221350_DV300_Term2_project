import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

// Function to handle user login using email and password
export const handleLogin = async (email, password) => {
    try {
        // Attempt to sign in with provided credentials
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Logged in user: ", user.email);
        // Update or create user document in the database
        await updateUserInformation(user.uid, { email: user.email });
    } catch (error) {
        console.error("Login error: ", error.message);
    }
}

// Function to fetch all users from the database
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

// Function to update or create a user's information in the database
export const updateUserInformation = async (userId, userInfo) => {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDocs(userRef);
        if (!userDoc.exists()) {
            // Create a new user document if it does not exist
            await setDoc(userRef, userInfo);
            console.log("User document created for: ", userId);
        } else {
            // Update existing user document
            await setDoc(userRef, userInfo, { merge: true });
            console.log("User information updated for: ", userId);
        }
        // Return success status
        return { success: true, userId: userId, updatedFields: userInfo };
    } catch (error) {
        console.error("Error updating user information: ", error);
        // Return error status
        return { success: false, error: error };
    }
}
