import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RecommendedHotels = () => {
  const { destinationName } = useParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:8000/itinerary/hotels/${encodeURIComponent(destinationName)}/`
        );

        // Filter and limit to top 9 by rating (excluding 'N/A')
        const sortedHotels = response.data.hotels
          .filter(h => h.rating !== "N/A")
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 9);

        setHotels(sortedHotels);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
        setError("Failed to load accommodation options. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destinationName]);

  const getHotelImage = (index) => {
    const imgIndex = (index % 6) + 1; // rotate images 1-6
    return `/images/hotels/hotel${imgIndex}.jpg`;
  };

  return (
    <div className="w-full">
      <Navbar />

      <div className="bg-[#f3f8f6] py-20 mt-10 px-6 md:px-20 min-h-screen">
        <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#0B3D20] mb-10 text-center">
          Best Hotels in {destinationName}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-white rounded-lg border p-5 h-64 shadow-md"
              >
                <div className="bg-gray-300 h-32 w-full rounded-md mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
              >
                <img
                  src={getHotelImage(idx)}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-[#0B3D20] mb-2">
                    {hotel.name}
                  </h3>
                  <p className="text-gray-600 mb-1">Rating: {hotel.rating}</p>
                  <p className="text-gray-600 text-sm">{hotel.address}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      hotel.name + " " + hotel.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm text-white bg-[#0B3D20] hover:bg-[#295b42] font-semibold py-2 px-4 rounded"
                  >
                    View on Map
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RecommendedHotels;
