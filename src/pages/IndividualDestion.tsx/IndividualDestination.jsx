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
import Footer from "../../components/Footer";
import TopDestinations from "../../components/TopDestinations";

const IndividualDestination = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState("");
  const [chartKey, setChartKey] = useState(0);

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

  const handleSentimentUpdate = () => {
    setChartKey((prev) => prev + 1);
  };

  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!destination) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f8f6]">
      <Navbar />

      <main className="flex-grow pb-[100px]">
        {/* COVER SECTION */}
        <div className="relative w-full h-screen">
          <img
            src={`${destination.cover_image}`}
            className="absolute inset-0 object-cover w-full h-full z-0"
            alt="Destination Cover"
          />
          <div className="absolute inset-0 bg-black/30 z-10" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute bottom-12 left-12 z-20 text-white space-y-5"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-black/40 px-6 py-3 rounded-lg shadow">
              {destination.display_title}
            </h1>
            <button
              onClick={handleRedirect}
              className="bg-[#0B3D20] hover:bg-[#18432f] transition text-white font-semibold py-2 px-6 rounded-md shadow"
            >
              Generate Itinerary
            </button>
          </motion.div>
        </div>

        {/* ALTITUDE - GRADE - DURATION */}
        <div className="px-[20%] flex w-full justify-between py-[70px] backdrop-blur-lg">
          <div className="flex flex-col gap-y-2 items-center">
            <div className="text-6xl font-bold flex items-center gap-x-2">
              <Counter initialValue={0} finalValue={destination.altitude} duration={2} />
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
              <Counter initialValue={0} finalValue={destination.duration} duration={2} />
              <Timer className="w-[50px] h-[50px]" />
            </div>
            <div className="text-2xl font-medium">Duration (Days)</div>
          </div>
        </div>

        {/* ABOUT SECTION */}
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

        {/* FORECAST */}
        <DailyForecast destination={destination?.location.replace(/\s+/g, "")} />

        {/* SENTIMENT CHART */}
        <DestinationSentiment destination={destination?.name} key={chartKey} />

        {/* REVIEW SECTION */}
        <ReviewComment
          destination={destination?.name}
          onReviewSubmitted={handleSentimentUpdate}
        />

        {/* RECOMMENDATIONS */}
        <TopDestinations excludeSlug={slug} compactLayout />
      </main>

      <Footer />
    </div>
  );
};

export default IndividualDestination;
