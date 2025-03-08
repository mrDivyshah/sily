import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Search,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const DUMMY_USERS = [
  { userId: "1", name: "Alice" },
  { userId: "2", name: "Bob" },
  { userId: "3", name: "Charlie" },
  { userId: "4", name: "David" },
  { userId: "5", name: "Eve" },
];

type User = { userId: string; name: string };

type SideBarProps = {
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
};

export default function SideBar({
  selectedUser,
  setSelectedUser,
}: SideBarProps) {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("Guest");
  const [search, setSearch] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setUsername(userData.name);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredUsers = DUMMY_USERS.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`h-screen bg-gray-800 text-white flex flex-col transition-all ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div style={{ display: "none" }}>{user}</div>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && <h2 className="text-lg font-bold">Chat</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-700 rounded"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center bg-gray-800 p-2 rounded-lg">
          <Search size={20} className="text-gray-400" />
          {!isCollapsed && (
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={handleSearch}
              className="ml-2 bg-transparent outline-none w-full text-white"
            />
          )}
        </div>
      </div>

      {/* User List */}
      <ul className="flex-1 overflow-y-auto p-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <li
              key={u.userId}
              className={`flex items-center p-3 rounded cursor-pointer mb-2 transition-all ${
                selectedUser?.userId === u.userId
                  ? "bg-indigo-500"
                  : "hover:bg-gray-800"
              }`}
              onClick={() => setSelectedUser(u)}
            >
              <User size={20} className="text-white" />
              {!isCollapsed && <span className="ml-3">{u.name}</span>}
            </li>
          ))
        ) : (
          <p className="text-gray-400 text-center">No users found</p>
        )}
      </ul>

      {/* Profile & Logout */}
      <div className="p-4 border-t border-gray-700 flex items-center">
        <User size={32} className="text-indigo-400" />
        {!isCollapsed && (
          <div className="ml-3">
            <p className="text-sm font-semibold">{username}</p>
            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-500 flex items-center mt-1"
            >
              <LogOut size={16} className="mr-1" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
