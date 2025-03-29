import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { motion } from "framer-motion"; // <-- Add this import

const UpdateBlog = () => {
  const { id } = useParams(); // Get blog id from URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch blog data by ID
    const fetchBlogData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/blog/blogposts/${id}`
        );
        const data = await response.json();
        if (data) {
          setTitle(data.title);
          setDescription(data.description);
          // Set the image if it exists
          setFile(data.image ? data.image : null);
        }
      } catch (err) {
        setError("Failed to fetch blog data");
      }
    };

    fetchBlogData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file && typeof file !== "string") {
      formData.append("image", file); // Append image only if it's a file object
    }

    try {
      const response = await fetch(
        `http://localhost:8000/blog/blogposts/${id}/update/`,
        {
          method: "PUT", // We are updating the blog
          body: formData,
        }
      );
      if (response.ok) {
        navigate(`/blog/${id}`); // Redirect to the updated blog page
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to update blog");
      }
    } catch (err) {
      setError("Failed to update blog");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-amber-50 py-[100px]">
      <Navbar isBlack={true} />
      <div className="flex gap-x-20 h-full px-[10%]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="flex flex-col mt-[150px] fixed gap-y-4 w-[35%]"
        >
          <div className="text-9xl raleway font-bold break-words">
            Update Blog
          </div>
          <div className="w-[50%] text-2xl raleway font-medium break-words self-end text-end">
            Edit your travel story
          </div>
        </motion.div>

        <div className="w-[50%]"></div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 h-full justify-center w-[50%] pt-[100px] gap-y-10"
        >
          <div className="flex flex-col h-full w-full text-2xl gap-y-10">
            {error && (
              <div className="text-red-500 font-medium text-lg">{error}</div>
            )}

            <div className="flex flex-col gap-y-4">
              <div className="font-medium">Title</div>
              <input
                className="border-2 border-gray-400 p-4 text-lg rounded-md"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="font-medium">Image</div>

              {/* Existing Image Preview */}
              {file && typeof file === "string" && (
                <img
                  src={file}
                  alt="Current Blog"
                  className="h-40 w-auto rounded-md"
                />
              )}

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                id="fileInput"
                className="hidden"
              />
              <label
                htmlFor="fileInput"
                className="w-full h-[64px] border-2 border-gray-400 p-4 text-lg rounded-md"
              >
                {file && typeof file !== "string"
                  ? file.name
                  : "Please select an image (optional)"}
              </label>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="font-medium">Description</div>
              <textarea
                className="border-2 h-[200px] border-gray-400 text-lg rounded-md p-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="text-xl font-medium w-fit text-white bg-orange-500 hover:bg-orange-400 self-end rounded-3xl px-6 py-2 cursor-pointer"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBlog;
