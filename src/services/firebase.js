import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import {getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy,} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA4rMWCCOf8FLO7x02RhEwAi1s8PEQUo8c",
    authDomain: "chat-room-e7462.firebaseapp.com",
    projectId: "chat-room-e7462",
    storageBucket: "chat-room-e7462.appspot.com",
    messagingSenderId: "408797373583",
    appId: "1:408797373583:web:cf13f3f48df5ebd120bcfa",
    measurementId: "G-SD4YTV36XS"
};



async function loginWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();

        const { user } = await signInWithPopup(auth, provider);

        return { uid: user.uid, displayName: user.displayName };
    } catch (error) {
        if (error.code !== 'auth/cancelled-popup-request') {
            console.error(error);
        }

        return null;
    }
}

async function sendMessage(roomId, user, text) {
    try {
        await addDoc(collection(db, 'chat-rooms', roomId, 'messages'), {
            uid: user.uid,
            displayName: user.displayName,
            text: text.trim(),
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error(error);
    }
}

function getMessages(roomId, callback) {
    return onSnapshot(
        query(
            collection(db, 'chat-rooms', roomId, 'messages'),
            orderBy('timestamp', 'asc')
        ),
        (querySnapshot) => {
            const messages = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(messages);
        }
    );
}


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { loginWithGoogle, sendMessage, getMessages };