import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const handleLogin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Signed in 
        const user = userCredential.user;
        console.log("Logged in user: " + user.email);
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

