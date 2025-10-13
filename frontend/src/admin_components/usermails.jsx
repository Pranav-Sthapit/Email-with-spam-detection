import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function UserMails() {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};

  useEffect(() => {
    if (!id) return;

    const fetchMails = async () => {
      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/admin_view/get_user_mails/",
          { id }
        );
        setMails(res.data || []);
      } catch (err) {
        console.error("Error fetching mails:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, [id]);

  const handleView = (id) => {
    navigate("/admin/full_mail_detail", { state: { id } });
  };

  if (loading) return <p>Loading mails...</p>;
  if (mails.length === 0)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6 font-aldrich">
      <div className="bg-white rounded-2xl shadow p-8 text-center w-full max-w-md">
        <h2 className="text-xl font-bold text-blue-900 mb-2">No Mails Found</h2>
        <p className="text-gray-700">This user has no mails to display.</p>
      </div>
    </div>
  );


  return (
    <div className="bg-gray-100 p-10 min-h-screen font-aldrich h-full">
    <div className="overflow-x-auto bg-white p-4 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">User Mails</h2>
      <table className="min-w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-primary text-white">
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Message</th>
            <th className="p-2 border">Spam</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {mails.map((mail) => (
            <tr key={mail.id} className="hover:bg-gray-50">
              <td className="p-2 border font-medium">{mail.subject || "No Subject"}</td>
              <td className="p-2 font-alegreyaSans border max-w-xs truncate">{mail.message || "No Message"}</td>
              <td className="p-2 border">
                {mail.spam ? (
                  <span className="text-red-600 font-semibold">Yes</span>
                ) : (
                  <span className="text-green-600 font-semibold">No</span>
                )}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleView(mail.id)}
                  className="bg-primary text-white px-4 py-1 rounded-lg font-semibold hover:bg-secondary transition-colors"
                >
                  View Mail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
