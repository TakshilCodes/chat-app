import { useEffect, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

import Chatbox from "./components/Chatbox";
import Chatlist from "./components/Chatlist";
import Login from "./components/Login";
import Navlinks from "./components/Navlinks";
import Register from "./components/Register";

import { auth } from "./firebase/firebase";
import type { User as AppUser } from "./types";

const App: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      {user ? (
        <div className="flex lg:flex-row flex-col items-start w-full">
          <Navlinks />
          <Chatlist setSelectedUser={setSelectedUser} />
          <Chatbox selectedUser={selectedUser} />
        </div>
      ) : (
        <div>
          {isLogin ? (
            <Login isLogin={isLogin} setIsLogin={setIsLogin} />
          ) : (
            <Register isLogin={isLogin} setIsLogin={setIsLogin} />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
