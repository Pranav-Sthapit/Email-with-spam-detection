import { LuPaperclip } from "react-icons/lu";
import { getFileIcon } from "./maildetail";

export default function MailBlock({ data, onClick, isActive }) {
  const initials = data.firstName?.charAt(0).toUpperCase()+ data.lastName?.charAt(0).toUpperCase();

  return (
    <div
      onClick={onClick}
      className={`flex items-start justify-between border-b border-gray-200 py-3 px-2 cursor-pointer rounded-md
        ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`}
    >
      {/* Left: Avatar */}
      <div className="flex-shrink-0">
        {data.photo ? (
          <img
            src={data.photo}
            alt={data.firstName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700">
            {initials}
          </div>
        )}
      </div>

      {/* Middle: Sender, Subject, Message */}
      <div className="flex-1 ml-3 overflow-hidden">
        <div className="flex justify-between items-center">
          <p
            className={`font-semibold truncate ${
              isActive ? "text-blue-700" : "text-gray-900"
            }`}
          >
            {data.firstName.charAt(0).toUpperCase()+data.firstName.slice(1)+" "+data.lastName.charAt(0).toUpperCase()+data.lastName.slice(1)}
          </p>
          <span className="text-xs text-gray-500">{data.time}</span>
        </div>
        <p
          className={`text-sm font-medium truncate ${
            isActive ? "font-bold text-blue-800" : "text-gray-800"
          }`}
        >
          {data.subject}
        </p>
        <p className="text-md text-gray-600 truncate font-alegreyaSans">{data.message}</p>

        {/* Attachments */}
        {data.attachments && data.attachments.length > 0 && (
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            
            {data.attachments.map((path, idx) => {
              const fileName = path.split("/").pop();
              const extension = fileName.split(".").pop()?.toLowerCase();
              return (
                <span
                  key={idx}
                  className="bg-gray-200 px-2 py-0.5 rounded-full truncate max-w-auto flex gap-4"
                >
                  {getFileIcon(extension)}
                  <span className="truncate">{fileName}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}