import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";

const UpdateComment = () => {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/blog/comments/${id}/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        setContent(response.data.content);
      } catch (err) {
        setError("Failed to fetch comment data");
      }
    };
    fetchComment();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:8000/blog/comments/${id}/update/`,
        { content },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        navigate(-1); // go back to previous page
      }
    } catch (err) {
      setError("Failed to update comment");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-amber-50 py-[100px]">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4"
      >
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Update Comment</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full border border-gray-300 p-2 rounded-md mb-4"
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white py-2 px-4 rounded-md"
            >
              {loading ? "Updating..." : "Update Comment"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default UpdateComment;
