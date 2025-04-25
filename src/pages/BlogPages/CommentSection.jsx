import { useState, useEffect } from "react";
import axios from "axios";
import pfp from "../../assets/images/pf.jpg";
import Swal from "sweetalert2";

const baseUrl = "http://127.0.0.1:8000/blog";

const CommentsSection = ({ postId }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({
    comment: null,
    reply: null,
  });
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedReplyContent, setEditedReplyContent] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loggedInUsername = localStorage
    .getItem("username")
    ?.replace(/"/g, "")
    .trim();

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${baseUrl}/comments/post/${postId}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });

      const commentsWithReplies = await Promise.all(
        response.data.map(async (comment) => {
          try {
            const repliesRes = await axios.get(
              `${baseUrl}/replies/comment/${comment.id}/`
            );
            return {
              ...comment,
              replies: repliesRes.data,
            };
          } catch (error) {
            console.error("Error fetching replies:", error);
            return {
              ...comment,
              replies: [],
            };
          }
        })
      );

      setComments(commentsWithReplies);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (newCommentData) => {
    try {
      const response = await axios.post(
        `${baseUrl}/comments/create/`,
        newCommentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );
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
        { content: editedContent },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.status === 200) {
        fetchComments();
        setEditingCommentId(null);
        setEditedContent("");
      }
    } catch (error) {
      console.error("Error updating comment:", error.response?.data);
      setError("Failed to update comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${baseUrl}/comments/${commentId}/delete/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment.");
    }
  };

  const handlePostReply = async (parentCommentId) => {
    if (!replyContent.trim()) {
      setError("Reply cannot be empty");
      return;
    }
    try {
      await axios.post(
        `${baseUrl}/replies/create/`,
        {
          comment: parentCommentId,
          content: replyContent,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setReplyingToCommentId(null);
      setReplyContent("");
      fetchComments();
    } catch (error) {
      console.error("Error posting reply:", error);
      setError("Failed to post reply.");
    }
  };

  const handleUpdateReply = async (replyId) => {
    if (!editedReplyContent.trim()) {
      setError("Reply cannot be empty");
      return;
    }
    try {
      const response = await axios.put(
        `${baseUrl}/replies/${replyId}/update/`,
        { content: editedReplyContent },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.status === 200) {
        fetchComments();
        setEditingReplyId(null);
        setEditedReplyContent("");
      }
    } catch (error) {
      console.error("Error updating reply:", error);
      setError("Failed to update reply.");
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await axios.delete(`${baseUrl}/replies/${replyId}/delete/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });
      fetchComments();
    } catch (error) {
      console.error("Error deleting reply:", error);
      alert("Failed to delete reply.");
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
      console.error(err);
      setError("Failed to create comment. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (type, id) => {
    setDropdownOpen((prev) => ({
      comment:
        type === "comment" ? (prev.comment === id ? null : id) : prev.comment,
      reply: type === "reply" ? (prev.reply === id ? null : id) : prev.reply,
    }));
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
      <div className="rounded-2xl p-6 bg-white border border-gray-300 text-lg">
        <textarea
          className="w-full h-[100px] outline-none border border-gray-300 rounded-lg p-3"
          placeholder="Write your comment..."
          value={newComment}
          onChange={(e) => {
            if (e.target.value.length <= 256) {
              setNewComment(e.target.value);
            } else {
              Swal.fire({
                icon: "warning",
                title: "Character Limit Reached",
                text: "You can only type up to 256 characters.",
                confirmButtonColor: "#0B3D20",
              });
            }
          }}
        />
        <div className="text-right text-sm text-gray-400">
          {newComment.length}/256
        </div>

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
          comments.map((comment, index) => (
            <div key={index} className="flex flex-col gap-y-2">
              <div className="flex items-start gap-x-6">
                <div className="w-[50px] h-[50px] overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
                  {comment.author_profile_picture ? (
                    <img
                      src={comment.author_profile_picture}
                      className="w-full h-full object-cover rounded-full"
                      alt="User Profile"
                      onError={(e) => {
                        e.target.src = pfp;
                      }}
                    />
                  ) : (
                    <span className="text-gray-600 text-2xl">👤</span>
                  )}
                </div>

                <div className="flex flex-col gap-y-2 flex-1">
                  <div className="flex items-center gap-x-4 relative">
                    <div className="font-medium text-lg">
                      {comment.author_username}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {new Date(comment.created_at).toDateString()}
                    </div>
                    {comment.author_username === loggedInUsername && (
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown("comment", comment.id)}
                          className="text-black text-xl px-2"
                        >
                          &#8230;
                        </button>
                        {dropdownOpen.comment === comment.id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                            <ul>
                              <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditedContent(comment.content);
                                }}
                              >
                                Update
                              </li>
                              <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                Delete
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment.id ? (
                    <>
                      <textarea
                        className="w-full h-[100px] outline-none border border-gray-300 rounded-lg p-3"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          className="bg-[#0B3D20] rounded-4xl py-2 px-6 text-white"
                        >
                          Update Comment
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-base text-justify">
                      {comment.content}
                    </div>
                  )}

                  {/* Reply Button */}
                  <div className="flex gap-x-4 items-center text-sm text-gray-600 mt-2">
                    <button
                      className="hover:underline"
                      onClick={() => setReplyingToCommentId(comment.id)}
                    >
                      Reply
                    </button>
                  </div>

                  {/* Reply Textarea */}
                  {replyingToCommentId === comment.id && (
                    <div className="mt-4 ml-6">
                      <textarea
                        className="w-full h-[80px] outline-none border border-gray-300 rounded-lg p-3"
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handlePostReply(comment.id)}
                          className="bg-[#0B3D20] rounded-4xl py-2 px-6 text-white"
                        >
                          Post Reply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Display Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-4 ml-8 flex flex-col gap-y-6 relative border-l-2 border-gray-300 pl-6">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-x-3 relative">
                          {/* Reply Profile Pic */}
                          <div className="w-[40px] h-[40px] overflow-hidden rounded-full">
                            <img
                              src={reply.author_profile_picture || pfp}
                              className="w-full h-full object-cover rounded-full"
                              alt="Reply Profile"
                              onError={(e) => {
                                e.target.src = pfp;
                              }}
                            />
                          </div>

                          {/* Reply Text Content */}
                          <div className="flex flex-col flex-1">
                            <div className="flex items-center gap-x-2 relative">
                              <div className="text-sm font-semibold flex items-center gap-1">
                                {reply.author_username}
                              </div>
                              <div className="text-gray-400 text-xs">
                                {new Date(reply.created_at).toDateString()}
                              </div>

                              {/* 3-Dot Menu for Reply */}
                              {reply.author_username === loggedInUsername && (
                                <div className="relative">
                                  <button
                                    onClick={() =>
                                      toggleDropdown("reply", reply.id)
                                    }
                                    className="text-black text-xl px-2"
                                  >
                                    &#8230;
                                  </button>
                                  {dropdownOpen.reply === reply.id && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                                      <ul>
                                        <li
                                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                          onClick={() => {
                                            setEditingReplyId(reply.id);
                                            setEditedReplyContent(
                                              reply.content
                                            );
                                            setDropdownOpen({
                                              comment: null,
                                              reply: null,
                                            }); // CLOSE dropdown after clicking Update
                                          }}
                                        >
                                          Update
                                        </li>
                                        <li
                                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                          onClick={() => {
                                            handleDeleteReply(reply.id);
                                            setDropdownOpen({
                                              comment: null,
                                              reply: null,
                                            }); // CLOSE dropdown after clicking Delete
                                          }}
                                        >
                                          Delete
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Reply Content / Edit Textarea */}
                            {editingReplyId === reply.id ? (
                              <>
                                <textarea
                                  className="w-full h-[80px] outline-none border border-gray-300 rounded-lg p-2 mt-2"
                                  value={editedReplyContent}
                                  onChange={(e) =>
                                    setEditedReplyContent(e.target.value)
                                  }
                                />
                                <div className="flex justify-end mt-2">
                                  <button
                                    onClick={() => handleUpdateReply(reply.id)}
                                    className="bg-[#0B3D20] rounded-4xl py-1 px-4 text-white"
                                  >
                                    Update Reply
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className="text-gray-700 mt-1 text-jusutify">
                                {reply.content}
                              </div>
                            )}
                          </div>

                          {/* Little curve (pseudo-like visual for rounded arrow look) */}
                          <div className="absolute -left-[14px] top-4 w-4 h-4 border-t-2 border-l-2 border-gray-300 rounded-tl-md"></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
