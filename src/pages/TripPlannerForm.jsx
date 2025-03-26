import React, { useState } from "react";
import axios from "axios";
import MapLanding from "../components/MapLanding";
import ItineraryDownload from "../components/ItineraryDownload";
import bgImage from "../assets/images/annapurna_trail.jpg";
import ReactMarkdown from "react-markdown";

const TripPlannerForm = () => {
  const [formData, setFormData] = useState({
    destination: "",
    travel_dates: "",
    num_travelers: "",
    budget: "",
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
    setItinerary(null); // Clear previous itinerary on new request

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/itinerary/generate/",
        formData
      );

      // Log the response to check its structure
      console.log("API Response:", response.data);

      // Ensure the API response contains valid itinerary data
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
          setError(""); // Clear any previous errors
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
      <MapLanding />

      {/* Background Image Section */}
      <div
        className="w-full min-h-screen flex justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover" }}
      >
        {/* Form Container with Grey Background & Border */}
        <div className="container mx-auto p-8 bg-gray-100 shadow-lg rounded-lg max-w-200 min-h-[400px] border border-gray-300">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Plan Your Trip
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Destination & Travel Dates Side by Side */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block font-semibold">Destination:</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  className="w-80 p-3 border border-gray-300 rounded h-12"
                />
              </div>

              <div className="w-1/2">
                <label className="block font-semibold">Travel Dates:</label>
                <input
                  type="date"
                  name="travel_dates"
                  value={formData.travel_dates}
                  onChange={handleChange}
                  required
                  className="w-80 p-3 border border-gray-300 rounded h-12"
                />
              </div>
            </div>

            {/* Budget & Number of Travelers Side by Side */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block font-semibold">Budget ($):</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  className="w-80 p-3 border border-gray-300 rounded h-12"
                />
              </div>

              <div className="w-1/2">
                <label className="block font-semibold">
                  Number of Travelers:
                </label>
                <input
                  type="number"
                  name="num_travelers"
                  value={formData.num_travelers}
                  onChange={handleChange}
                  required
                  className="w-80 p-3 border border-gray-300 rounded h-12"
                />
              </div>
            </div>

            {/* Centered Generate Itinerary Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 w-70"
              >
                Generate Itinerary
              </button>
            </div>
          </form>

          {loading && (
            <p className="text-center text-gray-600 mt-4">Loading...</p>
          )}

          {/* Itinerary Output */}
          {itinerary && (
            <div className="itinerary-container mt-4">
              <h2 className="text-xl font-bold">Your Itinerary</h2>
              <div className="bg-white p-4 border rounded">
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
    </div>
  );
};

export default TripPlannerForm;
