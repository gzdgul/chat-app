// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc, getFirestore, query, collection, getDocs } from "firebase/firestore";
import { getDatabase, ref, push, onValue} from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDlGsUxosPSzfDSoe3uDPQDX5n9yhapzbo',
    authDomain: 'chat-b8b69.firebaseapp.com' ,
    projectId: 'chat-b8b69' ,
    storageBucket: 'chat-b8b69.appspot.com' ,
    messagingSenderId: '666141740376' ,
    appId: '1:666141740376:web:7064c6c8ddd59f5f8be92d'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const database = getDatabase(app);
const chatsDatabaseRef = ref(database, 'chats');


export const getUserData = async (userID) => {
    const usersDocRef = doc(db, "users", userID);
    const usersDocSnap = await getDoc(usersDocRef);
    if (usersDocSnap.exists()) {
        console.log("user data:", usersDocSnap.data());
        return usersDocSnap.data()
    } else {
        console.log("No such document!");
    }
}

export const getAllUserData = async () => {
    const ref = query(collection(db, "users"));
    const snap = await getDocs(ref);
    if (!snap.empty) {
        return firestoreToArray(snap);
    } else {
        return [];
    }
}



export const setUserData = async (displayName, email) => {
    const { userdata } = await setDoc(doc(db, "users", auth.currentUser.uid), {
        userID: auth.currentUser.uid,
        displayName: displayName,
        email: email
    });
    return userdata;
}


export const updateDisplayName = async  (displayName) => {
    const { user } = await updateProfile(auth.currentUser, {
        displayName: displayName
    })
    return user
}

export const register = async (email, password) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    return user
}

export const login = async (email, password) => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        console.log('giriş başarılı')
        return user
    }catch (err) {
        (err.message.includes('user-not-found')) &&
        alert('Girdiğiniz e-posta veya parola yanlış. Lütfen tekrar deneyin.')
    }


}
export const signout = async () => {
    const { user } = await signOut(auth)
    return user
}


export const sendMessage = (recieverUserId, message) => {
    push(chatsDatabaseRef, {
        'senderUserId': auth.currentUser.uid,
        'recieverUserId': recieverUserId,
        'message': message,
        'date': new Date().toISOString()
    })
    // const { chatData } = setDoc(doc(db, "chats", auth.currentUser.uid, recieverUserId), {
    //     userID: auth.currentUser.uid,
    //     message: message
    // });
}
// export const setChatData = async (recieverUserId) => {
//     const { chatData } = await setDoc(doc(db, "chats", auth.currentUser.uid, recieverUserId), {
//         userID: auth.currentUser.uid,
//         message: message
//
//     });
//     return chatData;
// }

// export const listenMessage = () => {
//     onValue(chatsDatabaseRef, (snapshot) => {
//         const result = snapshotToArray(snapshot);
//         if (result) {
//             return result.filter(x => x.senderUserId === 'FcDB8kR5qnZXH7OOMvm0vIVzPmR2');
//             // return result.filter(x => x.senderUserId === auth.currentUser.uid);
//         }
//     })
// }
export const listenMessage = (snapshotFunc) => {
    onValue(chatsDatabaseRef, snapshotFunc);
};

export const snapshotToArray = (snapshot) => {
    const result = [];
    snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        item.key = childSnapshot.key;
        result.push(item);
    });
    console.log('FULL',result)
    return result;
}

export const firestoreToArray = (snapshot) => {
    const result = [];
    snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.data();
        result.push(item);
    });
    return result;
}

export default app