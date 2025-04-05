import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPinned, Mountain, Timer } from "lucide-react";
import { motion } from "framer-motion";
import Counter from "../../components/Counter";
import Navbar from "../../components/Navbar";
import axios from "axios";
import DailyForecast from "../../components/DailyForecast";
import DestinationSentiment from "../../components/DestinationSentiment";
import ReviewComment from "../../components/ReviewComment";

const IndividualDestination = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState("");
  const [chartKey, setChartKey] = useState(0); // NEW: chart refresh trigger

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/account/destinations/${slug}/`)
      .then((res) => {
        setDestination(res.data);
      })
      .catch((err) => {
        setError("Failed to load destination.");
        console.error(err);
      });
  }, [slug]);

  const handleRedirect = () => {
    navigate("/TripPlannerForm");
  };

  // NEW: function to refresh sentiment chart
  const handleSentimentUpdate = () => {
    setChartKey((prev) => prev + 1);
  };

  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!destination) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="flex flex-col pb-[100px]">
      <Navbar />

      {/* Cover Image + Title */}
      <div className="w-full h-full flex flex-col items-center relative">
        <img
          src={`${destination.cover_image}`}
          className="w-full h-full object-cover max-h-screen"
          alt="Destination Cover"
        />
        <div className="flex w-full max-h-screen justify-between absolute">
          <div className="flex w-fit min-h-screen items-end">
            <div className="py-8 pb-20 flex flex-col gap-y-4 z-[3] rounded-xl mx-5 mt-5">
              <motion.div
                initial={{ visibility: "hidden", x: -400 }}
                viewport={{ once: true }}
                whileInView={{ visibility: "visible", x: 0 }}
                transition={{ duration: 1.75, ease: "easeInOut" }}
                className="text-6xl text-black font-bold bg-white/20 px-4 py-2 shadow-lg backdrop-blur-sm"
              >
                {destination.display_title}
              </motion.div>
            </div>
          </div>

          <div className="flex w-[45%] min-h-screen items-end justify-end text-justify">
            <div className="p-8 flex flex-col gap-y-4 z-[3] rounded-xl mx-5 mt-5">
              <button
                onClick={handleRedirect}
                className="bg-blue-500 text-white py-2 px-4 rounded mb-5"
              >
                Generate Itinerary
              </button>
            </div>
          </div>
        </div>

        {/* Altitude, Grade, Duration */}
        <div className="px-[20%] flex w-full justify-between py-[70px] backdrop-blur-lg ">
          <div className="flex flex-col gap-y-2 items-center">
            <div className="text-6xl font-bold flex items-center gap-x-2">
              <Counter
                initialValue={0}
                finalValue={destination.altitude}
                duration={2}
              />
              <Mountain className="w-[50px] h-[50px]" />
            </div>
            <div className="text-2xl font-medium">Altitude</div>
          </div>

          <div className="flex flex-col gap-y-2 items-center">
            <div className="text-6xl font-bold flex items-center gap-x-2">
              {destination.grade}
              <MapPinned className="w-[50px] h-[50px]" />
            </div>
            <div className="text-2xl font-medium">Grade</div>
          </div>

          <div className="flex flex-col gap-y-2 items-center">
            <div className="text-6xl font-bold flex items-center gap-x-2">
              <Counter
                initialValue={0}
                finalValue={destination.duration}
                duration={2}
              />
              <Timer className="w-[50px] h-[50px]" />
            </div>
            <div className="text-2xl font-medium">Duration</div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.75, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10 mb-20"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          About {destination.display_title}
        </h2>

        {/* Row 1: Text - Image */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <p className="text-lg text-gray-600 leading-relaxed md:w-1/2 text-justify">
            {destination.about}
          </p>
          <img
            src={`${destination.about_image_1}`}
            className="w-full md:w-[580px] rounded-xl shadow-md"
            alt="About Image 1"
          />
        </div>

        {/* Row 2: Image - Text */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-6">
          <p className="text-lg text-gray-600 leading-relaxed md:w-1/2 text-justify">
            {destination.about}
          </p>
          <img
            src={`${destination.about_image_2}`}
            className="w-full md:w-[580px] h-[300px] md:h-[400px] rounded-xl shadow-md"
            alt="About Image 2"
          />
        </div>
      </motion.div>

      <DailyForecast destination={destination?.location.replace(/\s+/g, "")} />
      
      <DestinationSentiment
        destination={destination?.name}
        key={chartKey} // triggers chart re-fetch on update
      />
      
      <ReviewComment
        destination={destination?.name}
        onReviewSubmitted={handleSentimentUpdate} // 🔁 refresh chart after review
      />
    </div>
  );
};

export default IndividualDestination;
