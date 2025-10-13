import UserDetails from "./userdetails";
import Keys from "./keys";
import { useState } from "react";

export default function Admin() {
  const [selected, setSelected] = useState("UserDetails");

  return (
    <div className="flex h-screen bg-gray-100 font-aldrich">
      {/* Sidebar */}
      <div className="flex flex-col gap-3 w-48 bg-blue-700 text-white p-4 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <button
          onClick={() => setSelected("UserDetails")}
          className={`py-2 px-3 rounded-lg text-left transition ${
            selected === "UserDetails"
              ? "bg-blue-500 font-semibold"
              : "hover:bg-blue-600"
          }`}
        >
          User Details
        </button>
        <button
          onClick={() => setSelected("Keys")}
          className={`py-2 px-3 rounded-lg text-left transition ${
            selected === "Keys"
              ? "bg-blue-500 font-semibold"
              : "hover:bg-blue-600"
          }`}
        >
          Keys
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 overflow-auto">
        {selected === "UserDetails" ? <UserDetails /> : <Keys />}
      </div>
    </div>
  );
}
