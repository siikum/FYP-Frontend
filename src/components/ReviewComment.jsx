import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import { Star } from "lucide-react";

const ReviewComment = ({ destination, onReviewSubmitted }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0); // ⭐ star rating state
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  const isLoggedIn = !!localStorage.getItem("authToken");

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/machine_learning/get_sentiment_analysis/?destination=${destination}`
      );
      if (response.data?.sentiment_data) {
        setComments(response.data.sentiment_data.reverse());
      }
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  const handlePostComment = async () => {
    setError("");

    if (!isLoggedIn) {
      setError("You must be logged in to post a comment.");
      return;
    }

    if (!review.trim()) {
      setError("Review cannot be empty.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/machine_learning/sentiment_analysis/",
        { review, destination },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );

      console.log("Posted review:", response.data);
      setReview("");
      setRating(0); // reset rating

      onReviewSubmitted?.();
      fetchComments();
    } catch (err) {
      console.error("Error posting review:", err);
      setError("Failed to post comment. Please try again.");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [destination]);

  return (
    <div className="flex flex-col mt-10 gap-y-10 px-[20%]">
      <div className="font-medium text-2xl">Already visited this place? Drop a review.</div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Create new comment */}
      <div
        className={`rounded-2xl p-6 bg-white border border-gray-300 text-lg ${
          isFocused ? "border-2 border-blue-400" : ""
        }`}
      >
        {/* ⭐ Interactive Stars */}
        <div className="flex gap-x-1 mb-3 cursor-pointer">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={22}
              fill={star <= rating ? "#facc15" : "none"}
              stroke="#facc15"
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <textarea
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setReview(e.target.value)}
          value={review}
          className="w-full h-[100px] outline-none rounded-lg p-3"
          placeholder={
            isLoggedIn ? "Write your review..." : "Login to post a review"
          }
          disabled={!isLoggedIn}
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handlePostComment}
            className={`bg-orange-500 rounded-4xl py-2 px-6 text-white ${
              !isLoggedIn ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isLoggedIn}
          >
            Post
          </button>
        </div>
      </div>

      {/* Render comments */}
      <div className="flex flex-col gap-y-6">
        {comments.map((comment, i) => (
          <div key={i} className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-4">
              <div className="font-medium text-lg">
                {comment.username || "Anonymous"}
              </div>
              {comment.created_at && (
                <div className="text-gray-500 text-sm">
                  {new Date(comment.created_at).toDateString()}
                </div>
              )}
            </div>
            <div className="text-base text-gray-700">{comment.review}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewComment;
