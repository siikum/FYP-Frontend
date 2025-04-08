// components/TopDestinations.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TopDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const isAuthenticated = !!localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/machine_learning/top-destinations/",
          {
            headers: {
              Authorization: localStorage.getItem("authToken")
                ? `Token ${localStorage.getItem("authToken")}`
                : undefined,
            },
          }
        );
        setDestinations(res.data);
      } catch (error) {
        console.error("Error fetching top destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-16 bg-amber-50">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#0B3D20] mb-8">
        {isAuthenticated
          ? "Top 5 Best Destinations From Users’ Choice"
          : "Top Destinations"}
      </h2>

      {destinations.length === 0 ? (
        <p className="text-gray-500">No destinations to display right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.destination_id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer overflow-hidden group"
              onClick={() => navigate(`/destination/${dest.slug}`)}
              >
              <img
                src={dest.cover_image}
                alt={dest.display_title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3">
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                  {dest.display_title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TopDestinations;
