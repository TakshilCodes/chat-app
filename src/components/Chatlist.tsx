import { useEffect, useMemo, useState } from "react";
import defaultAvatar from "../../public/assets/default.jpg";
import { RiMore2Fill } from "react-icons/ri";
import SearchModal from "./SearchModal";
import { formatTimestamp } from "../utils/formatTimestamp";
import { auth, db, listenForChats } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { User } from "../types";

/** Types local to this file (or move to types.ts if you prefer) */
interface Chat {
  id: string;
  users: User[];
  lastMessage?: string;
  lastMessageTimestamp?: {
    seconds: number;
    nanoseconds: number;
  };
}

interface ChatlistProps {
  setSelectedUser: (user: User) => void;
}

const Chatlist: React.FC<ChatlistProps> = ({ setSelectedUser }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Load current user's profile doc (guard for auth readiness)
  useEffect(() => {
    const uid = auth?.currentUser?.uid;
    if (!uid) return;

    const userDocRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(userDocRef, (snap) => {
      setUser(snap.data() as User | undefined ?? null);
    });

    return unsubscribe;
  }, []);

  // Live chat list
  useEffect(() => {
    const unsubscribe = listenForChats(setChats);
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      const aT =
        (a?.lastMessageTimestamp?.seconds ?? 0) +
        (a?.lastMessageTimestamp?.nanoseconds ?? 0) / 1e9;
      const bT =
        (b?.lastMessageTimestamp?.seconds ?? 0) +
        (b?.lastMessageTimestamp?.nanoseconds ?? 0) / 1e9;
      return bT - aT;
    });
  }, [chats]);

  const startChat = (u: User) => setSelectedUser(u);

  const myEmail = auth?.currentUser?.email;

  return (
    <section className="relative hidden lg:flex flex-col item-start justify-start bg-white h-[100vh] w-[100%] md:w-[600px]">
      <header className="flex items-center justify-between w-[100%] lg:border-b border-b-1 p-4 sticky md:static top-0 z-[100] border-r border-[#9090902c]">
        <main className="flex items-center gap-3">
          <img
            src={user?.image || defaultAvatar}
            className="w-[44px] h-[44px] object-cover rounded-full"
            alt={user?.fullName || "ChatFrik user"}
          />
          <span>
            <h3 className="p-0 font-semibold text-[#2A3D39] md:text-[17px]">
              {user?.fullName || "ChatFrik user"}
            </h3>
            <p className="p-0 font-light text-[#2A3D39] text-[15px]">
              @{user?.username || "chatfrik"}
            </p>
          </span>
        </main>
        <button className="bg-[#D9F2ED] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg">
          <RiMore2Fill color="#01AA85" className="w-[28px] h-[28px]" />
        </button>
      </header>

      <div className="w-[100%] mt-[10px] px-5">
        <header className="flex items-center justify-between">
          <h3 className="text-[16px]">Messages ({chats.length})</h3>
          <SearchModal startChat={startChat} />
        </header>
      </div>

      <main className="flex flex-col items-start mt-[1.5rem] pb-3 custom-scrollbar w-[100%] h-[100%]">
        {sortedChats.map((chat) => {
          const other =
            chat.users?.find((u) => u?.email !== myEmail) ?? chat.users?.[0];

          if (!other) return null;

          return (
            <button
              key={chat.id}
              className="flex items-start justify-between w-[100%] border-b border-[#9090902c] px-5 pb-3 pt-3"
              onClick={() => startChat(other)}
            >
              <div className="flex items-start gap-3">
                <img
                  src={other.image || defaultAvatar}
                  className="h-[40px] w-[40px] rounded-full object-cover"
                  alt={other.fullName || "Chat user"}
                />
                <span>
                  <h2 className="p-0 font-semibold text-[#2A3d39] text-left text-[17px]">
                    {other.fullName || "ChatFrik User"}
                  </h2>
                  <p className="p-0 font-light text-[#2A3d39] text-left text-[14px]">
                    {chat.lastMessage || ""}
                  </p>
                </span>
              </div>

              <p className="p-0 font-regular text-gray-400 text-left text-[11px]">
                {formatTimestamp(chat.lastMessageTimestamp)}
              </p>
            </button>
          );
        })}
      </main>
    </section>
  );
};

export default Chatlist;
