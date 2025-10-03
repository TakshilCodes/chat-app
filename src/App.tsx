import { useEffect, useState } from 'react'
import Chatbox from './components/Chatbox'
import Chatlist from './components/Chatlist'
import Login from './components/Login'
import Navlinks from './components/Navlinks'
import Register from './components/Register'
import { auth } from './firebase/firebase'
import { onAuthStateChanged } from "firebase/auth"

function App() {
  const [isLogin,setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <div className='flex lg:flex-row flex-col items-start w-full'>
          <Navlinks />
          <Chatlist setSelectedUser={setSelectedUser} />
          <Chatbox selectedUser={selectedUser} />
        </div>
      ) : (
        <div>
          {isLogin ? <Login isLogin={isLogin} setIsLogin={setIsLogin}/> : <Register isLogin={isLogin} setIsLogin={setIsLogin} />}
        </div>
      )}
    </div>
  )
}

export default App
