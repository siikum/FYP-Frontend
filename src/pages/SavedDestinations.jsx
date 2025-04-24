import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Swal from "sweetalert2";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const SavedDestinations = () => {
  const [savedDestinations, setSavedDestinations] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchSavedDestinations = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/account/saved-destinations/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setSavedDestinations(response.data);
      } catch (error) {
        console.error("Error fetching saved destinations:", error);
      }
    };

    if (token) {
      fetchSavedDestinations();
    } else {
      navigate("/LoginPage");
    }
  }, [token, navigate]);

  const handleDeleteDestination = async (destinationId) => {
    const confirmed = await Swal.fire({
      title: "Delete Saved Destination?",
      text: "Are you sure you want to remove this destination from your saved list?",
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
          `${API_BASE_URL}/account/delete-saved-destination/${destinationId}/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Destination has been removed.",
          confirmButtonColor: "#0B3D20",
        });

        // Update frontend
        setSavedDestinations((prev) =>
          prev.filter((dest) => dest.id !== destinationId)
        );
      } catch (error) {
        console.error("Error deleting destination:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete. Please try again.",
          confirmButtonColor: "#B91C1C",
        });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f3f8f6]">
      <Navbar />

      <div className="flex-grow pt-32 mb-15 px-6 md:px-20">
        <h1 className="text-4xl md:text-4xl font-bold text-[#0B3D20] mb-10">
          Your Saved Destinations
        </h1>

        {savedDestinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <h2 className="text-2xl font-bold text-[#0B3D20] mb-2">
              No Saved Destinations Yet
            </h2>
            <p className="text-gray-600">
              Start saving your favorite destinations to access them easily!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedDestinations.map((item) => (
              <div
                key={item.id}
                className="relative group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
              >
                <img
                  src={`${API_BASE_URL}${item.cover_image}`}
                  alt={item.name}
                  onClick={() => navigate(`/destination/${item.slug}`)}
                  className="rounded-t-md w-full h-60 object-cover"
                />

                <div
                  onClick={() => navigate(`/destination/${item.slug}`)}
                  className="p-5"
                >
                  <h2 className="text-xl font-bold text-[#0B3D20] mb-1">
                    {item.name}
                  </h2>
                  <p className="text-gray-600">{item.location}</p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card navigation when clicking delete
                    handleDeleteDestination(item.id);
                  }}
                  className="absolute top-3 right-3 bg-[#B91C1C] text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SavedDestinations;
