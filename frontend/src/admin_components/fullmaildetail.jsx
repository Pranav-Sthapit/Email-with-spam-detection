import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { FiDownload } from "react-icons/fi";
import { getFileIcon } from "../components/maildetail";

function UserInfo({ user, label }) {
  if (!user) return null;
  const fullName = `${user.first_name} ${user.last_name}`;
  return (
    <div className="p-3 border-b">
      <p className="text-sm font-semibold">{label} Name: {fullName}</p>
      <p className="text-xs text-gray-600">{label} Email: {user.email}</p>
      <p className="text-xs text-gray-600">{label} ID: {user.id}</p>
    </div>
  );
}

function FileAttachment({ filepath }) {
  const filename = filepath?.split("/").pop() || "Unnamed File";
  const extension = filename.split(".").pop()?.toLowerCase();

  return (
    <div className="w-full md:w-80 h-20 px-4 py-3 border rounded-lg bg-white shadow-sm flex items-center justify-between hover:shadow-md transition-shadow mb-2">
      <div className="flex items-center gap-3 overflow-hidden">
        {getFileIcon(extension)}
        <div className="flex flex-col overflow-hidden">
          <p className="text-sm font-medium truncate">{filename}</p>
        </div>
      </div>
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

export default function FullMailDetail() {
  const location = useLocation();
  const { id } = location.state || {};
  const [mail, setMail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMail = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/admin_view/get_mail_detail/${id}/`
        );
        setMail(res.data);
      } catch (err) {
        console.error("Error fetching mail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMail();
  }, [id]);

  if (loading) return <p>Loading mail...</p>;
  if (!mail) return <p>Mail not found.</p>;

  return (
    <div className="bg-gray-100 p-10  min-h-screen h-full font-aldrich">
    <div className="overflow-x-auto bg-white p-6 rounded-2xl shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">
        {mail.subject || "No Subject"}
      </h2>

      {/* Sender & Receiver Info */}
      <UserInfo user={mail.sender} label="Sender" />
      <UserInfo user={mail.receiver} label="Receiver" />

      {/* Mail Details */}
      <div className="p-3 border rounded-lg mt-4 bg-gray-50">
        <p className="text-sm font-semibold mb-2">Subject:</p>
        <p className="text-gray-800 mb-2">{mail.subject || "No Subject"}</p>

        <p className="text-sm font-semibold mb-2">Message:</p>
        <p className="text-gray-800 font-alegreyaSans mb-2">{mail.message || "No Message"}</p>

        <p className="text-sm font-semibold">
          Spam Detected:{" "}
          {mail.spam ? (
            <span className="text-red-600 font-semibold">Yes</span>
          ) : (
            <span className="text-green-600 font-semibold">No</span>
          )}
        </p>
      </div>

      {/* Attachments */}
      {mail.attachments?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-blue-900 mb-2">Attachments:</h3>
          <div className="flex flex-col gap-2">
            {mail.attachments.map((file, index) => (
              <FileAttachment
                key={index}
                filepath={`http://127.0.0.1:8000${file.file_path}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
