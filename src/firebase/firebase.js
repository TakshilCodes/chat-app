import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  export const listenForChats = (setChats) => {
    const chatsRef = collection(db,"chats");
    const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
        const chatlist = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        const filteredChats = chatlist.filter((chat) => chat?.users?.some((user) => user.email === auth.currentUser.email));

        setChats(filteredChats)
    });

    return unsubscribe;
  };

  export const sendMessage = async (messageText, chatId, user1, user2) => {
    const chatRef = doc(db, "chats", chatId);
  
    const user1Doc = await getDoc(doc(db, "users", user1));
    const user2Doc = await getDoc(doc(db, "users", user2));
  
    console.log(user1Doc);
    console.log(user2Doc);
  
    const user1Data = user1Doc.data();
    const user2Data = user2Doc.data();
  
    const chatDoc = await getDoc(chatRef);
    if (!chatDoc.exists()) {
      await setDoc(chatRef, {
        users: [user1Data, user2Data],
        lastMessage: messageText,
        lastMessageTimestamp: serverTimestamp(),
      });
    } else {
      await updateDoc(chatRef, {
        lastMessage: messageText,
        lastMessageTimestamp: serverTimestamp(),
      });
    }
  
    const messageRef = collection(db, "chats", chatId, "messages");
  
    await addDoc(messageRef, {
      text: messageText,
      sender: auth.currentUser.email,
      timestamp: serverTimestamp(),
    });
  };

  export const listenForMessages = (chatId, setMessages) => {
    const chatRef = collection(db, "chats", chatId, "messages");
    onSnapshot(chatRef, (snapshot) => {
        const messages = snapshot.docs.map((doc) => doc.data());
        setMessages(messages);
    });
  }
  

  export {auth,db};