import { FaStar, FaArchive, FaTrash } from "react-icons/fa";
import { FiDownload, FiCornerUpLeft, FiCornerUpRight } from "react-icons/fi";
import {
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaTrashRestore,
  FaCheckCircle,
} from "react-icons/fa";
import { BsXCircleFill } from 'react-icons/bs';
import { MdDeleteForever } from "react-icons/md";
import { ComposeBox } from "./composeBox";
import { useState, useEffect } from "react";
import axios from "axios";

function UserDetail({ mailId, name, dateTime, email, photo }) {
  // Format the date
  const formattedDate = dateTime
    ? new Date(dateTime).toLocaleString("en-US", {
        weekday: "short", // Tue
        month: "numeric", // 8
        day: "numeric", // 26
        year: "numeric", // 2025
        hour: "numeric", // 12
        minute: "2-digit", // 01
        hour12: true, // AM/PM
      })
    : "";

  return (
    <div className="flex items-center justify-between p-3 rounded-md">
      {/* Left: Avatar + Name + Email */}
      <div className="flex items-center">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="h-10 w-10 rounded-full flex-shrink-0"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-transparent flex items-center justify-center text-black font-bold flex-shrink-0 border border-black">
            {name
              .split(" ")
              .map((word) => word[0])
              .join("")}
          </div>
        )}

        <div className="ml-3">
          <p className="text-sm font-medium text-black">{name}</p>
          <p className="text-xs text-black">{email}</p>
        </div>
      </div>

      {/* Right: Date/Time */}
      <p className="text-lg whitespace-nowrap">{formattedDate}</p>
    </div>
  );
}

// Choose icon based on file type
export const getFileIcon = (extension) => {
  switch (extension) {
    case "doc":
    case "docx":
      return <FaFileWord className="text-blue-600" size={24} />;
    case "xls":
    case "xlsx":
      return <FaFileExcel className="text-green-600" size={24} />;
    case "ppt":
    case "pptx":
      return <FaFilePowerpoint className="text-orange-600" size={24} />;
    case "pdf":
      return <FaFilePdf className="text-red-600" size={24} />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FaFileImage className="text-purple-600" size={24} />;
    default:
      return <FaFileAlt className="text-gray-600" size={24} />;
  }
};

function FileAttachment({ filepath }) {
  const filename = filepath?.split("/").pop() || "Unnamed File";
  const extension = filename.split(".").pop()?.toLowerCase();

  return (
    <div className="w-60 h-20 px-4 py-3 border rounded-md bg-white shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      {/* Left: Icon + File Info */}
      <div className="flex items-center gap-3 overflow-hidden">
        {getFileIcon(extension)}
        <div className="flex flex-col overflow-hidden">
          <p className="text-sm font-medium text-gray-800 truncate">
            {filename}
          </p>
          <p className="text-xs text-gray-500">1.2 MB</p>
        </div>
      </div>

      {/* Right: Download Icon */}
      <a
        href={filepath}
        download
        className="text-gray-500 hover:text-blue-600 transition-colors"
        title="Download"
      >
        <FiDownload size={18} />
      </a>
    </div>
  );
}

export default function MailDetail({
  activeMail,
  setActiveMail,
  selected,
  setSelected,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messageData, setMessageData] = useState({});
  const [isStarred, setIsStarred] = useState();
  const [isArchived, setIsArchived] = useState();

  useEffect(() => {
    if (selected.toLowerCase() == "trash" || selected.toLowerCase()=="spam") setActiveMail(null);
  }, [selected]);

  useEffect(() => {
    const fetchMailState = async () => {
      if (!activeMail) return;

      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/fetch_state/${activeMail.id}/`
        );

        setIsStarred(res.data.starred);
        setIsArchived(res.data.archived);
      } catch (err) {
        console.error("Failed to fetch mail state:", err);
      }
    };
    fetchMailState();
  }, [activeMail]);

  const toggle = async (key) => {
    let newStarred = isStarred;
    let newArchived = isArchived;

    if (key === "isStarred") {
      newStarred = !isStarred;
      setIsStarred(newStarred);
    }

    if (key === "isArchived") {
      newArchived = !isArchived;
      setIsArchived(newArchived);
    }

    await axios.patch(`http://127.0.0.1:8000/update_state/${activeMail.id}/`, {
      starred: newStarred,
      archived: newArchived,
    });
  };

  const trash = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/set_trash/${activeMail.id}/`
      );
      console.log(res.data.message);
    } catch (error) {
      console.error("error in sending data", error);
    }
  };

  const restore_trash = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/restore_trash/${activeMail.id}/`
      );
      console.log(res.data.message);
    } catch (error) {
      console.error("error in sending data", error);
    }
  };

  const permanent_delete = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/set_permanent_delete/${activeMail.id}/`
      );
      console.log(res.data.message);
    } catch (error) {
      console.error("error in sending data", error);
    }
  };

  const allow_spam = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/allow_spam/${activeMail.id}/`
      );
      console.log(res.data.message);
    } catch (error) {
      console.error("error in sending data", error);
    }
  };

  const report_spam = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/report_spam/${activeMail.id}/`
      );
      console.log(res.data.message);
    } catch (error) {
      console.error("error in sending data", error);
    }
  };

  const handleReply = () => {
    setIsOpen(true);
    setMessageData({
      to: activeMail.email,
      subject: "",
      body: "",
      attachments: "",
    });
  };
  const handleForward = () => {
    setIsOpen(true);
    setMessageData({
      to: "",
      subject: activeMail.subject,
      body: activeMail.message,
      attachments: activeMail.file_path,
    });
  };

  return (
    <div className="flex-1 p-6 bg-main_bg flex flex-col">
      {activeMail ? (
        <>
          {/* Action bar */}
          <div className="flex items-center justify-between mb-4 border-b border-gray-400 p-2">
            {/*-------------------------------------THE BUTTONS FOR NO SENT NO TRASH---------------------------------------------------*/}
            {selected.toLowerCase() != "sent" &&
            selected.toLowerCase() != "trash" &&
            selected.toLowerCase() != "spam" ? (
              <div className="flex gap-10 text-gray-600">
                <button
                  onClick={() => {
                    toggle("isStarred");

                    if (selected.toLowerCase() != "starred") {
                      setSelected("Starred");
                    } else if (
                      selected.toLowerCase() == "starred" ||
                      selected.toLowerCase() == "archive"
                    ) {
                      setSelected("Inbox");
                    }
                  }}
                  className={`${
                    isStarred ? "text-yellow-500" : "text-gray-600"
                  } hover:text-yellow-500`}
                  title="Star"
                >
                  <FaStar size={18} />
                </button>
                <button
                  onClick={() => {
                    toggle("isArchived");
                    if (selected.toLowerCase() != "archive") {
                      setSelected("Archive");
                    } else if (
                      selected.toLowerCase() == "starred" ||
                      selected.toLowerCase() == "archive"
                    ) {
                      setSelected("Inbox");
                    }
                  }}
                  className={`${
                    isArchived ? "text-blue-500" : "text-gray-600"
                  } hover:text-blue-500`}
                  title="Archive"
                >
                  <FaArchive size={18} />
                </button>
                <button
                  onClick={() => {
                    trash();
                    setActiveMail(null);
                    setSelected("Trash");
                  }}
                  className="hover:text-red-500"
                  title="Delete"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            ) : selected.toLowerCase() == "trash" ? ( //-------------------------------------------THE BUTTONS FOR TRASH And SENT---------------------------------------------
              <div className="flex gap-10 text-gray-600">
                <button
                  className="text-green-400 hover:text-secondary"
                  onClick={() => {
                    restore_trash();
                    setActiveMail(null);
                    setSelected("Inbox");
                  }}
                >
                  <FaTrashRestore size={20} />
                </button>
                <button
                  className="text-red-600 hover:text-black"
                  onClick={() => {
                    const sure = confirm(
                      "Are you sure to delete the message permanently"
                    );
                    if (sure) {
                      permanent_delete();
                      setActiveMail(null);
                      setSelected("Inbox");
                    }
                  }}
                >
                  <MdDeleteForever size={24} />
                </button>
              </div>
            ) : //---------------------------------------IF SPAM THEN-------------------------------------------------------------------
            selected.toLowerCase() == "spam" ? (
              <div className="flex gap-10 text-gray-600">
                <button
                  className="flex gap-3 items-center py-1 px-2 rounded-lg bg-green-400 text-white hover:text-green-400 hover:bg-white"
                  onClick={() => {
                    const sure = confirm("Are you sure to allow the message");

                    if (sure) {
                      allow_spam();
                      setActiveMail(null);
                      setSelected("Inbox");
                    }
                  }}
                >
                  <FaCheckCircle size={18}/>Allow spam
                </button>
                <button
                  className="flex gap-3 items-center px-2 py-1 rounded-lg bg-red-600 text-white hover:text-red-600 hover:bg-white"
                  onClick={() => {
                    const sure = confirm("Are you sure to report the message");
                    if (sure) {
                      report_spam();
                      setActiveMail(null);
                      setSelected("Inbox");
                    }
                  }}
                >
                  <BsXCircleFill size={18}/>Report Spam
                </button>
              </div>
            ) : ( // IF sent only -----------------------------------------------------------------------------
              <div />
            )}

            <button
              onClick={() => setActiveMail(null)}
              className="text-gray-700 hover:text-red-600 text-xl font-bold"
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Subject */}
          <h1 className="p-4 bg-box_bg shadow-lg rounded-lg text-text_clr font-semibold font-aldrich mb-4">
            {activeMail.subject}
          </h1>

          {/* Message container fills remaining space */}
          <div className="flex-1 bg-box_bg shadow-lg rounded-lg text-text_clr font-alegreyaSans flex flex-col">
            {/* User Info */}
            <div className="border-b border-black">
              <UserDetail
                mailId={activeMail.id}
                name={
                  activeMail.first_name.charAt(0).toUpperCase() +
                  activeMail.first_name.slice(1) +
                  " " +
                  activeMail.last_name.charAt(0).toUpperCase() +
                  activeMail.last_name.slice(1)
                }
                dateTime={activeMail.date_time}
                email={activeMail.email}
                photo={activeMail.photo}
              />
            </div>
            {/* Scrollable message + attachments */}
            <div className="flex-1 overflow-y-auto">
              <p className="m-4 mt-8">{activeMail.message}</p>
              <div className="m-6 grid grid-cols-3 gap-2">
                {activeMail.file_path.map((path, index) => (
                  <FileAttachment key={index} filepath={path} />
                ))}
              </div>
            </div>
            {/* Reply / Forward pinned at bottom */}
            {selected.toLowerCase() != "trash" && selected.toLowerCase()!="spam" ? (
              <div className="flex gap-3 justify-center p-4 border-t border-gray-300 text-sm">
                <button
                  onClick={handleReply}
                  className="flex items-center gap-2 px-8 py-2 rounded-lg hover:bg-gray-300 transition-colors font-aldrich border border-black"
                  title="Reply"
                >
                  <FiCornerUpLeft size={16} />
                  <span>Reply</span>
                </button>
                <button
                  onClick={handleForward}
                  className="flex items-center gap-2 px-8 py-2 rounded-lg hover:bg-gray-300 transition-colors font-aldrich border border-black"
                  title="Forward"
                >
                  <FiCornerUpRight size={16} />
                  <span>Forward</span>
                </button>
                {isOpen && (
                  <ComposeBox
                    messageData={messageData}
                    onClose={() => setIsOpen(false)}
                  />
                )}
              </div>
            ) : (
              <div className="flex gap-3 justify-center p-4 border-t border-gray-300 text-sm"></div>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center text-gray-400 h-full">
          Select a mail to view details
        </div>
      )}
    </div>
  );
}
