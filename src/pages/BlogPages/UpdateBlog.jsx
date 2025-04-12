import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

const UpdateBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/blog/blogposts/${id}/`);

        const data = await response.json();
        if (data) {
          setTitle(data.title);
          setDescription(data.description);
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
      formData.append("image", file);
    }

    try {
      const response = await fetch(
        `http://localhost:8000/blog/blogposts/${id}/update/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        navigate(`/blog/${id}`);
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
    <div className="flex flex-col min-h-screen font-serif bg-[#f3f8f6] py-[100px]">
      <Navbar isBlack={true} />
      <div className="flex gap-x-20 h-full px-[10%]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="flex flex-col mt-[150px] gap-y-4 w-[35%]"
        >
          <div className="text-9xl font-serif font-bold whitespace-nowrap">
            Update
          </div>
          <div className="mt-4 text-mm italic text-black w-[70%] self-end text-end">
            <Typewriter
              words={["Make changes to your journey — keep your story alive."]}
              loop={false}
              cursor
              cursorStyle="_"
              typeSpeed={200}
              deleteSpeed={0}
              delaySpeed={3000}
            />
          </div>
        </motion.div>

        <div className="w-[50%] pt-[100px] flex justify-center">
          <div className="bg-white shadow-md rounded-xl p-10 w-full max-w-2xl">
            <h2 className="text-3xl font-bold text-[#0B3D20] mb-6">
              Edit Your Story
            </h2>
            <p className="text-gray-600 mb-8 text-md leading-relaxed">
              Updating your travel experience helps others learn more from your
              journey.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
              {error && (
                <div className="text-red-500 font-medium text-lg">{error}</div>
              )}

              <div className="flex flex-col gap-y-2">
                <label className="text-lg font-semibold">Title</label>
                <input
                  className="border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B3D20]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Update your blog title"
                />
              </div>

              <div className="flex flex-col gap-y-2">
                <label className="text-lg font-semibold">Image</label>

                {file && typeof file === "string" && (
                  <img
                    src={file}
                    alt="Current Blog"
                    className="h-40 w-auto rounded-md object-cover"
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
                  className="cursor-pointer border border-gray-400 p-3 rounded-md bg-white hover:bg-gray-100"
                >
                  {file && typeof file !== "string"
                    ? file.name
                    : "Select a new image (optional)"}
                </label>
              </div>

              <div className="flex flex-col gap-y-2">
                <label className="text-lg font-semibold">Description</label>
                <textarea
                  className="border border-gray-400 p-3 rounded-md h-[160px] resize-none focus:outline-none focus:ring-2 focus:ring-[#0B3D20]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Update your story..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="text-lg font-medium w-full px-6 py-3 rounded-md text-white bg-[#0B3D20] hover:bg-green-900"
              >
                {loading ? "Updating..." : "Update Blog"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBlog;
