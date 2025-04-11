import React, { useState, useEffect } from "react";
import axios from "axios";
import MapLanding from "../components/MapLanding";
import ItineraryDownload from "../components/ItineraryDownload";
// import bgImage from "../assets/images/annapurna_trail.jpg";
import ReactMarkdown from "react-markdown";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const TripPlannerForm = () => {
  const [formData, setFormData] = useState({
    destination: "",
    start_date: "",
    end_date: "",
    num_travelers: "",
    budget: "",
    interests: "",
    accommodation_type: "budget",
    fitness_level: "intermediate",
    meal_pref: "no preference",
  });

  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);
    setItinerary(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/itinerary/generate/",
        formData
      );

      console.log("API Response:", response.data);

      if (
        response.data &&
        response.data.contents &&
        Array.isArray(response.data.contents) &&
        response.data.contents.length > 0 &&
        response.data.contents[0].parts &&
        Array.isArray(response.data.contents[0].parts) &&
        response.data.contents[0].parts.length > 0
      ) {
        const itineraryText = response.data.contents[0].parts[0].text;
        if (itineraryText && itineraryText.trim() !== "") {
          setItinerary(itineraryText);
          setError("");
        } else {
          setError("The AI returned an empty itinerary. Please try again.");
        }
      } else {
        setError("Invalid itinerary format received from the server.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch itinerary. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <Navbar />
      <MapLanding />

      {/* Background Image Section */}
      <div
        className="w-full min-h-screen flex justify-center items-start bg-[#e6f1ec] bg-center" // Keep items-start
        // style={{
        //   backgroundImage: `url(${bgImage})`,
        //   backgroundSize: "cover",
        //   backgroundAttachment: "fixed", // Keep background fixed
        // }}
      >
        {/* Form Container with Grey Background & Border */}
        <div className="container mx-auto p-8 bg-gray-50 shadow-lg rounded-lg max-w-3xl min-h-[400px] border border-gray-300 mt-20 self-start">
          {" "}
          {/* Keep mt-20, add self-start */}
          <h2 className="text-2xl font-bold mb-4 text-center text-[#0B3D20]">
            Plan Your Trip
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Destination */}
              <div className="md:col-span-2">
                <label className="block text-mm text-[#0B3D20] font-semibold mb-1 ">
                  Destination Name:
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-[#0B3D20] rounded-md outline-green-800 "
                />
              </div>

              {/* Travel Dates */}
              <div>
                <label className="block text-mm text-[#0B3D20] font-semibold mb-1">
                  Travel Date (From):
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date || ""}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 bg-white shadow-sm rounded-md focus:ring-2 focus:ring-[#0B3D20] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-mm text-[#0B3D20] font-semibold mb-1">
                  Travel Date (To):
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date || ""}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-[#0B3D20] focus:outline-none"
                />
              </div>

              {/* Budget & Travelers */}
              <div>
                <label className="block text-mm text-[#0B3D20] font-semibold mb-1">
                  Budget ($) (for overall trip):
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-[#0B3D20] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-mm text-[#0B3D20] font-semibold mb-1">
                  Number of Travelers:
                </label>
                <input
                  type="number"
                  name="num_travelers"
                  value={formData.num_travelers}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-[#0B3D20] focus:outline-none"
                />
              </div>

              {/* Interests */}
              <div className="md:col-span-2">
                <label className="block text-mm text-[#0B3D20] font-semibold mb-1">
                  Interest Tags (comma separated):
                </label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests || ""}
                  onChange={handleChange}
                  placeholder="e.g. hiking, photography, culture"
                  className="w-full p-3 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-[#0B3D20] focus:outline-none"
                />
              </div>

              {/* Accommodation Type */}
              <div className="md:col-span-2">
                <label className="block text-mm text-[#0B3D20] font-semibold mb-1">
                  Accommodation Type:
                </label>
                <div className="flex gap-6">
                  {["budget", "mid-range", "luxury"].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="accommodation_type"
                        value={option}
                        checked={formData.accommodation_type === option}
                        onChange={handleChange}
                      />
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Fitness Level */}
              <div className="md:col-span-2">
                <label className="block text-mm text-[#0B3D20] font-semibold mb-1">
                  Fitness Level:
                </label>
                <div className="flex gap-6">
                  {["beginner", "intermediate", "advanced"].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="fitness_level"
                        value={option}
                        checked={formData.fitness_level === option}
                        onChange={handleChange}
                      />
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Meal Preference */}
              <div className="md:col-span-2">
                <label className="block text-mm text-[#0B3D20] font-semibold mb-1">
                  Meal Preference:
                </label>
                <div className="flex gap-6">
                  {["veg", "non-veg", "no preference"].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="meal_pref"
                        value={option}
                        checked={formData.meal_pref === option}
                        onChange={handleChange}
                      />
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0B3D20] w-100 text-white px-6 py-3 rounded-md font-semibold hover:bg-[#295b42] disabled:opacity-50 transition duration-200"
              >
                Generate Itinerary
              </button>
            </div>
          </form>
          {loading && (
            <p className="text-center text-[#295b42] mt-4">
              Please wait Your Itinerary is being generated...
            </p>
          )}
          {/* Itinerary Output */}
          {itinerary && (
            <div className="itinerary-container mt-4">
              <h2 className="text-xl font-bold">Your Itinerary</h2>
              <div className="bg-white p-4 border rounded max-h-[500px] overflow-y-auto">
                <div className="space-y-6">
                  <ReactMarkdown>{itinerary}</ReactMarkdown>
                </div>
              </div>
              {/* Show Download Button Only When Itinerary is Available */}
              <ItineraryDownload itinerary={itinerary} />
            </div>
          )}
          {/* Error Message */}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TripPlannerForm;
