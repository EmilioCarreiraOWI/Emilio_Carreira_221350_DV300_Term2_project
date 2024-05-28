import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

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

