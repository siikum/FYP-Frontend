import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";

const CreateBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !file) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("image", file); // Appending the file

      // Send the POST request with the form data
      const response = await axios.post(
        "http://127.0.0.1:8000/blog/blogposts/create/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${localStorage.getItem("token")}`, // Correct token format
          },
        }
      );

      if (response.status === 201) {
        navigate("/blog"); // Redirect to blogs page after successful post
      }
    } catch (err) {
      console.log(err);
      setError("Failed to create blog. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
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
          <div className="text-9xl raleway font-bold break-words">Blogs</div>
          <div className="w-[50%] text-2xl raleway font-medium break-words self-end text-end">
            Share your travel story with the world
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
                {file ? file.name : "Please select an image"}
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
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
