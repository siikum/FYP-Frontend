import { useState } from "react";
import { Star } from "lucide-react"; // Install this with 'npm install lucide-react'

const ReviewCard = () => {
  const [review, setReview] = useState("");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const handleRating = (star) => {
    setRating(star);
  };

  const handleSubmit = () => {
    if (!name || !review || rating === 0) {
      alert("Please fill in all fields and select a rating.");
      return;
    }

    const newReview = {
      name,
      review,
      rating,
    };

    setReviews([newReview, ...reviews]); // Add new review to the list
    setName(""); // Reset name
    setReview(""); // Reset review
    setRating(0); // Reset rating
  };

  return (
<div className="flex justify-center items-start space-x-8 p-6 border bg-[rgba(211,211,211,0.3)] backdrop-blur-lg border-gray-300 rounded-lg shadow-lg">
{/* Left side: Write a review form */}
      <div className="w-80 p-6 shadow-lg rounded-lg bg-white">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Visited Already? Leave a Review
        </h2>

        <input
          type="text"
          className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 mb-2"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 mb-2"
          placeholder="Write your review..."
          rows="3"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>

        {/* Star Rating */}
        <div className="flex space-x-1 mb-2 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`cursor-pointer w-5 h-5 ${
                star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
              }`}
              onClick={() => handleRating(star)}
            />
          ))}
        </div>

        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
          onClick={handleSubmit}
        >
          Submit Review
        </button>
      </div>

      {/* Right side: Display Reviews */}
      <div className="w-80 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Reviews</h2>
        {reviews.map((rev, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow-md bg-gray-100"
          >
            <h3 className="font-semibold">{rev.name}</h3>
            <div className="flex space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= rev.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                  }`}
                />
              ))}
            </div>
            <p>{rev.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewCard;
