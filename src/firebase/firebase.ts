import { initializeApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  Firestore,
  DocumentData,
  Unsubscribe,
} from "firebase/firestore";

// ---- Config from env ----
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db: Firestore = getFirestore(app);

// ---- Types ----
export interface ChatUser {
  uid: string;
  email: string;
  fullName?: string;
  username?: string;
  image?: string;
}

export interface Message {
  text: string;
  sender: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface Chat {
  id: string;
  users: ChatUser[];
  lastMessage?: string;
  lastMessageTimestamp?: {
    seconds: number;
    nanoseconds: number;
  };
}

// ---- Functions ----
export const listenForChats = (setChats: (chats: Chat[]) => void): Unsubscribe => {
  const chatsRef = collection(db, "chats");
  const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
    const chatlist: Chat[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as DocumentData),
    })) as Chat[];

    const filteredChats = chatlist.filter((chat) =>
      chat?.users?.some((user) => user.email === auth.currentUser?.email)
    );

    setChats(filteredChats);
  });

  return unsubscribe;
};

export const sendMessage = async (
  messageText: string,
  chatId: string,
  user1: string,
  user2: string
): Promise<void> => {
  const chatRef = doc(db, "chats", chatId);

  const user1Doc = await getDoc(doc(db, "users", user1));
  const user2Doc = await getDoc(doc(db, "users", user2));

  const user1Data = user1Doc.data() as ChatUser;
  const user2Data = user2Doc.data() as ChatUser;

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
    sender: auth.currentUser?.email,
    timestamp: serverTimestamp(),
  });
};

export const listenForMessages = (
  chatId: string,
  setMessages: (messages: Message[]) => void
): Unsubscribe => {
  const chatRef = collection(db, "chats", chatId, "messages");
  return onSnapshot(chatRef, (snapshot) => {
    const messages: Message[] = snapshot.docs.map((doc) => doc.data() as Message);
    setMessages(messages);
  });
};

export { auth, db };
