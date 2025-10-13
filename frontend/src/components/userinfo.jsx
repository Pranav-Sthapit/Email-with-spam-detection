import { useState,useEffect } from "react";
import axios from "axios";
export default function UserInfo() {

  const userId=localStorage.getItem("userId");
  const fields=["first_name","last_name","email","photo"];

  const [user,setUser]=useState({
    first_name:"",
    last_name:"",
    email:"",
    photo:null
  });

  useEffect(()=>{
    const fetchUser=async ()=>{
    try{

      const response=await axios.post("http://127.0.0.1:8000/user_info/",{userId,fields});
      setUser(response.data.user);
    }catch(error){
      console.error("error in sending data",error);
    }
  };

  fetchUser();

  },[userId]);

  return (
    <div className="flex items-center p-3 rounded-md hover:bg-primary/80 transition-colors">
      {/* Avatar (image or initials fallback) */}
      {user.photo ? (
        <img
          src={user.photo}
          alt={user.first_name}
          className="h-10 w-10 rounded-full border-2 border-white flex-shrink-0"
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-primary font-bold flex-shrink-0">
          {user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Name + Email (fade in on expand) */}
      <div
        className="ml-3 overflow-hidden opacity-0 group-hover:opacity-100 
                   transition-opacity duration-200"
      >
        <p className="text-sm font-medium text-white truncate">{user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1)} {user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1)}</p>
        <p className="text-xs text-white/70 truncate">{user.email}</p>
      </div>
    </div>
  );
}