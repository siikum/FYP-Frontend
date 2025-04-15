import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const PROFILE_API_URL = `${API_BASE_URL}/account/profile/`;
const BLOGS_API_URL = `${API_BASE_URL}/blog/blogposts/`;
const MY_CHANNELS_API_URL = `${API_BASE_URL}/account/groupchats/my-channels/`;

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [channelsJoined, setChannelsJoined] = useState(0);
  const [editedBio, setEditedBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken();
      if (!token) return navigate("/login");

      try {
        const [profileRes, blogsRes, channelsRes] = await Promise.all([
          fetch(PROFILE_API_URL, {
            headers: { Authorization: `Token ${token}` },
          }),
          fetch(BLOGS_API_URL),
          fetch(MY_CHANNELS_API_URL, {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);

        if (!profileRes.ok) throw new Error("Profile fetch failed");
        const profileData = await profileRes.json();
        setUser(profileData);
        setEditedBio(profileData.bio || "");

        const allBlogs = await blogsRes.json();
        const userBlogs = allBlogs.filter(
          (b) => b.author?.toLowerCase() === profileData.username?.toLowerCase()
        );
        setBlogs(userBlogs);

        const userChannels = await channelsRes.json();
        setChannelsJoined(userChannels.length);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const updateProfile = async (payload, isFormData = false) => {
    const token = getAuthToken();
    const headers = { Authorization: `Token ${token}` };
    if (!isFormData) headers["Content-Type"] = "application/json";

    try {
      const res = await fetch(PROFILE_API_URL, {
        method: "PATCH",
        headers,
        body: isFormData ? payload : JSON.stringify(payload),
      });
      const updated = await res.json();
      setUser(updated);
      setEditedBio(updated.bio || "");
      setIsEditingBio(false);
    } catch (err) {
      setError("Update failed.");
    }
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const formData = new FormData();
    formData.append("profile_picture", file);
    await updateProfile(formData, true);
    e.target.value = null;
  };

  const handleSaveBio = async () => {
    await updateProfile({ bio: editedBio });
  };

  if (loading) return <div className="text-center py-32">Loading...</div>;
  if (!user)
    return (
      <div className="text-center py-32 text-red-500">
        {error || "User not found"}
      </div>
    );

  return (
    <>
    <Navbar isBlack={true} />
    <div className="min-h-screen bg-[#f3f8f6] pt-[100px] px-4 md:px-20">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelected}
      />

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 bg-white shadow-md rounded-2xl p-10">
        {/* Left */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={
                user.profile_picture
                  ? `${API_BASE_URL}${user.profile_picture}`
                  : "/path/to/default-avatar.png"
              }
              className="w-36 h-36 rounded-full object-cover border-4 border-[#0B3D20] shadow"
              alt="Profile"
            />
            <div className="absolute inset-0 rounded-full bg-gray-300 bg-opacity-50 hidden group-hover:flex items-center justify-center text-xs text-[#0B3D20] font-medium">
              Update Profile Picture
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#0B3D20] mt-4">
            {user.username}
          </h2>
          <hr className="my-4 border-t border-gray-300 w-full" />
          <div className="space-y-2 w-full text-left text-base">
            <p className="font-semibold text-[#0B3D20] text-lg">
              Blogs Posted:{" "}
              <span className="font-normal text-gray-800">{blogs.length}</span>
            </p>
            <p className="font-semibold text-[#0B3D20] text-lg">
              Channels Joined:{" "}
              <span className="font-normal text-gray-800">
                {channelsJoined}
              </span>
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-6 justify-center">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Full Name:</span> {user.first_name}{" "}
            {user.last_name}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-semibold text-[#0B3D20]">Bio</h3>
              {!isEditingBio && (
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="text-[#0B3D20] hover:text-[#0B3D20]"
                >
                  ✎
                </button>
              )}
            </div>
            {isEditingBio ? (
              <>
                <textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  rows={3}
                  className="w-full mt-2 p-3 border rounded-md text-sm"
                  placeholder="Tell us about your travel journey..."
                />
                <div className="mt-2 flex gap-2 justify-end">
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="text-sm px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBio}
                    className="text-sm px-4 py-1 bg-[#0B3D20] text-white rounded hover:bg-green-900"
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm mt-2 text-gray-700 min-h-[4em] whitespace-pre-wrap">
                {user.bio || (
                  <span className="italic text-gray-400">No bio yet.</span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Blogs */}
      <div className="max-w-4xl mx-auto mt-10">
        <h3 className="text-2xl font-bold mb-6 text-[#0B3D20]">Your Blogs</h3>
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => navigate(`/blog/${blog.id}`)}
              className="cursor-pointer mb-6 bg-white p-5 rounded-lg shadow hover:shadow-md transition"
            >
              <h4 className="text-xl font-semibold mb-2">{blog.title}</h4>
              <p className="text-gray-600 line-clamp-3">{blog.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">
            You haven't written any blogs yet.
          </p>
        )}
      </div>
      
    </div>
    <Footer />
    </>
  );
};

export default ProfilePage;
