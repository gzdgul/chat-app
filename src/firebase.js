// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import {arrayUnion, collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc} from "firebase/firestore";
import {getDatabase, onValue, push, ref, set, serverTimestamp, query, orderByChild, startAt,limitToFirst } from "firebase/database";
import { getStorage, uploadBytesResumable, getDownloadURL,getMetadata, listAll } from "firebase/storage";
import { ref as sRef } from 'firebase/storage';
import ImageResizer from 'react-image-file-resizer';
import useFileProgress from "./stores/useFileProgress";



// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN ,
    projectId: process.env.REACT_APP_PROJECT_ID ,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET ,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID ,
    appId: process.env.REACT_APP_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
// const currentUserID = auth.currentUser.uid
const db = getFirestore();
const database = getDatabase(app);
const storage = getStorage();
const chatsDatabaseRef = ref(database, 'chats');
const realtimeTypingDataRef = ref(database, 'typing');
const metadata = {
    contentType: 'image/jpeg'
};

export const listenMessage = (snapshotFunc) => {
    onValue(chatsDatabaseRef, snapshotFunc);
};

// export const loadMoreMessages = (page,snapshotFunc) => {
//     const pageSize = 10; // Her sayfada görüntülenecek mesaj sayısı
//
//     const queryRef = query(
//         chatsDatabaseRef,
//         orderByChild('timestamp'), // Sıralama için kullanılacak alan
//         startAt(10),
//         limitToFirst(pageSize * (page)) // Sayfa numarasına göre başlangıç indeksi
//     );
//
//     onValue(queryRef, snapshotFunc);
// };
export const sendFiles = async (fileInput,recieverID,onProgress) => {
    const currentUserID = auth.currentUser.uid
    if (!fileInput.files[0]) {
        return;
    }
    const file = fileInput.files[0];
    const resizedFile = await new Promise((resolve) => {
        ImageResizer.imageFileResizer(
            file,
            800, // Max genişlik
            1000, // Max yükseklik
            'JPEG', // Çıktı formatı
            90, // Kalite (0-100)
            0, // Döndürme derecesi
            (uri) => {
                // Küçültülen fotoğrafın veri URL'sini kullanabilirsiniz.
                resolve(dataURLtoFile(uri, file.name));
            },
            'base64' // Veri URL formatı
        );
    });
    const placeholder = await new Promise((resolve) => {
        ImageResizer.imageFileResizer(
            file,
            400, // Max genişlik
            400, // Max yükseklik
            'JPEG', // Çıktı formatı
            1, // Kalite (0-100)
            0, // Döndürme derecesi
            (uri) => {
                // Küçültülen fotoğrafın veri URL'sini kullanabilirsiniz.
                resolve(dataURLtoFile(uri, file.name));
            },
            'base64' // Veri URL formatı
        );
    });

    console.log('resizedFile', resizedFile);
    const fileName = new Date().toISOString()
    const metadata = {
        customMetadata: {
            'sender': currentUserID,
            'reciever': recieverID,
        }
    };
    const storageRef = sRef(storage, `files/${currentUserID}/` + fileName);
    const uploadTask = uploadBytesResumable(storageRef, resizedFile, metadata);
    const placeholderStorageRef = sRef(storage, `placeholders/` + fileName + 'placeholder');
    const placeholderUploadTask = uploadBytesResumable(placeholderStorageRef, placeholder, metadata);
    // const recieverStorageRef = sRef(storage, `files/${recieverID}/` + fileName);
    // const recieverUploadTask = uploadBytesResumable(recieverStorageRef, resizedFile, metadata);
    return new Promise((resolve, reject) => {
         uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // console.log('Upload is ' + Math.floor(progress)  + '% done');
                onProgress(Math.floor(progress)); // İlerleme durumunu geri çağırım işlevi aracılığıyla aktar

            },
            (error) => {
                console.log(error)
                reject(error)
            },
            async () => {

                const placeholderUrl = await getDownloadURL(placeholderUploadTask.snapshot.ref)
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

                const img = new Image();
                img.onload = function() {
                    const width = this.width;
                    const height = this.height;
                    const obj = {
                        url: downloadURL,
                        placeholderUrl: placeholderUrl,
                        width: this.width,
                        height: this.height
                    }
                    sendMessage(recieverID, obj)
                    console.log('Genişlik:', width);
                    console.log('Yükseklik:', height);
                };

                img.src = downloadURL;
                img.ariaPlaceholder = placeholderUrl;
                console.log('File available at', downloadURL);
                // getDownloadURL(recieverUploadTask.snapshot.ref).then((downloadURL) => {
                //     console.log('File available at', downloadURL);
                // });
                resolve();
            }

        );
        // setTimeout(() => {
        //     getMetadata(storageRef).then(function(metadata) {
        //         console.log('Dosya adı: ' + metadata.name);
        //         console.log('Dosya boyutu: ' + metadata.size + ' bytes');
        //         console.log('Dosya tipi: ' + metadata.contentType);
        //         console.log('Oluşturma zamanı: ' + metadata.timeCreated);
        //         console.log('Son değiştirme zamanı: ' + metadata.updated);
        //         console.log('TESTTTTTTTTTTTT: ' + metadata.customMetadata.sender);
        //         console.log('FHGFH************ıhjık***************: ', metadata);
        //         console.log('FHGFH************ıhjık***************: ' + metadata.downloadTokens);
        //
        //     }).catch(function(error) {
        //         console.log('Dosya detaylarını alırken bir hata oluştu: ' + error.message);
        //     });
        // },6000)
    })


}

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
        connections: ['Vd8vr3gobBUrFYt796Wjb5dmzlM2'],//Vd8vr3gobBUrFYt796Wjb5dmzlM2
        avatarLink: avatarLink,
        latestConnection: '' //'Vd8vr3gobBUrFYt796Wjb5dmzlM2'
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
export const updateDisplayName = async (displayName) => {
    await updateProfile(auth.currentUser, {
        displayName: displayName
    })
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
        displayName: displayName
    })
}

export const register = async (email, password) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    // const welcome_text = 'TEST 123'
    // // await sendBOTMessage(user.uid, welcome_text)
    // await setBOTMessageLTS(user.uid, welcome_text)
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


export const sendMessage = (recieverUserId, message, replyStatus = false ,key) => {
    push(chatsDatabaseRef, {
        'senderUserId': auth.currentUser.uid,
        'recieverUserId': recieverUserId,
        'message': message,
        'date': new Date().toISOString(),
        'replied': replyStatus,
        'repliedMessageKey': key ? key : null

    })
    // const { chatData } = setDoc(doc(db, "chats", auth.currentUser.uid, recieverUserId), {
    //     userID: auth.currentUser.uid,
    //     message: message
    // });
    // timestamp: serverTimestamp()
}

export const setTyping = async (recieverUserId, status) => {
    return await set(ref(database, 'typing/' + recieverUserId + '/ '+ auth.currentUser.uid), {
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
   setTimeout(() => {
       onValue(ref(database, 'typing/' + auth.currentUser.uid ), snapshotFunc);
   },3000)
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

const dataURLtoFile = (dataURL, fileName) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
};
// export const listImages = async (recieverID) => {
//     const currentUserID = auth.currentUser.uid
//     const listRef = sRef(storage, `files/${currentUserID}`);
//     const imgList = [];
//     const obj = {
//         image: "https://firebasestorage.googleapis.com/v0/b/chat-b8b69.appspot.com/o/files%2FK1ryhFed9RQf6qnrZTQXcbxYwbw2%2F2023-06-03T17%3A50%3A53.067Z?alt=media&token=38817043-9c23-41f1-aea3-802302f66ebe",
//         placeholderImg: "https://firebasestorage.googleapis.com/v0/b/chat-b8b69.appspot.com/o/files%2FK1ryhFed9RQf6qnrZTQXcbxYwbw2%2F2023-06-03T17%3A50%3A53.067Z?alt=media&token=38817043-9c23-41f1-aea3-802302f66ebe",
//         width: 300,
//         height: 500
//     }
//
//     try {
//         const res = await listAll(listRef);
//         const promises = res.items.map(async (itemRef) => {
//             const metadata = await getMetadata(itemRef);
//             if (metadata.customMetadata.sender === recieverID || metadata.customMetadata.reciever === recieverID) {
//                 const dURL = await getDownloadURL(itemRef);
//                 imgList.push(dURL);
//             }
//         });
//
//         await Promise.all(promises);
//         return imgList;
//
//     } catch (error) {
//         console.log('error', error);
//     }
// }

export default app