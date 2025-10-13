import ComposeButton from "./composeBox";
import UserInfo from "./userinfo";
import { useNavigate } from "react-router-dom";
import {
  FaInbox,
  FaStar,
  FaPaperPlane,
  FaArchive,
  FaExclamationTriangle,
  FaTrash,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";

const mainNavItems = [
  { name: "Inbox", icon: FaInbox, action: () => console.log("Inbox clicked") },
  { name: "Starred", icon: FaStar, action: () => console.log("Starred clicked") },
  { name: "Sent", icon: FaPaperPlane, action: () => console.log("Sent clicked") },
  { name: "Archive", icon: FaArchive, action: () => console.log("Archive clicked") },
  { name: "Spam", icon: FaExclamationTriangle, action: () => console.log("Spam clicked") },
  { name: "Trash", icon: FaTrash, action: () => console.log("Trash clicked") },
];

const bottomNavItems = [
  { name: "Settings", icon: FaCog, action: () => console.log("Settings clicked") },
  { name: "Help", icon: FaQuestionCircle, action: () => console.log("Help clicked") },
];

const user = {
    name: "Pranav Sthapit",
    email: "pranav@gmail.com",
    image: "",       // leave empty to use initials fallback
    initials: "PS",  // fallback if no image
  };


export default function NavBar({ selected, setSelected ,navExpanded, setNavExpanded}) {
  const navigate=useNavigate();
  return (
    <aside
      className={`group h-screen bg-primary flex flex-col justify-between transition-all duration-300 ease-in-out ${
        navExpanded ? "w-64" : "w-16"
      }`}
      onMouseEnter={() => setNavExpanded(true)}
      onMouseLeave={() => setNavExpanded(false)}
    >
      {/* Top section */}
      <div>
        <UserInfo />
        <ComposeButton setNavExpanded={setNavExpanded}/>
        <ul className="space-y-1 p-2">
          {mainNavItems.map(({ name, icon: Icon }) => (
            <li key={name}>
              <button
                onClick={() => setSelected(name)}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    selected === name
                      ? "bg-white text-primary shadow-lg"
                      : "text-white hover:bg-primary/80"
                  }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span
                  className="ml-3 whitespace-nowrap overflow-hidden 
                             opacity-0 group-hover:opacity-100 
                             transition-opacity duration-200"
                >
                  {name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom section */}
      <ul className="space-y-1 p-2 border-t border-white/40">
        {bottomNavItems.map(({ name, icon: Icon }) => (
          <li key={name}>
            <button
              onClick={() => {
                if(name.toLowerCase()=="settings")
                  navigate(`/settings`);
                if(name.toLowerCase()=="help")
                  navigate(`/help`);
              
              }}
              className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  selected === name
                    ? "bg-white text-primary shadow-lg"
                    : "text-white hover:bg-primary/80"
                }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span
                className="ml-3 whitespace-nowrap overflow-hidden 
                           opacity-0 group-hover:opacity-100 
                           transition-opacity duration-200"
              >
                {name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
