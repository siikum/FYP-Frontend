import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { Typewriter } from "react-simple-typewriter";
import Swal from "sweetalert2";


const CreateBlog = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLoggedIn = !!localStorage.getItem("authToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title || !description || !file) {
      const errorMessage = "All fields are required";
      setError(errorMessage);
      Swal.fire({
        icon: "warning",
        title: "Missing Info",
        text: errorMessage,
        confirmButtonColor: "#B91C1C",
      });
      return;
    }
  
    try {
      setLoading(true);
      setError("");
  
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("image", file);
  
      const response = await axios.post(
        "http://127.0.0.1:8000/blog/blogposts/create/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );
  
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Blog Posted!",
          text: "Your journey has been shared successfully. 🎉",
          confirmButtonColor: "#0B3D20",
        }).then(() => navigate("/blog")); // Navigate after confirmation
      }
    } catch (err) {
      console.log(err);
      const errorMessage = "Failed to create blog. Make sure you are logged in.";
      setError(errorMessage);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: errorMessage,
        confirmButtonColor: "#B91C1C",
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen font-serif bg-[#f3f8f6] py-[100px]">
      <Navbar isBlack={true} />

      <div className="flex gap-x-20 h-full px-[10%]">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="flex flex-col mt-[150px] gap-y-4 w-[35%]"
        >
          <div className="text-9xl font-serif font-bold break-words">Blogs</div>
          <div className="mt-4 mr-30 text-mm italic text-black w-[70%] self-end text-end">
            <Typewriter
              words={["“Every journey begins with a story. Start yours today.”"]}
              loop={false}
              cursor
              cursorStyle="_"
              typeSpeed={200}
              deleteSpeed={0}
              delaySpeed={3000}
            />
          </div>
        </motion.div>

        {/* Right Section - Form */}
        <div className="w-[50%] pt-[100px] flex justify-center">
          <div className="bg-white shadow-md rounded-xl p-10 w-full max-w-2xl">
            <h2 className="text-3xl font-bold text-[#0B3D20] mb-6">
              Share Your Journey
            </h2>
            <p className="text-gray-600 mb-8 text-md leading-relaxed">
              Inspire others by sharing your travel story. Your experience might
              be the spark someone needs to explore the world.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
              {error && (
                <div className="text-red-500 font-medium text-lg">{error}</div>
              )}

              {!isLoggedIn && (
                <p className="text-mm text-gray-600 -mt-2 mb-2">
                  Please{" "}
                  <span
                    className="text-green-800 underline cursor-pointer"
                    onClick={() =>
                      navigate("/LoginPage", {
                        state: { from: location.pathname },
                      })
                    }
                  >
                    login
                  </span>{" "}
                  to create a blog.
                </p>
              )}

              {/* Title Field */}
              <div className="flex flex-col gap-y-2">
                <label className="text-lg font-semibold">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  className="border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B3D20]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your blog a title"
                  required
                />
              </div>

              {/* Image Field */}
              <div className="flex flex-col gap-y-2">
                <label className="text-lg font-semibold">
                  Image <span className="text-red-500">*</span>
                </label>
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
                  {file ? file.name : "Select an image"}
                </label>
              </div>

              {/* Description Field */}
              <div className="flex flex-col gap-y-2">
                <label className="text-lg font-semibold">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="border border-gray-400 p-3 rounded-md h-[160px] resize-none focus:outline-none focus:ring-2 focus:ring-[#0B3D20]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell your story..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isLoggedIn}
                className={`text-lg font-medium w-full px-6 py-3 rounded-md transition ${
                  isLoggedIn
                    ? "text-white bg-[#0B3D20] hover:bg-green-900"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {loading ? "Creating..." : "Create Blog"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
