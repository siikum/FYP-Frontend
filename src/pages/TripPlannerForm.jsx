import React, { useState } from "react";
import axios from "axios";
import MapLanding from "../components/MapLanding";
import ItineraryDownload from "../components/ItineraryDownload";
import ReactMarkdown from "react-markdown";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

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

  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("authToken");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);
    setItinerary(null);

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    // Validation 1: Start date must not be after End date
    if (startDate > endDate) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Invalid Dates!",
        text: "Travel Date (From) cannot be after Travel Date (To).",
        confirmButtonColor: "#B91C1C",
      });
      return;
    }

    // Validation 2: Start date and End date must not be the same
    if (startDate.toDateString() === endDate.toDateString()) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Invalid Dates!",
        text: "Travel Date (From) and Travel Date (To) cannot be the same. Trip must be at least 1 day!",
        confirmButtonColor: "#B91C1C",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/itinerary/generate/",
        formData
      );

      const text = response?.data?.contents?.[0]?.parts?.[0]?.text;
      if (text && text.trim()) {
        setItinerary(text);
        setError("");
      } else {
        setError("The AI returned an empty itinerary. Please try again.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch itinerary. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItinerary = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Please login first!",
        confirmButtonColor: "#B91C1C",
      });
      return;
    }
  
    try {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId"); // ⚠️ Make sure you have userId stored after login
  
      if (!userId) {
        Swal.fire({
          icon: "error",
          title: "User ID missing!",
          text: "Please re-login.",
          confirmButtonColor: "#B91C1C",
        });
        return;
      }
  
      const payload = {
        user_id: userId,
        destination: formData.destination,
        start_date: formData.start_date,
        end_date: formData.end_date,
        num_travelers: formData.num_travelers,
        budget: formData.budget,
        interests: formData.interests,
        accommodation_type: formData.accommodation_type,
        fitness_level: formData.fitness_level,
        meal_pref: formData.meal_pref,
        plan_details: itinerary,
      };
  
      await axios.post("http://127.0.0.1:8000/itinerary/save/", payload, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
  
      Swal.fire({
        icon: "success",
        title: "Itinerary Saved!",
        text: "Your itinerary has been saved successfully.",
        confirmButtonColor: "#0B3D20",
      }).then(() => {
        navigate("/SavedItineraries");
      });
  
    } catch (error) {
      console.error("Failed to save itinerary:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Save!",
        text: "Something went wrong. Try again.",
        confirmButtonColor: "#B91C1C",
      });
    }
  };
  
  return (
    <div className="w-full">
      <Navbar />
      <MapLanding />

      <div className="bg-[#f3f8f6] py-20 px-6 md:px-20">
        <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#f3f8f6] p-10">
          {/* Left Side */}
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#0B3D20] mb-6">
              Plan Your Trip
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Want a personalized itinerary just for you? Enter your travel
              preferences and get a custom travel plan generated using AI.
              Whether you're hiking solo or traveling with friends, this feature
              helps you plan smarter and more sustainably. 🌿
            </p>

            <p className="text-sm text-gray-600">
              <span className="text-red-500">*</span> All fields are required.
              Only logged-in users can use this feature.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold mb-1 text-[#0B3D20]">
                  Destination Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-[#0B3D20]">
                    Travel Date (From) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#0B3D20]">
                    Travel Date (To) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    min={new Date().toISOString().split("T")[0]} // ✅ prevents past dates
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-[#0B3D20]">
                    Budget for entire trip ($){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#0B3D20]">
                    No. of Travelers <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="num_travelers"
                    value={formData.num_travelers}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#0B3D20]">
                  Interests (comma separated){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#0B3D20]">
                  Accommodation Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  {["budget", "mid-range", "luxury"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="accommodation_type"
                        value={opt}
                        checked={formData.accommodation_type === opt}
                        onChange={handleChange}
                        className="accent-[#0B3D20]" // ← this changes the selected dot color
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#0B3D20]">
                  Fitness Level <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  {["beginner", "intermediate", "advanced"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="fitness_level"
                        value={opt}
                        checked={formData.fitness_level === opt}
                        onChange={handleChange}
                        className="accent-[#0B3D20]"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#0B3D20]">
                  Meal Preference <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  {["veg", "non-veg", "no preference"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="meal_pref"
                        value={opt}
                        checked={formData.meal_pref === opt}
                        onChange={handleChange}
                        className="accent-[#0B3D20]"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* Button & Login Prompt */}
              <div className="flex flex-col items-center gap-2">
                {!isLoggedIn && (
                  <p className="text-center text-md text-red-600 font-semibold  p-3 rounded-md mb-4">
                    Please{" "}
                    <span
                      className="text-green-800 underline cursor-pointer"
                      onClick={() =>
                        navigate("/LoginPage", {
                          state: { from: location.pathname },
                        })
                      }
                    >
                      login
                    </span>{" "}
                    to use this feature.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={!isLoggedIn || loading}
                  className={`w-full py-3 rounded-md font-semibold transition ${
                    isLoggedIn
                      ? "bg-[#0B3D20] text-white hover:bg-[#295b42]"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Generate Itinerary
                </button>
              </div>
            </form>

            {loading && (
              <p className="text-center mt-4 text-[#0B3D20]">
                Please Wait. Your Itinerary is being generated...
              </p>
            )}

            {itinerary && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Your Itinerary</h3>
                <div className="p-4 border rounded-md bg-gray-50 max-h-[300px] overflow-y-auto">
                  <ReactMarkdown>{itinerary}</ReactMarkdown>
                </div>

                {/* Save Itinerary Button */}
                <button
                  onClick={handleSaveItinerary}
                  className="mt-4 bg-[#0B3D20] text-white py-2 px-6 rounded-md hover:bg-[#295b42] font-semibold"
                >
                  Save Itinerary
                </button>
              </div>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TripPlannerForm;
