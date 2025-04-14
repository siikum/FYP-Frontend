import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mapImage from "../assets/images/nepal - map.webp";
import bgImage from "../assets/images/map-bg-1.jpg";

const pins = [
  { id: 1, top: "25%", left: "19%", url: "/destination/kailash-overland", name: "kailash parbhat" },
  { id: 2, top: "62%", left: "60%", url: "/destination/tsum-valley", name: "tsum valley" },
  { id: 3, top: "35%", left: "26%", url: "/destination/daphne-lagna-pass", name: "Daphne Lagna Pass" },
  { id: 4, top: "50%", left: "45%", url: "/destination/sekong-lake", name: "Sekong Lake" },
  { id: 5, top: "58%", left: "70%", url: "/destination/singla-mane", name: "Singla Mane" },
  { id: 6, top: "72%", left: "80%", url: "/destination/mundhum-trail", name: "Khotang" },
  { id: 7, top: "55%", left: "77%", url: "/destination/shiva-dhara", name: "Shiva Dhara (Solukhumbu)" },
  { id: 8, top: "35%", left: "36%", url: "/destination/shey-phoksundo-lake", name: "Shey Phoksundo Lake" },
  { id: 9, top: "25%", left: "9%", url: "/destination/api", name: "api himal base camp" },
  { id: 10, top: "49%", left: "36%", url: "/destination/shey-phoksundo-lake", name: "limi valley" },

];

const MapLanding = () => {
  const navigate = useNavigate();

  const [activePins, setActivePins] = useState(getRandomPins(3, pins.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePins(getRandomPins(2, pins.length));
    }, 4000);
  
    return () => clearInterval(interval);
  }, []);
  
  function getRandomPins(count, total) {
    const selected = new Set();
    while (selected.size < count) {
      selected.add(Math.floor(Math.random() * total));
    }
    return [...selected];
  }
  

  return (
    <div
      className="min-h-screen bg-cover bg-center flex font-serif flex-col items-start justify-start px-10"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Text Positioned ABOVE the Map */}
      <div className="mt-36 ml-4 text-white z-30">
        <h2 className="text-5xl font-bold text-amber-50">
          Discover Hidden <span className="text-[#0B3D20]">Nepal</span>
        </h2>
        <p className="text-xl text-amber-50">
          Handpicked underrated treasures of Nepal. Click a pin to explore more.
        </p>
      </div>

      {/* Map - Shifted Down */}
      <div
        className="relative w-[600px] mt-15 ml-4"
        style={{ transform: "rotate(10deg)" }}
      >
        <img
          src={mapImage}
          alt="Nepal Map"
          className="w-full h-auto object-contain relative z-10"
        />
        {pins.map((pin, index) => (
        <div
          key={pin.id}
          onClick={() => navigate(pin.url)}
          title={pin.name}
          className="absolute z-20 cursor-pointer"
          style={{
            top: pin.top,
            left: pin.left,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span className="relative flex h-4 w-4">
            {activePins.includes(index) && (
              <span className="animate-ping   absolute inline-flex  h-5 w-5 rounded-full bg-amber-50 opacity-95" />
            )}
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-50 border-2 border-white shadow-md" />
          </span>
        </div>
      ))}

      </div>
    </div>
  );
};

export default MapLanding;
