import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Typewriter } from "react-simple-typewriter";
// import Footer from "../components/Footer"; 


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const PROFILE_API_URL = `${API_BASE_URL}/account/profile/`;
const BLOGS_API_URL = `${API_BASE_URL}/blog/blogposts/`;

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [editedBio, setEditedBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProfileAndBlogs = async () => {
      const token = getAuthToken();
      if (!token) return navigate("/login");

      try {
        const profileRes = await fetch(PROFILE_API_URL, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!profileRes.ok) throw new Error("Profile fetch failed");
        const profileData = await profileRes.json();
        setUser(profileData);
        setEditedBio(profileData.bio || "");

        const blogsRes = await fetch(BLOGS_API_URL);
        const blogData = await blogsRes.json();
        const userBlogs = blogData.filter(
          (blog) =>
            blog.author?.toLowerCase() === profileData.username?.toLowerCase()
        );
        setBlogs(userBlogs);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndBlogs();
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

  const handleDeletePicture = () => updateProfile({ profile_picture: null });

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
    <div className="min-h-screen bg-[#f3f8f6] pt-24 px-4 md:px-20">
      <Navbar isBlack={true} />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelected}
      />

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 bg-white shadow-md rounded-2xl p-10">
        {/* Profile Left */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img
            src={
              user.profile_picture
                ? `${API_BASE_URL}${user.profile_picture}`
                : "/path/to/default-avatar.png"
            }
            className="w-32 h-32 rounded-full object-cover border-4 border-[#0B3D20] shadow"
            alt="Profile"
            onClick={() => fileInputRef.current?.click()}
          />
          <h2 className="text-2xl font-bold text-[#0B3D20] mt-4">
            {user.username}
          </h2>
          <p className="text-gray-500">
            {user.first_name} {user.last_name}
          </p>

          <hr className="my-4 border-t border-gray-300 w-full" />

          <div className="space-y-1 text-mm">
            <p>
              <span className="font-semibold text-[#0B3D20]">
                Blogs Posted:
              </span>{" "}
              {blogs.length}
            </p>
            <p>
              <span className="font-semibold text-[#0B3D20]">Email:</span>{" "}
              {user.email}
            </p>
          </div>
        </div>

        {/* Bio Right */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#0B3D20] flex justify-between">
              Bio
              {!isEditingBio && (
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="text-sm text-[#0B3D20] hover:underline"
                >
                  Edit
                </button>
              )}
            </h3>
            {isEditingBio ? (
              <>
                <textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  rows={4}
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
              <p className="text-sm mt-2 text-gray-700 min-h-[5em] whitespace-pre-wrap">
                {user.bio || (
                  <span className="italic text-gray-400">No bio yet.</span>
                )}
              </p>
            )}
          </div>

          <div className="mt-6">
            <p className="text-sm italic text-gray-500 text-right">
              <Typewriter
                words={["“Your stories matter. Keep writing.”"]}
                loop={false}
                cursor
                cursorStyle="_"
                typeSpeed={40}
              />
            </p>
          </div>
        </div>
      </div>

      {/* Blog List */}
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
      {/* <Footer /> */}
    </div>
  );
};

export default ProfilePage;
