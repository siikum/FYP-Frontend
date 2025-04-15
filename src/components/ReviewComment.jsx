import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import { Star } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const ReviewComment = ({ destination, onReviewSubmitted }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem("authToken");
  const REVIEWS_PER_PAGE = 5;

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/machine_learning/get_sentiment_analysis/?destination=${destination}`
      );
      if (response.data?.sentiment_data) {
        setComments(response.data.sentiment_data.reverse());
        setCurrentPage(1); // reset to first page on new load
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
      setReview("");
      setRating(0);
      Swal.fire({
        icon: "success",
        title: "Review Posted!",
        text: "Thanks for sharing your thoughts with us.",
        confirmButtonColor: "#0B3D20",
      });

      setComments((prev) => [
        {
          username: localStorage.getItem("username") || "You",
          review,
          created_at: new Date().toISOString(),
          rating: rating,
        },
        ...prev,
      ]);

      onReviewSubmitted?.();
    } catch (err) {
      console.error("Error posting review:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to Post",
        text: "Something went wrong while posting your review.",
        confirmButtonColor: "#B91C1C",
      });
    }
  };

  useEffect(() => {
    fetchComments();
  }, [destination]);

  // Pagination logic
  const startIdx = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIdx = startIdx + REVIEWS_PER_PAGE;
  const paginatedComments = comments.slice(startIdx, endIdx);
  const totalPages = Math.ceil(comments.length / REVIEWS_PER_PAGE);

  return (
    <div className="pl-45 py-10">
      <div className="bg-gray-100 rounded-xl shadow-md p-10 w-full max-w-340">
        <div className="font-medium text-2xl mb-6">
          Already visited this place? Drop a review.
        </div>

        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

        {/* Review Box */}
        <div
          className={`rounded-2xl p-6 bg-gray-50 border border-gray-300 text-lg ${
            isFocused ? "border-blue-400 border-2" : ""
          }`}
        >
          {!isLoggedIn ? (
            <div
              className="w-full h-[100px] bg-white text-gray-400 border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition"
              onClick={() =>
                navigate("/LoginPage", { state: { from: location.pathname } })
              }
            >
              <span>
                <span className="text-[#295b42] font-medium underline">
                  Login
                </span>{" "}
                to post a review.
              </span>
            </div>
          ) : (
            <textarea
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setReview(e.target.value)}
              value={review}
              className="w-full h-[100px] outline-none rounded-lg p-3 border border-gray-300"
              placeholder="Write your review..."
            />
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={handlePostComment}
              className={`bg-[#0B3D20] hover:bg-green-900 rounded-md py-2 px-6 text-white ${
                !isLoggedIn ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isLoggedIn}
            >
              Post Review
            </button>
          </div>
        </div>

        {/* Render paginated comments */}
        <div className="flex flex-col gap-y-6 mt-10 min-h-[400px] transition-all duration-300">
          {paginatedComments.map((comment, i) => (
            <div key={i} className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-4">
                  <div className="font-medium text-lg">
                    {comment.username || "Anonymous"}
                  </div>
                  {comment.created_at && (
                    <div className="text-black text-sm">
                      {new Date(comment.created_at).toDateString()}
                    </div>
                  )}
                </div>

                {/* Display static star rating if present */}
                {comment.rating && (
                  <div className="flex gap-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        fill={star <= comment.rating ? "#facc15" : "none"}
                        stroke="#facc15"
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="text-base text-black">{comment.review}</div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-black">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewComment;
