import { useState } from "react";
import BlogNavbar from "./BlogNavbar";
import BlogPost from "./BlogPost";
import Notifications from "./Notifications";
import Messages from "./messages";
import ChatPopup from "./ChatPopup";

const BlogPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [openChats, setOpenChats] = useState([]);

  // Utility function to get a cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const openChat = (user) => {
    if (!openChats.some((chat) => chat.id === user.id)) {
      setOpenChats([...openChats, user]);
    }
  };

  const closeChat = (id) => {
    setOpenChats(openChats.filter((chat) => chat.id !== id));
  };

  const handlePostSubmit = async () => {
    if (!postText.trim()) {
      alert("Post content cannot be empty!");
      return;
    }

    const formData = new FormData();
    formData.append("description", postText);

    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      formData.append("image", blob, "uploaded_image.jpg");
    }

    try {
      const token = localStorage.getItem("token"); // Ensure token is stored
      if (!token) {
        alert("You need to be logged in to post.");
        return;
      }

      const csrfToken = getCookie("csrftoken"); // CSRF token handling

      const res = await fetch("http://127.0.0.1:8000/blog/blogposts/create/", {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRFToken": csrfToken,
          Authorization: `Token ${token}`,
        },
        credentials: "include",
      });

      console.log("Response Status:", res.status); // Check the status
      console.log("Response Headers:", res.headers); // Inspect the headers

      if (res.ok) {
        // Success
      } else {
        const errorData = await res.json();
        console.error("Error Response:", errorData);
        alert("Failed to create blog post. " + (errorData.detail || ""));
      }

      if (res.ok) {
        alert("Blog post created successfully!");
        setPostText("");
        setImage(null);
        setIsModalOpen(false);
      } else {
        const errorData = await res.json();
        console.error("Error Response:", errorData);
        alert("Failed to create blog post. " + (errorData.detail || ""));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Blog Navigation */}
      <div className="mt-4">
        <BlogNavbar />
      </div>
      <Notifications />

      {/* Right Sidebar (Messages) */}
      <Messages openChat={openChat} />

      {/* Chat Popups */}
      {openChats.map((user) => (
        <ChatPopup
          key={user.id}
          user={user}
          closeChat={() => closeChat(user.id)}
        />
      ))}

      {/* Blog Content Section */}
      <div className="max-w-3xl mx-auto mt-20 p-4 bg-white shadow-md rounded-lg">
        {/* Post Box (Facebook Style) */}
        <div
          className="p-4 bg-white rounded-lg shadow-md flex flex-col space-y-4 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          {/* Top Section */}
          <div className="flex items-center space-x-4">
            {/* User Profile Picture */}
            <img
              src="https://i.pravatar.cc/40"
              alt="User Profile"
              className="w-10 h-10 rounded-full"
            />
            {/* Text area (Clicking this opens the modal) */}
            <div className="w-full p-2 border border-gray-300 rounded-full bg-gray-100 text-gray-600">
              What's on your mind?
            </div>
          </div>

          {/* Options (Photo/Video, Feeling/Activity) */}
          <div className="flex justify-around mt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
            >
              📸 <span>Photo/Video</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
            >
              😊 <span>Feeling/Activity</span>
            </button>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-0">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create Post</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 text-xl"
              >
                &times;
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <img
                src="https://via.placeholder.com/40"
                alt="User Profile"
                className="w-10 h-10 rounded-full"
              />
              <p className="font-semibold">User Name</p>
            </div>

            {/* Post Text Area */}
            <textarea
              className="w-full mt-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            ></textarea>

            {/* Image Preview */}
            {image && (
              <div className="mt-3">
                <img
                  src={image}
                  alt="Uploaded Preview"
                  className="w-full h-40 object-cover rounded-md"
                />
                <button
                  onClick={() => setImage(null)}
                  className="text-red-500 mt-2 text-sm"
                >
                  Remove Image
                </button>
              </div>
            )}

            {/* Image Upload Button */}
            <div className="mt-3">
              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                className="hidden"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="imageUpload"
                className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                📷 Add Image
              </label>
            </div>

            {/* Modal Footer Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handlePostSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold text-center mb-4">Blog Feed</h1>
        <BlogPost />
        <BlogPost />
      </div>
    </div>
  );
};

export default BlogPage;
