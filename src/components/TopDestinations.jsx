// components/TopDestinations.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TopDestinations = ({ excludeSlug, compactLayout = false }) => {
  const [destinations, setDestinations] = useState([]);
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

        // Filter out current destination by slug
        const filtered = res.data.filter((dest) => dest.slug !== excludeSlug);
        setDestinations(filtered);
      } catch (error) {
        console.error("Error fetching top destinations:", error);
      }
    };

    fetchDestinations();
  }, [excludeSlug]);

  return (
    <section
      className={`bg-[#f3f8f6] py-12 ${
        compactLayout ? "" : "px-4 sm:px-6 lg:px-16"
      }`}
    >
      <div
        className={`${
          compactLayout ? "max-w-358 ml-37 mx-auto px-4 sm:px-6 lg:px-8" : ""
        }`}
      >
        <h2 className="text-4xl sm:text-3xl font-bold text-[#0B3D20] mb-10">
          You might also like...
        </h2>

        {destinations.length === 0 ? (
          <p className="text-gray-500">No destinations to display right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest, index) => (
              <div
                key={index}
                onClick={() => navigate(`/destination/${dest.slug}`)}
                className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer group h-[320px]"
              >
                <img
                  src={dest.cover_image}
                  alt={dest.display_title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D20]/90 via-[#295b42]/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col justify-end p-6">
                  <h3 className="text-lg md:text-xl font-bold text-white font-serif mb-4">
                    {dest.display_title}
                  </h3>
                  <button
                    className="bg-white text-[#0B3D20] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#e5f3ec] transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/destination/${dest.slug}`);
                    }}
                  >
                    Explore More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopDestinations;
