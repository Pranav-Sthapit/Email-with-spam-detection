import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [changeIsVisible, setChangeIsVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null); // track selected button
  const [contactUs,setContactUs]=useState(false);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    setSelectedButton("logout"); // highlight logout button
  };

  const handleSelect = (buttonName) => {
    setSelectedButton(buttonName);
    if (buttonName === "changeProfile") {setChangeIsVisible(true);setContactUs(false);}
    else if(buttonName === "contactUs") {setChangeIsVisible(false);setContactUs(true);}
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-aldrich">
      {/* Sidebar */}
      <div className="flex flex-col gap-6 w-56 bg-blue-900 text-white p-4">
        <button
          onClick={() => handleSelect("changeProfile")}
          className={`rounded-md py-2 font-medium shadow hover:underline
                      ${selectedButton === "changeProfile" ? "bg-white text-blue-900" : ""}`}
        >
          Change Profile
        </button>
        <button
          onClick={() => handleSelect("contactUs")}
          className={`rounded-md py-2 font-medium hover:underline 
                      ${selectedButton === "contactUs" ? "bg-white text-blue-900" : ""}`}
        >
          About Us
        </button>
        <button
          onClick={handleLogout}
          className={`rounded-md py-2 font-medium hover:underline 
                      ${selectedButton === "logout" ? "bg-white text-blue-900" : ""}`}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        {changeIsVisible && (
          <ChangeDetails setChangeIsVisible={setChangeIsVisible} />
        )}
        {contactUs && (
          <ContactUs setContactUs={setContactUs} />
        )}
      </div>
    </div>
  );
}

function ContactUs({setContactUs}){
  return (
  <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
    {/* About Us Card */}
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl text-center">
      <h1 className="text-3xl font-bold text-blue-900 mb-4">About Us</h1>
      <p className="text-gray-700 mb-4">
        Welcome to Cleanix! We are dedicated to providing the best solutions for our users. 
        Our mission is to make your digital experience seamless and enjoyable.
      </p>
      <p className="text-gray-700 mb-4">
        Our team consists of passionate developers, designers, and innovators who constantly 
        strive to improve our services and create value for our community.
      </p>
      <p className="text-gray-700 mb-4">
        Thank you for trusting us. We are committed to excellence, transparency, and user satisfaction.
      </p>
      <p className="text-gray-700 font-medium mt-4">
        Contact: 9876543210
      </p>
    </div>
  </div>
);

}

function ChangeDetails({ setChangeIsVisible }) {
  const userId = localStorage.getItem("userId");
  const fields = ["first_name", "last_name", "email", "photo", "password"];

  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/user_info/", {
          userId,
          fields,
        });
        setUser(response.data.user);
        setConfirmPassword(response.data.user.password);
      } catch (error) {
        console.error("error in sending data", error);
      }
    };
    fetchUser();
  }, []);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) setPhoto(e.target.files[0]);
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setUser((prev) => ({ ...prev, photo: null }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (user.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const formData = new FormData();
    formData.append("id", userId);
    formData.append("first_name", user.first_name);
    formData.append("last_name", user.last_name);
    formData.append("password", user.password);

    if (photo) {
      formData.append("photo", photo);
    } else if (!user.photo) {
      formData.append("remove_photo", "true");
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/change_info/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert(response.data.message);
      setChangeIsVisible(false);
    } catch (error) {
      console.log("error in sending data", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <form
      onSubmit={handleUpdate}
      className="bg-gray-400 p-6 rounded-xl shadow-lg w-[800px]"
    >
      <h2 className="text-2xl font-bold mb-2">Profile</h2>
      <div className="bg-blue-600 rounded-lg p-6 text-white">
        {/* Email */}
        <h3 className="text-xl font-bold mb-6 text-center">{user.email}</h3>

        <div className="flex gap-6">
          {/* Left: Photo section */}
          <div className="flex flex-col items-center">
            {/* If photo exists, show circle photo */}
            {photo ? (
              <img
                src={URL.createObjectURL(photo)}
                alt="Preview"
                className="h-40 w-40 rounded-full object-cover bg-gray-200"
              />
            ) : user.photo ? (
              <img
                src={user.photo}
                alt={user.first_name}
                className="h-40 w-40 rounded-full object-cover bg-gray-200"
              />
            ) : (
              // If no photo → rectangle with blue circle + initials
              <div className="h-40 w-40 bg-gray-300 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {user.first_name.charAt(0).toUpperCase() +
                    user.last_name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-2 mt-3 w-full">
              <label
                htmlFor="photoUpload"
                className="bg-green-500 text-white px-4 py-2 rounded-md shadow text-center hover:bg-green-600 cursor-pointer"
              >
                Change Photo
              </label>
              {(photo || user.photo) && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
                >
                  Remove Photo
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photoUpload"
              />
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white text-black p-6 rounded-lg shadow-md flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                value={user.first_name}
                className="border p-2 rounded w-full"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, first_name: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                value={user.last_name}
                className="border p-2 rounded w-full"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, last_name: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={user.password || ""}
                className="border p-2 rounded w-full"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                className="border p-2 rounded w-full"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Save Button */}
            <button className="w-full bg-green-500 text-white py-2 rounded-md shadow hover:bg-green-600">
              Save
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
