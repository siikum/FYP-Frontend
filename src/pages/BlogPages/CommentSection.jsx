import { useState, useEffect } from "react";
import axios from "axios";
import pfp from "../../assets/images/pf.jpg";

const baseUrl = "http://127.0.0.1:8000/blog";

const CommentsSection = ({ postId }) => {
  const [newComment, setNewComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null); // Track which comment is being edited
  const [editedContent, setEditedContent] = useState(""); // Store edited content for the comment

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${baseUrl}/comments/post/${postId}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`
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
          Authorization: `Token ${localStorage.getItem("authToken")}`
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

  const handleUpdateComment = async (commentId) => {
    if (!editedContent.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    try {
      const response = await axios.put(
        `${baseUrl}/comments/${commentId}/update/`,
        { content: editedContent },  // This sends the updated content
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("authToken")}`
          },
        }
      );
      if (response.status === 200) {
        fetchComments();  // Fetch updated comments list
        setEditingCommentId(null);  // Stop editing mode
        setEditedContent("");  // Clear the editing content
      }
    } catch (error) {
      console.error("Error updating comment:", error.response.data);
      setError("Failed to update comment.");
    }
};


  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${baseUrl}/comments/${commentId}/delete/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`
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

      {/* Create new comment */}
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
            className="bg-[#0B3D20] rounded-4xl py-2 px-6 text-white"
            disabled={loading}
          >
            {loading ? "Posting..." : "Comment"}
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="flex flex-col gap-y-6">
        {comments.length > 0 ? (
          comments.map((value, index) => (
            <div key={index} className="flex items-start gap-x-6">
              <div className="w-[60px] h-[60px] overflow-hidden rounded-full">
                <img src={pfp} className="w-full h-full object-cover rounded-full" alt="User Profile" />
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-4 relative">
                <div className="font-medium text-lg">{value.author_username}</div>
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
                            onClick={() => {
                              setEditingCommentId(value.id);
                              setEditedContent(value.content); // Pre-fill the content for editing
                            }}
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

                {/* Editable comment UI */}
                {editingCommentId === value.id ? (
                  <div>
                    <textarea
                      className="w-full h-[100px] outline-none border border-gray-300 rounded-lg p-3"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => handleUpdateComment(value.id)}
                        className="bg-[#0B3D20] rounded-4xl py-2 px-6 text-white"
                      >
                        Update Comment
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-base">{value.content}</div>
                )}
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
