import { useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import defaultAvatar from "../../public/assets/default.jpg";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { User } from "../types";

/** Props */
interface SearchModalProps {
  startChat: (user: User) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ startChat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert("Please enter a search term");
      return;
    }

    try {
      const normalizedSearchTerm = searchTerm.toLowerCase();

      const q = query(
        collection(db, "users"),
        where("username", ">=", normalizedSearchTerm),
        where("username", "<=", normalizedSearchTerm + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const foundUsers: User[] = [];

      querySnapshot.forEach((docSnap) => {
        foundUsers.push(docSnap.data() as User);
      });

      setUsers(foundUsers);

      if (foundUsers.length === 0) {
        alert("No user found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Search button */}
      <button
        onClick={openModal}
        className="bg-[#D9F2ED] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg"
      >
        <RiSearchLine color="#01AA85" className="w-[18px] h-[18px]" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex justify-center items-center bg-[#00170cb7]"
          onClick={closeModal}
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div
              className="relative bg-[#01AA85] w-[100%] rounded-md shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-300">
                <h3 className="text-xl font-semibold text-white">
                  Search Chat
                </h3>
                <button
                  onClick={closeModal}
                  className="text-white bg-transparent hover:bg-[#d9f2ed] hover:text-[#01AA85] rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                >
                  <FaXmark size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 md:p-5">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      onChange={(e) => setSearchTerm(e.target.value)}
                      type="text"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg outline-none w-full p-2.5"
                      placeholder="Search users"
                    />
                    <button
                      onClick={handleSearch}
                      className="bg-green-900 text-white px-3 py-2 rounded-lg"
                    >
                      <FaSearch />
                    </button>
                  </div>
                </div>

                {/* Results */}
                <div className="mt-6">
                  {users.map((user) => (
                    <div
                      key={user.uid}
                      onClick={() => {
                        startChat(user);
                        closeModal();
                      }}
                      className="flex items-start gap-3 bg-[#15eabc34] p-2 mb-3 rounded-lg cursor-pointer border border-[#ffffff20] shadow-lg"
                    >
                      <img
                        src={user.image || defaultAvatar}
                        className="h-[40px] w-[40px] rounded-full"
                        alt={user.fullName}
                      />
                      <span>
                        <h2 className="p-0 font-semibold text-white text-[18px]">
                          {user.fullName}
                        </h2>
                        <p className="text-[13px] text-white">
                          @{user.username}
                        </p>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchModal;
