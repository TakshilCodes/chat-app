import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { FaUserPlus } from "react-icons/fa";

const Register = ({ isLogin, setIsLogin }) => {
    const [isLoading,setIsLoading] = useState(false);

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChangeUserData = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const user = userCredential.user;

      // Firestore doc in "users" collection
      const userDocRef = doc(db, "users", user.uid);

      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        username: user.email?.split("@")[0],
        fullName: userData.fullName,
        image: "",
      });
    } catch (err) {
      console.error("Error registering user:", err.message);
    }
    finally{
        setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen background-image">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
        <p className="text-gray-500 text-center mb-6">
          Welcome, create an account to continue
        </p>

        {/* Form */}
        <form className="space-y-4">
          <input
            name="fullName"
            onChange={handleChangeUserData}
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            name="email"
            onChange={handleChangeUserData}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            name="password"
            onChange={handleChangeUserData}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button disabled={isLoading} onClick={handleAuth} className="bg-[#01aa85] text-white font-bold w-full p-2 rounded-md flex items-center gap-2 justify-center">
                        {isLoading ? (
                            <>Processing...</>
                        ) : (
                            <>
                                Register <FaUserPlus />
                            </>
                        )}
                    </button>
        </form>

        {/* Footer */}
        <button
          className="text-center text-gray-500 mt-6"
          onClick={() => setIsLogin(!isLogin)}
        >
          Already have an account? Sign In
        </button>
      </div>
    </section>
  );
};

export default Register;
