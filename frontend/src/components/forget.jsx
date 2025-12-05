import "../css/login.css";
import { useState } from "react";
import { MdEmail, MdLock } from "react-icons/md";
import { FaSignInAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Forget() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!status) {
      try {
        const res = await axios.post("http://127.0.0.1:8000/verify_exist/", {
          email,
        });
        console.log(res.data.message);
        setStatus(res.data.status);
      } catch (err) {
        console.error("unable to send data", err);
      }
    } else {
      if (password.trim() === "" || password !== confirmPassword) {
        alert("Enter password correctly");
        return false;
      }

      try {
        const res = await axios.post("http://127.0.0.1:8000/forget_password/", {
          email,
          password,
        });
        alert(res.data.message);
        navigate("/sing");
      } catch (err) {
        console.error("unable to send data", err);
      }
    }
  };

  return (
    <div className="centerWrapper">
      <div className="box">
        <h3 className="heading">Forget Password</h3>
        <form onSubmit={handleSubmit} className="formContainer">
          {/* Email */}

          {!status ? (
            <>
              <label className="label">Email</label>
              <div className="relative w-full">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="normalInput pl-10 w-full"
                  required
                />
              </div>
            </>
          ) : (
            <>
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

              <label className="label">ConfirmPassword</label>
              <div className="relative w-full">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="passwordInput pl-10 w-full"
                  required
                />
              </div>
            </>
          )}

          {/* Button */}
          <button
            type="submit"
            className="okButton flex items-center justify-center gap-2 mt-4 w-full"
          >
            <FaSignInAlt />
            <span>Next</span>
          </button>
        </form>
      </div>
    </div>
  );
}
