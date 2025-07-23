import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Dropdown } from "../ui/dropdown/Dropdown";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ nama: string; role_name: string } | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (err) {
        console.error("Gagal parsing data user dari localStorage");
      }
    }
  }, []);

  function handleLogout() {
    localStorage.clear();
    navigate("/signin");
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img src="./images/user/owner.png" alt="User" />
        </span>
        <span className="block mr-1 font-medium text-theme-sm">
          {user?.nama || "User"}
        </span>
        <svg
          className={`stroke-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          fill="none"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute right-0 mt-2 w-[260px] p-4 bg-white shadow rounded"
      >
        <div>
          <div className="text-gray-700 font-medium dark:text-white/90">
            {user?.nama}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 w-full text-left text-red-500 hover:underline"
        >
          Logout
        </button>
      </Dropdown>
    </div>
  );
}
