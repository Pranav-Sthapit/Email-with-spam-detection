import "../css/login.css";
import { useState } from "react";
import { MdEmail, MdLock, MdPerson, MdPhotoCamera } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { getKeys } from "../crypto/crypto.js";
import JSONbig from "json-bigint";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Register() {

  const navigate=useNavigate();


  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setPhoto] = useState(null);

  const passwordMatch = () => password === confirmPassword;

  const isEmpty = (field) => field.trim() === "" || field == null;

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    if (isEmpty(firstName)) {
      alert("first name is required");
      return;
    }

    if (isEmpty(lastName)) {
      alert("last name is required");
      return;
    }

    if (isEmpty(email)) {
      alert("email is required");
      return;
    }

    if (isEmpty(password)) {
      alert("password is required");
      return;
    }

    if (!passwordMatch()) {
      alert("password must match to be confirmed");
      return;
    }

    const keyDetail = getKeys(email);
    // logic to send data and receive response and if success keep private key in local storage
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      if (photo) formData.append("photo", photo);
      formData.append("publicKey", keyDetail.publicKey.toString());
      formData.append("N", keyDetail.N.toString());

      const response = await axios.post(
        "http://127.0.0.1:8000/register/",
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


    } catch (error) {
      console.error("error in sending data:", error);
    }
    //end logig
  };

  return (
    <div className="centerWrapper">
      <div className="box">
        <h3 className="heading">Register</h3>
        {/* ✅ Use form instead of div */}
        <form className="formContainer" onSubmit={handleSubmit}>
          {/* First Name */}
          <label className="label">First Name</label>
          <div className="relative w-full">
            <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="normalInput pl-10 w-full"
              required
            />
          </div>

          {/* Last Name */}
          <label className="label">Last Name</label>
          <div className="relative w-full">
            <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="normalInput pl-10 w-full"
              required
            />
          </div>

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

          {/* Confirm Password */}
          <label className="label">Confirm Password</label>
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

          {/* File Upload */}
          <label className="label">Profile Photo</label>
          <div className="relative w-full">
            <MdPhotoCamera className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="fileInput pl-10 w-full"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="okButton flex items-center justify-center gap-2 mt-4 w-full"
          >
            <FaUserPlus />
            <span>Register</span>
          </button>
        </form>
      </div>
    </div>
  );
}
