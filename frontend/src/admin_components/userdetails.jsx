import { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate=useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/admin_view/get_users/"
        );
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = async (id) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/admin_view/block_unblock_user/",
        { id }
      );
      alert(response.data.message);
      // update local state so UI reflects changes instantly
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, blocked: !user.blocked } : user
        )
      );
    } catch (error) {
      console.log("error in sending data", error);
    }
  };

  const handleView=(id)=>{
    navigate("/admin/mails",{state:{id}});
  }

  if (loading) return <p>Loading users...</p>;
  if (users.length === 0) return <p>No users found</p>;

  return (
    <div className="overflow-x-auto bg-white p-4 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">User Details</h2>
      <table className="min-w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-primary text-white">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Photo</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Public Key</th>
            <th className="p-2 border">N</th>
            <th className="p-2 border">Spam Count</th>
            <th className="p-2 border">State</th>
            <th className="p-2 border">Block/Unblock</th>
            <th className="p-2 border">View Mail</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">
                {u.photo ? (
                  <img
                    src={u.photo}
                    alt={u.first_name}
                    className="h-10 w-10 rounded-full border-2 border-white flex-shrink-0"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-primary font-bold flex-shrink-0">
                    {u.first_name.charAt(0).toUpperCase() +
                      u.last_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </td>
              <td className="p-2 border">
                {u.first_name} {u.last_name}
              </td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.public_key}</td>
              <td className="p-2 border">{u.N}</td>
              <td className="p-2 border">{u.spam_count}</td>
              <td className="p-2 border">
                {u.blocked ? (
                  <span className="text-red-600 font-semibold">Blocked</span>
                ) : (
                  <span className="text-green-600 font-semibold">Active</span>
                )}
              </td>
              <td className="p-2 border">
                {u.blocked ? (
                  <button
                    onClick={() => handleChange(u.id)}
                    className="bg-green-600 font-semibold text-white px-4 py-1 rounded-lg hover:bg-green-400"
                  >
                    Un Block
                  </button>
                ) : (
                  <button
                    onClick={() => handleChange(u.id)}
                    className="bg-red-600 font-semibold text-white px-4 py-1 rounded-lg hover:bg-red-400"
                  >
                    Block
                  </button>
                )}
              </td>
              <td>
                <button 
                onClick={()=>handleView(u.id)}
                className="bg-primary font-semibold text-white px-4 py-1 rounded-lg hover:bg-secondary">View Mails</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
