import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  ZoomControl,
  Tooltip,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// import Navbar from "../components/Navbar";
import pinIconImg from "../assets/pin2.png";

// Create static custom pin icon
const customPinIcon = new L.Icon({
  iconUrl: pinIconImg,
  iconSize: [60, 44],  // width, height
  iconAnchor: [15, 40], // pointy tip
});

const pins = [
  { id: 1, lat: 30.1, lng: 81.9, url: "/destination/kailash-overland", name: "Kailash Overland" },
  { id: 2, lat: 28.4, lng: 84.9, url: "/destination/tsum-valley", name: "Tsum Valley" },
  { id: 3, lat: 29.4, lng: 82.0, url: "/destination/daphne-lagna-pass", name: "Daphne Lagna Pass" },
  { id: 4, lat: 28.8, lng: 83.9, url: "/destination/sekong-lake", name: "Sekong Lake" },
  { id: 5, lat: 28.0, lng: 85.3, url: "/destination/singla-mane", name: "Singla Mane" },
  { id: 6, lat: 27.2, lng: 87.0, url: "/destination/mundhum-trail", name: "Mundhum Trail" },
  { id: 7, lat: 27.7, lng: 86.7, url: "/destination/shiva-dhara", name: "Shiva Dhara" },
  { id: 8, lat: 29.2, lng: 82.9, url: "/destination/shey-phoksundo-lake", name: "Shey Phoksundo Lake" },
  { id: 9, lat: 29.9, lng: 80.9, url: "/destination/api-himal-base-camp", name: "Api Himal Base Camp" },
  { id: 10, lat: 30.0, lng: 81.5, url: "/destination/limi-valley", name: "Limi Valley" },
  { id: 11, lat: 27.6, lng: 87.9, url: "/destination/kbc", name: "Kanchenjunga Base Camp" },
  { id: 12, lat: 27.8, lng: 86.5, url: "/destination/tsho-rolpa", name: "Tsho Rolpa Glacier Lake" },
  { id: 13, lat: 27.2, lng: 85.2, url: "/destination/bara", name: "Mainali Farm House" },
  { id: 14, lat: 29.0, lng: 83.8, url: "/destination/lomanthang", name: "Lomanthang" },
  { id: 15, lat: 28.5, lng: 84.5, url: "/destination/meme-pokhari", name: "Meme Pokhari" },
  { id: 16, lat: 28.504, lng: 84.224, url: "/destination/krapu", name: "Krapu Kori" },
  { id: 17, lat: 28.687, lng: 84.016, url: "/destination/kajin-sara", name: "Kajin Sara" },
  { id: 18, lat: 29.95, lng: 81.25, url: "/destination/saipal-base-camp", name: "Saipal Base Camp" },
  { id: 19, lat: 28.5, lng: 81.45, url: "/destination/bardiya", name: "Bardiya National Park" },

];

// Set default zoom on load
const ZoomNepal = () => {
  const map = useMap();
  useEffect(() => {
    map.setZoom(7.4);
  }, [map]);
  return null;
};

const MapTestPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#e6f1ec] flex flex-col items-center font-raleway">
      {/* <Navbar /> */}

      {/* Heading */}
      <div className="text-center mt-25 mb-6 z-[999]">
        <h2 className="text-5xl font-bold text-[#0B3D20]">
          Discover Hidden <span className="text-amber-600">Nepal</span>
        </h2>
        <p className="text-xl text-gray-600 mt-2">
          Handpicked underrated treasures of Nepal. Click a pin to explore more.
        </p>
      </div>

      {/* Map Container */}
      <div className="w-[90%] max-w-[1400px] h-[75vh] shadow-lg rounded-xl overflow-hidden border border-gray-300">
        <MapContainer
          center={[28.4, 84.2]}
          zoom={7.4}
          zoomSnap={0.1}
          scrollWheelZoom={true}
          zoomControl={false}
          className="w-full h-full z-10 rounded-xl"
        >
          {/* Terrain Map */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles © Esri"
          />

          <ZoomControl position="topright" />
          <ZoomNepal />

          {/* Static Pins */}
          {pins.map((pin) => (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={customPinIcon}
              eventHandlers={{ click: () => navigate(pin.url) }}
            >
              <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
                {pin.name}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapTestPage;
