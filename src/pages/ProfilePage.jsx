// src/components/ProfilePage.jsx
import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import { FaPencilAlt, FaTrash, FaUpload } from 'react-icons/fa';

const ProfilePage = () => {
  const [showOptions, setShowOptions] = useState(false);

  // Dummy user data (replace with data from your backend later)
  const user = {
    username: "Johnathan Clein",
    profile_picture: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    bio: "Commercial photographer based in California. Passionate about capturing unique perspectives and telling stories through imagery.",
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="flex flex-col bg-amber-50 py-[100px] min-h-screen">
      <Navbar isBlack={true} />
      <div className="flex gap-x-20 px-[10%]">
        {/* Left Side: "My Profile" Title */}
        <div className="flex flex-col mt-[150px] fixed gap-y-4 w-[35%]">
          <div className="text-9xl raleway font-bold break-words">My Profile</div>
        </div>

        {/* Empty div for spacing */}
        <div className="w-[40%]"></div>

        {/* Right Side: Profile Container */}
        <div className="w-[50%]">
          {/* Profile Info */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center">
              {/* Profile Picture */}
              <div className="relative">
                <div
                  className="w-32 h-32 rounded-full overflow-hidden border-4 border-white mr-4 cursor-pointer relative"
                  onClick={toggleOptions}
                >
                  <img
                    src={user.profile_picture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  {/* Pencil Icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-gray-300 hover:text-white opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <FaPencilAlt size="sm" /> {/* Reduced size, changed color */}
                  </div>
                </div>

                {/* Options */}
                {showOptions && (
                  <div className="absolute bg-white rounded-md shadow-lg py-1 z-10 mt-1">
                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">
                      <FaTrash className="mr-2" />
                      Delete Picture
                    </button>
                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">
                      <FaUpload className="mr-2" />
                      Change Picture
                    </button>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{user.username}</h2>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Bio</h3>
              <p className="text-gray-700">{user.bio}</p>
            </div>
          </div>

          {/* Posts Section Placeholder */}
          <div className="bg-white rounded-lg shadow-xl p-6 mt-4">
            <h3 className="text-lg font-semibold mb-2">Posts</h3>
            <p className="text-gray-700">
              User's posts will be displayed here. (This is a placeholder)
            </p>
            {/* Add your post grid here later */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;