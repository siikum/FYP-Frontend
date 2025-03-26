import { useState } from "react";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";

const BlogPost = () => {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleComment = () => {
    if (newComment.trim() !== "") {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 mb-6">
      {/* User Info */}
      <div className="flex items-center space-x-3">
        <img
          src="https://i.pravatar.cc/40" // Working placeholder image
          alt="User Profile"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">John Doe</p>
          <p className="text-gray-500 text-sm">2 hours ago</p>
        </div>
      </div>

      {/* Blog Content */}
      <p className="mt-4 text-gray-800">
        Just visited this amazing place! The scenery was breathtaking. 🌿🌄
      </p>

      {/* Blog Image */}
      <div className="mt-4">
        <img
          src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&h=400&fit=crop"
          alt="Blog Post"
          className="w-full h-60 object-cover rounded-lg"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-4 text-gray-600">
        <button onClick={handleLike} className="flex items-center space-x-2 hover:text-blue-500">
          <FaThumbsUp />
          <span>{likes} Likes</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-blue-500">
          <FaComment />
          <span>{comments.length} Comments</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-blue-500">
          <FaShare />
          <span>Share</span>
        </button>
      </div>

      {/* Comment Section */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
        />
        <button
          onClick={handleComment}
          className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Comment
        </button>
      </div>

      {/* Display Comments */}
      <div className="mt-4">
        {comments.map((comment, index) => (
          <div key={index} className="p-2 border-b text-gray-700">
            <strong>Anonymous:</strong> {comment}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPost;
