import "../css/login.css";
import { useState } from "react";
import { MdEmail, MdLock } from "react-icons/md";
import { FaSignInAlt } from "react-icons/fa";
import { getKeys } from "../crypto/crypto.js";
import JSONbig from "json-bigint";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Login() {

  const navigate=useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isEmpty = (field) => field.trim() === "" || field == null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEmpty(email)) {
      alert("email is required");
      return;
    }

    if (isEmpty(password)) {
      alert("password is required");
      return;
    }

    const keyDetail = getKeys(email);
    //code to send data and verify login
    try{
      const formData=new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("publicKey", keyDetail.publicKey.toString());
      formData.append("N", keyDetail.N.toString());

      const response= await axios.post(
        "http://127.0.0.1:8000/login/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if(response.data.result){
        navigate("/home");
        localStorage.setItem("keys", JSONbig.stringify(keyDetail));
        localStorage.setItem("userId",response.data.userId);
      }else{
        alert(response.data.message);
      }
    }catch(error){
      console.error("error in sending data:", error);
    }
    //end code
  };

  return (
    <div className="centerWrapper">
      <div className="box">
        <h3 className="heading">Login</h3>
        <form onSubmit={handleSubmit} className="formContainer">
          {/* Email */}
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

          <br/>
          <a href="" className="text-secondary text-sm text-right hover:underline" onClick={()=>navigate("/forget")}>Forget Password</a>
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
