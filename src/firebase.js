// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import {arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc} from "firebase/firestore";
import {getDatabase, onValue, push, ref, set} from "firebase/database";

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
const realtimeTypingDataRef = ref(database, 'typing');


export const getUserData = async (userID) => {
    const usersDocRef = doc(db, "users", userID);
    const usersDocSnap = await getDoc(usersDocRef);
    if (usersDocSnap.exists()) {
        // console.log("user data:", usersDocSnap.data());
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



export const setUserData = async (displayName, email,avatarLink) => {
    const { userdata } = await setDoc(doc(db, "users", auth.currentUser.uid), {
        userID: auth.currentUser.uid,
        displayName: displayName,
        email: email,
        connections: [],
        avatarLink: avatarLink,
        latestConnection: null
    });
    return userdata;
}
export const setLatestMessages = async (recieverUID, latestMessage) => {
    await setDoc(doc(db, "users", recieverUID, "latestMessages", auth.currentUser.uid), {
        message: latestMessage,
        recieverID: auth.currentUser.uid,
        sender: 'reciever',
        date : new Date().toISOString()
    });
    return await setDoc(doc(db, "users", auth.currentUser.uid, "latestMessages", recieverUID), {
        message: latestMessage,
        recieverID: recieverUID,
        sender: 'me',
        date : new Date().toISOString()
    });

}

export const setUnreadMessages = async (recieverUID,message,option) => {
    // await setDoc(doc(db, "users", recieverUID, "UnreadMessages", auth.currentUser.uid), {
    //     message: messageObj.message,
    //     recieverID: messageObj.recieverID,
    //     sender: messageObj.sender,
    //     date : messageObj.date
    // });
    if (!option) {
        return await setDoc(doc(db, "users", recieverUID, "unreadMessages", auth.currentUser.uid), {
            message: message,
            recieverID: auth.currentUser.uid,
            sender: 'reciever',
            date :  new Date().toISOString()
        });
    }
    if (option === 'delete') {
        return await setDoc(doc(db, "users", auth.currentUser.uid, "unreadMessages", recieverUID), {
            message: null,
            recieverID: null,
            sender: null,
            date : null
        });
    }


}

export const getUnreadMessages = async () => {
    const messageDocRef = query(collection(db, "users", auth.currentUser.uid, "unreadMessages"));
    const messageDocSnap = await getDocs(messageDocRef);
    if (!messageDocSnap.empty) {
        return firestoreToArray(messageDocSnap);
    } else {
        return [];
    }
}
export const getLatestMessages = async () => {
    const messageDocRef = query(collection(db, "users", auth.currentUser.uid, "latestMessages"));
    const messageDocSnap = await getDocs(messageDocRef);
    if (!messageDocSnap.empty) {
        return firestoreToArray(messageDocSnap);
    } else {
        return [];
    }
}

export const updateUserConnections = async (senderID, recieverID) => {
    const userRef = doc(db, "users", senderID);
    return await updateDoc(userRef, {
        connections: arrayUnion(recieverID)
    });
}

export const updateLatestConnection = async  (recieverID) => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    return await updateDoc(userRef, {
        latestConnection: recieverID
    });
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
export const setTyping = async (recieverUserId, status) => {
    return await set(realtimeTypingDataRef, {
        'typerID': auth.currentUser.uid,
        'recieverID': recieverUserId,
        'status': status,
    })
    // const { chatData } = setDoc(doc(db, "chats", auth.currentUser.uid, recieverUserId), {
    //     userID: auth.currentUser.uid,
    //     message: message
    // });
}

export const listenTyping = (snapshotFunc) => {
    onValue(chatsDatabaseRef, snapshotFunc);
};

export const sendBOTMessage = (recieverUserId, message) => {
    push(chatsDatabaseRef, {
        'senderUserId': 'Vd8vr3gobBUrFYt796Wjb5dmzlM2',
        'recieverUserId': recieverUserId,
        'message': message,
        'date': new Date().toISOString()
    })
    // const { chatData } = setDoc(doc(db, "chats", auth.currentUser.uid, recieverUserId), {
    //     userID: auth.currentUser.uid,
    //     message: message
    // });
}
export const setBOTMessageLTS = async (recieverUID, message) => {
    return  setDoc(doc(db, "users", recieverUID, "latestMessages", 'Vd8vr3gobBUrFYt796Wjb5dmzlM2'), {
        message: message,
        recieverID: 'Vd8vr3gobBUrFYt796Wjb5dmzlM2',
        sender: 'reciever',
        date : new Date().toISOString()
    });

}

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
    // console.log('FULL',result)
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