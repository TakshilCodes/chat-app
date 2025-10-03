import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase/firebase"
import { FaSignInAlt } from "react-icons/fa";

const Login = ({isLogin,setIsLogin}) => {

    const [userData, setUserData] = useState({email: "",password: "",});
    const [isLoading,setIsLoading] = useState(false);

    const handleChangeUserData = (e) => {
        const {name,value} = e.target;

        setUserData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    };

    const handleAuth = async (e) =>{
        e.preventDefault();
        setIsLoading(true);
        try{
            await signInWithEmailAndPassword(auth, userData?.email,userData?.password)
        }
        catch(err){
            console.error(err)
        }
        finally{
            setIsLoading(false);
        }
        
    }

    return (
      <section className="flex items-center justify-center min-h-screen background-image">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-2">Sign In</h2>
          <p className="text-gray-500 text-center mb-6">
            Welcome back, login to continue
          </p>
  
          {/* Form */}
          <form className="space-y-4">
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
                                Login <FaSignInAlt />
                            </>
                        )}
                    </button>
          </form>
  
          {/* Footer */}
          <button className="text-center text-gray-500 mt-6" onClick={() => setIsLogin(!isLogin)}>
            Don’t have an account yet? Sign Up
          </button>
        </div>
      </section>
    );
  };
  
  export default Login;
  