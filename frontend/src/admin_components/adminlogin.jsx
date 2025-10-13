import "../css/login.css";
import { useState } from "react";
import { MdVerifiedUser, MdLock } from "react-icons/md";
import { FaSignInAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isEmpty = (field) => field.trim() === "" || field == null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEmpty(username)) {
      alert("username is required");
      return;
    }

    if (isEmpty(password)) {
      alert("password is required");
      return;
    }
    //code to send data and verify login
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post(
        "http://127.0.0.1:8000/admin_view/login/",
        formData
      );

      if (response.data.result) {
        navigate("/admin/home");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("error in sending data:", error);
    }
    //end code
  };

  return (
    <div className="centerWrapper">
      <div className="box">
        <h3 className="heading">Admin Login</h3>
        <form onSubmit={handleSubmit} className="formContainer">
          {/* User name */}
          <label className="label">username</label>
          <div className="relative w-full">
            <MdVerifiedUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="normalInput pl-10 w-full"
              required
            />
          </div>

          {/* Password */}
          <label className="label">Password</label>
          <div className="relative w-full">
            <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="passwordInput pl-10 w-full"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="okButton flex items-center justify-center gap-2 mt-4 w-full"
          >
            <FaSignInAlt />
            <span>Login</span>
          </button>
        </form>
      </div>
    </div>
  );
}
