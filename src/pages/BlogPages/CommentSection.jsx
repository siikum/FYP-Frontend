import { useState, useEffect } from "react";
import axios from "axios";
import pfp from "../../assets/images/pf.jpg";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://127.0.0.1:8000/blog";

const CommentsSection = ({ postId }) => {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${baseUrl}/comments/post/${postId}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (newComment) => {
    try {
      const response = await axios.post(`${baseUrl}/comments/create/`, newComment, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 201 || response.status === 200) {
        fetchComments();
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      setError("Failed to create comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${baseUrl}/comments/${commentId}/delete/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment.");
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = {
        post: postId,
        content: newComment,
      };
      await handleAddComment(data);
      setNewComment("");
    } catch (err) {
      console.log(err);
      setError("Failed to create comment. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return (
    <div className="flex flex-col mt-10 gap-y-10">
      <div className="font-medium text-2xl">Comments</div>

      <div className={`rounded-2xl p-6 bg-white border border-gray-300 text-lg ${isFocused ? "border-2" : ""}`}>
        <textarea
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full h-[100px] outline-none border border-gray-300 rounded-lg p-3"
          placeholder="Write your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmitComment}
            className="bg-orange-500 rounded-4xl py-2 px-6 text-white"
            disabled={loading}
          >
            {loading ? "Posting..." : "Comment"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-y-6">
        {comments.length > 0 ? (
          comments.map((value, index) => (
            <div key={index} className="flex items-start gap-x-6">
              <div className="w-[60px] h-[60px] overflow-hidden rounded-full">
                <img src={pfp} className="w-full h-full object-cover rounded-full" alt="User Profile" />
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-4 relative">
                  <div className="font-medium text-lg">{value.author}</div>
                  <div className="text-gray-500 text-sm">{new Date(value.created_at).toDateString()}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(index);
                    }}
                    className="relative px-2 py-1 text-black"
                  >
                    &#8230;
                    {dropdownOpen === index && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                        <ul>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => navigate(`/blog/comment/${value.id}/update`)}
                          >
                            Update
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleDeleteComment(value.id)}
                          >
                            Delete
                          </li>
                        </ul>
                      </div>
                    )}
                  </button>
                </div>
                <div className="text-base">{value.content}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No comments yet.</div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
