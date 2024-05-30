import { db } from "../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const fetchAllUsers = async () => {
    try {
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(usersCollectionRef);
        const usersList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            profileImage: doc.data().profileImage,
            profileName: doc.data().profileName,
            role: doc.data().role
        }));
        console.log("Fetched all users with profile details: ", usersList);
        return usersList;
    } catch (error) {
        console.error("Error fetching users from Firebase: ", error);
        return [];
    }
}
