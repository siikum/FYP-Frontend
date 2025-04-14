import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Users } from "lucide-react";

const API = "http://localhost:8000";

const MyChannels = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChannels = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/account/groupchats/my-channels/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });
      setChannels(res.data);
    } catch (err) {
      console.error("Failed to fetch channels", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f8f6] font-serif">
      <Navbar isBlack={true} />
      <div className="flex flex-col items-center px-6 py-28">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold text-[#0B3D20]">My Channels</h1>
          <p className="text-xl text-[#295b42] mt-4 max-w-xl mx-auto">
            Welcome Back — reconnect, discuss, and explore together!
          </p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : channels.length === 0 ? (
          <p className="text-gray-500">You haven't joined any channels yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
            {channels.map((channel, index) => (
              <div
                key={channel.group_id}
                onClick={() => navigate(`/channels/${channel.group_id}`)}
                className="rounded-2xl overflow-hidden shadow-lg border border-[#0B3D20] bg-white hover:shadow-2xl transform hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="h-[180px] overflow-hidden bg-[#f0ebe4]">
                  {channel.group_image ? (
                    <img
                      src={`${API}${channel.group_image}`}
                      alt={channel.group_name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-2">
                  <h2 className="text-xl font-bold text-[#0B3D20]">{channel.group_name}</h2>
                  <p className="text-mm text-gray-600 font-medium flex items-center gap-2">
                    <Users size={16} /> {channel.member_count} member{channel.member_count !== 1 ? "s" : ""}
                  </p>
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

export default MyChannels;
