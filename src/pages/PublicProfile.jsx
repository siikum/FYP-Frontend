import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const PUBLIC_PROFILE_URL = `${API_BASE_URL}/account/profile`;
const BLOGS_API_URL = `${API_BASE_URL}/blog/blogposts/`;

const PublicProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${PUBLIC_PROFILE_URL}/${username}/`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUser(data);

        const blogRes = await fetch(BLOGS_API_URL);
        const blogData = await blogRes.json();
        const userBlogs = blogData.filter(
          (b) => b.author?.toLowerCase() === data.username?.toLowerCase()
        );
        setBlogs(userBlogs);
      } catch (err) {
        console.error(err);
        setError("User not found");
      }
    };

    fetchProfile();
  }, [username]);

  if (error) return <div className="text-center pt-32 text-red-500">{error}</div>;
  if (!user) return <div className="text-center pt-32">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-[#f3f8f6] pt-24 px-4 md:px-20">
      <Navbar isBlack={true} />

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 bg-white shadow-md rounded-2xl p-10">
        {/* Left - Profile Pic + Stats */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img
            src={
              user.profile_picture
                ? `${API_BASE_URL}${user.profile_picture}`
                : "/path/to/default-avatar.png"
            }
            className="w-32 h-32 rounded-full object-cover border-4 border-[#0B3D20] shadow"
            alt="Profile"
          />
          <h2 className="text-2xl font-bold text-[#0B3D20] mt-4">
            {user.username}
          </h2>
          <hr className="my-4 border-t border-gray-300 w-full" />
          <div className="space-y-2 w-full text-left text-base">
            <p className="font-semibold text-[#0B3D20] text-lg">
              Blogs Posted:{" "}
              <span className="font-normal text-gray-800">{blogs.length}</span>
            </p>
          </div>
        </div>

        {/* Right - Info & Bio */}
        <div className="flex flex-col gap-6 justify-center">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Full Name:</span>{" "}
            {user.first_name} {user.last_name}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <div>
            <h3 className="text-lg font-semibold text-[#0B3D20] mb-1">Bio</h3>
            <p className="text-sm mt-2 text-gray-700 min-h-[4em] whitespace-pre-wrap">
              {user.bio || (
                <span className="italic text-gray-400">No bio yet.</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Blogs */}
      <div className="max-w-4xl mx-auto mt-10">
        <h3 className="text-2xl font-bold mb-6 text-[#0B3D20]">
          Blogs by {user.username}
        </h3>
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
          <p className="text-gray-500 italic">No blogs yet.</p>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
