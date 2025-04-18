import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ItineraryDownload from "../components/ItineraryDownload";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReactMarkdown from "react-markdown";
import Swal from "sweetalert2";

const SavedItineraries = () => {
  const [savedItineraries, setSavedItineraries] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchSavedItineraries = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/itinerary/list/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setSavedItineraries(response.data);
      } catch (err) {
        console.error("Failed to fetch saved itineraries:", err);
      }
    };

    if (token) {
      fetchSavedItineraries();
    } else {
      navigate("/LoginPage");
    }
  }, [token, navigate]);

  const handleDeleteItinerary = async (itineraryId) => {
    const confirmed = await Swal.fire({
      title: "Delete Itinerary?",
      text: "Are you sure you want to delete this saved itinerary?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B91C1C",
      cancelButtonColor: "#295b42",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.delete(
          `http://127.0.0.1:8000/itinerary/delete/${itineraryId}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your itinerary has been deleted.",
          confirmButtonColor: "#0B3D20",
        });

        setSavedItineraries((prev) =>
          prev.filter((item) => item.id !== itineraryId)
        );
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete itinerary. Please try again.",
          confirmButtonColor: "#B91C1C",
        });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f3f8f6]">
      <Navbar />
      {/* Content */}
      <div className="flex-grow pt-32 px-6 md:px-20 pb-32">
        <div className="min-h-[60vh] flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0B3D20] mb-4">
            Your Saved Itineraries
          </h1>

          <Link
            to="/TripPlannerForm"
            className="text-sm text-gray-600 hover:text-black transition duration-200 mt-1 inline-block mb-8"
          >
            &lt; Back to Itinerary Planner
          </Link>

          {savedItineraries.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <h2 className="text-2xl font-bold text-[#0B3D20] mb-2">
                Plan Your First Adventure!
              </h2>
              <p className="text-gray-600 mb-6">
                Start planning your dream journey now. Let’s get you moving!
              </p>
              <Link
                to="/TripPlannerForm"
                className="bg-[#0B3D20] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#295b42] transition"
              >
                Plan a Trip
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedItineraries.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between mb-10"
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-[#0B3D20] mb-2">
                        {item.destination}
                      </h2>
                      <button
                        onClick={() => handleDeleteItinerary(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>

                    <p className="text-gray-700 mb-2">
                      <span className="font-semibold">Travel Dates:</span> {item.start_date} ➔ {item.end_date}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <span className="font-semibold">Budget:</span> ${item.budget}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <span className="font-semibold">Travelers:</span> {item.num_travelers}
                    </p>
                    <p className="text-gray-700 mb-4">
                      <span className="font-semibold">Interests:</span> {item.interests}
                    </p>

                    <div className="text-gray-600 text-sm max-h-32 overflow-y-auto p-2 bg-gray-50 rounded">
                      <ReactMarkdown>
                        {item.plan_details.slice(0, 300) + "....."}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <div className="mt-4">
                    <ItineraryDownload itinerary={item.plan_details} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SavedItineraries;
