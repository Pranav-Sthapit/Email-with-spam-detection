import { LuPaperclip, LuSendHorizontal } from "react-icons/lu";
import { useEffect, useState } from "react";
import { getFileIcon } from "./maildetail";
import axios from "axios";
import { encryptString } from "../crypto/crypto.js";
import MessageBox from "./messageBox.jsx";
export default function ComposeButton({ setNavExpanded }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* The Compose button itself */}
      <div className="p-2">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-full px-3 py-2 rounded-md 
                     bg-white text-primary font-medium shadow-md
                     hover:bg-gray-100 transition-colors"
        >
          ✉️
          <span
            className="ml-2 whitespace-nowrap overflow-hidden 
                       opacity-0 group-hover:opacity-100 
                       transition-opacity duration-200"
          >
            Compose
          </span>
        </button>
      </div>

      {/* Conditionally render the ComposeBox */}
      {isOpen && (
        <ComposeBox
          onHover={() => setNavExpanded(false)}
          onClose={() => {
            setIsOpen(false);
            setNavExpanded(false);
          }} // pass down close handler
        />
      )}
    </>
  );
}

export function ComposeBox({ messageData, onClose, onHover }) {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertColor, setAlertColor] = useState(null);

  // States
  const [attachments, setAttachments] = useState([]);
  const [to, setTo] = useState("");
  const [cc, setCc] = useState([]); // Array of emails
  const [ccInput, setCcInput] = useState(""); // Input string for typing
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("userId");

  // Preload data if passed
  useEffect(() => {
    if (!messageData) return;

    setTo(messageData.to || "");
    setSubject(messageData.subject || "");
    setMessage(messageData.body || "");
    setAttachments(messageData.attachments || []);
  }, [messageData]);

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validation function
  const validateCompose = () => {
    // To is required
    if (!to.trim()) {
      alert("Recipient (To) is required.");
      return false;
    }
    if (!validateEmail(to.trim())) {
      alert("Recipient (To) is not a valid email.");
      return false;
    }

    // CC validation (if any)
    for (let email of cc) {
      if (!validateEmail(email)) {
        alert(`Invalid CC email: ${email}`);
        return false;
      }
    }

    // Message or attachments required
    if (!message.trim() && attachments.length === 0) {
      alert("Either message or at least one attachment is required.");
      return false;
    }

    // Subject warning
    if (!subject.trim()) {
      const proceed = confirm(
        "Subject is empty. Are you sure you want to send?"
      );
      if (!proceed) return false;
    }

    return true;
  };

  // Send function
  const handleSend = async () => {
    // Update CC array from input before sending
    const emails = ccInput
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);
    setCc(emails);

    if (!validateCompose()) return;

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("to", to.toLowerCase());
    formData.append("subject", subject);

    try {
      const response = await axios.get("http://127.0.0.1:8000/send_keys/");
      const publicKey = BigInt(response.data.publicKey);
      const N = BigInt(response.data.N);

      const encryptedMessage = encryptString(message, publicKey, N);

      formData.append("message", encryptedMessage);
    } catch (err) {
      console.error("unable to get keys", err);
    }
    formData.append("cc", JSON.stringify(emails));
    attachments
      .filter((att) => att instanceof File)
      .forEach((file) => {
        formData.append("attachments", file);
      });

    const filePaths = attachments.filter((att) => typeof att === "string");
    formData.append("file_paths", JSON.stringify(filePaths));

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/send_mail/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      //customized alert
      var tempMsg = response.data.message;
      if (response.data.unregistered_cc) {
        tempMsg += " " + response.data.unregistered_cc;
      }
      if (response.data.status === 200) setAlertColor("text-green-500");
      else setAlertColor("text-red-500");

      setAlertMessage(tempMsg);
      setAlertVisible(true);
      //end

      if (response.data.status == 200) {
        await new Promise((resolve) => {
          const interval = setInterval(() => {
            if (!alertVisible) {
              clearInterval(interval);
              resolve();
            }
          }, 6500); // check every 6.5s
        });
        onClose();
      }
    } catch (error) {
      console.error("error in sending data", error);
    }
  };

  return (
    <div
      onMouseEnter={onHover}
      className="fixed bottom-10 right-10 border border-gray-400 rounded-lg w-[600px] bg-box_bg"
    >
      <MessageBox
        visible={alertVisible}
        message={alertMessage}
        color={alertColor}
        onClose={() => setAlertVisible(false)}
      ></MessageBox>
      <div className="flex items-center justify-between bg-[#aed4ff] font-aldrich px-4 py-2 border-b border-black rounded-t-lg">
        <h1 className="text-lg font-semibold">New Message</h1>
        <button
          onClick={onClose} // replace with your close handler
          className="text-gray-700 hover:text-red-600 font-bold text-xl"
        >
          ✕
        </button>
      </div>

      <div className="border-b border-black pr-3 pl-3 pt-2 pb-0">
        {/* To Field */}
        <div className="flex items-center border-b border-gray-300 mb-3 pb-0">
          <span className="mr-2 font-semibold text-gray-700 font-alegreyaSans">
            To:
          </span>
          <input
            type="email"
            placeholder="someone@gmail.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="flex-1 outline-none border-none font-alegreyaSans"
          />
        </div>

        {/* CC Field */}
        <div className="flex items-center border-b border-gray-300 mb-3 pb-0">
          <span className="mr-2 font-semibold text-gray-700 font-alegreyaSans">
            Cc:
          </span>
          <input
            type="text"
            placeholder="cc1@example.com, cc2@example.com"
            value={ccInput}
            onChange={(e) => setCcInput(e.target.value)}
            onBlur={() => {
              const emails = ccInput
                .split(",")
                .map((email) => email.trim())
                .filter(Boolean);
              setCc(emails);
              setCcInput(emails.join(", "));
            }}
            className="flex-1 outline-none border-none"
          />
        </div>

        {/* Subject Field */}
        <div className="flex items-center border-b border-gray-300 mb-3 pb-0">
          <input
            type="text"
            placeholder="Add a subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 outline-none border-none font-alegreyaSans"
          />
        </div>
      </div>

      {/* Body and Attachments */}
      <div className="border-b border-black">
        <textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-60 p-2 outline-none resize-none border-none font-alegreyaSans"
        />

        {/* Attachments Row */}
        <div className="p-2 flex flex-wrap items-center gap-2">
          {/* Render existing file paths first */}
          {attachments
            .filter((att) => typeof att === "string")
            .map((path, idx) => {
              const filename = path.split("/").pop();
              const ext = filename.split(".").pop()?.toLowerCase();
              return (
                <div
                  key={`path-${idx}`}
                  className="flex items-center gap-2 bg-[#9bdff8] px-3 py-1 rounded-full text-sm"
                >
                  {getFileIcon(ext)}
                  <span className="max-w-[150px] truncate">{filename}</span>
                  <button
                    onClick={() => removeAttachment(idx)}
                    className="text-gray-500 hover:text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </div>
              );
            })}

          {/* Render newly uploaded File objects */}
          {attachments
            .filter((att) => att instanceof File)
            .map((file, idx) => {
              const ext = file.name.split(".").pop()?.toLowerCase();
              return (
                <div
                  key={`file-${idx}`}
                  className="flex items-center gap-2 bg-[#9bdff8] px-3 py-1 rounded-full text-sm"
                >
                  {getFileIcon(ext)}
                  <span className="max-w-[150px] truncate">{file.name}</span>
                  <button
                    onClick={() => removeAttachment(idx)}
                    className="text-gray-500 hover:text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </div>
              );
            })}

          {/* Attachment Button */}
          <label className="flex items-center gap-2 bg-[#e5e7eb] px-4 py-1 rounded-full cursor-pointer hover:bg-gray-300 transition-colors">
            <LuPaperclip />
            Attach File
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {/* Send Button */}
      <div className="pr-4 pb-2 pt-2 flex justify-end">
        <button
          onClick={handleSend}
          className="flex items-center gap-2 bg-[#3558bd] text-white px-6 py-1 rounded-full font-aldrich hover:bg-[#90c7ff] transition-colors"
        >
          <LuSendHorizontal />
          Send
        </button>
      </div>
    </div>
  );
}
