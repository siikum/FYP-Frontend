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

        const geoapifyApiKey = "00d5018e7913439aade1f3b68348cb99"; // 🛑 Only Geoapify now

        // Step 1: Geocode destination name into lat/lon
        const geocodeResponse = await axios.get(
          `https://api.geoapify.com/v1/geocode/search`,
          {
            params: {
              text: destinationName, // 👈 direct destination name
              apiKey: geoapifyApiKey,
            },
          }
        );

        const geocodeResult = geocodeResponse.data.features[0];
        if (!geocodeResult) {
          throw new Error("No location found for this destination.");
        }

        const lat = geocodeResult.geometry.coordinates[1];
        const lon = geocodeResult.geometry.coordinates[0];

        const placesResponse = await axios.get(
          `https://api.geoapify.com/v2/places`,
          {
            params: {
              categories:
                "accommodation.hotel,accommodation.guest_house,accommodation.hostel,accommodation.hut",
              filter: `circle:${lon},${lat},10000`,
              limit: 9,
              apiKey: geoapifyApiKey,
            },
          }
        );

        const places = placesResponse.data.features;

        const formattedHotels = places.map((place) => ({
          name: place.properties.name || "Unnamed Lodge",
          category: place.properties.categories?.[0] || "Accommodation",
          lat: place.geometry.coordinates[1],
          lon: place.geometry.coordinates[0],
          address:
            place.properties.address_line1 ||
            place.properties.formatted ||
            "Address Not Available",
        }));

        setHotels(formattedHotels);
      } catch (err) {
        console.error("Failed to fetch places:", err);
        setError(
          "Failed to load accommodation options. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destinationName]);

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
                  src={`/images/hotels/hotel${idx + 1}.jpg`}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-[#0B3D20] mb-2">
                    {hotel.name}
                  </h3>
                  <p className="text-gray-600 mb-1">{hotel.category}</p>
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
