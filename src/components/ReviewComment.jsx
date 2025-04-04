import { useState } from "react";
import axiosInstance from "../api/axiosConfig";

const ReviewComment = ({ destination }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [review, setReview] = useState("");

  const handlePostComment = async () => {
    console.log("button");
    const response = await axiosInstance.post(
      "/machine_learning/sentiment_analysis/",
      {
        review,
        destination,
      }
    );
    console.log(response.data);
    setReview("");
  };

  return (
    <div className="flex flex-col mt-10 gap-y-10 px-[20%]">
      <div className="font-medium text-2xl">Comments</div>

      {/* Create new comment */}
      <div
        className={`rounded-2xl p-6 bg-white border border-gray-300 text-lg ${
          isFocused ? "border-2" : ""
        }`}
      >
        <textarea
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setReview(e.target.value)}
          className="w-full h-[100px] outline-none  rounded-lg p-3"
          placeholder="Write your comment..."
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handlePostComment}
            className="bg-orange-500 rounded-4xl py-2 px-6 text-white"
          >
            Post
          </button>
        </div>
      </div>

      {/* Static sample comment (purely design) */}
      <div className="flex flex-col gap-y-6">
        <div className="flex items-start gap-x-6">
          <div className="w-[60px] h-[60px] overflow-hidden rounded-full">
            <img
              src={""}
              className="w-full h-full object-cover rounded-full"
              alt="User Profile"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="font-medium text-lg">John Doe</div>
            <div className="text-gray-500 text-sm">April 4, 2025</div>
            <div className="text-base text-gray-700">
              This is a beautiful place! I had the best time trekking here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewComment;
