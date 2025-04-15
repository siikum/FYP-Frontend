import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";


export default function ChannelList() {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch("http://localhost:8000/account/groupchats/", {
          headers: token ? { Authorization: `Token ${token}` } : {},
        });
        if (response.ok) {
          const data = await response.json();
          setChannels(data);
        } else {
          console.error("Failed to fetch channels");
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };

    fetchChannels();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#f3f8f6] font-serif">
      <Navbar isBlack={true} />
      <div className="flex flex-col items-center px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <h1 className="text-6xl font-extrabold text-[#0B3D20]">Community Channels</h1>
          <p className="text-xl text-[#295b42] mt-4 max-w-xl mx-auto">
            Connect with fellow explorers and share your journeys in our themed group chats.
          </p>
          {!token && (
            <p className="text-red-500 mt-3 font-medium">
              Please log in to join or access any group channels.
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {channels.map((channel, index) => (
            <motion.div
              key={channel.group_id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="rounded-2xl overflow-hidden shadow-lg border border-[#0B3D20] bg-white hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              <div
                onClick={() => {
                  if (!token || !channel.has_joined) return;
                  navigate(`/channels/${channel.group_id}`);
                }}
                className={`${token && channel.has_joined ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                <div className="h-[180px] overflow-hidden bg-[#f0ebe4]">
                  <img
                    src={`http://localhost:8000${channel.group_image}`}
                    alt={channel.group_name}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#0B3D20]">{channel.group_name}</h2>
                    <div className="flex items-center gap-x-2">
                      {channel.is_active ? (
                        <div className="relative">
                          <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute top-0 left-0"></div>
                          <div className="w-4 h-4 bg-red-500 rounded-full relative z-10"></div>
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-gray-500 gap-x-1">
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          <span>Not Active</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-mm text-gray-600 font-medium">
                    👥 {channel.member_count} member{channel.member_count !== 1 ? "s" : ""}
                  </p>

                  {/* Action Button */}
                  {token && channel.has_joined ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/channels/${channel.group_id}`);
                      }}
                      className="mt-2 bg-[#0B3D20] hover:bg-[#295b42] text-white font-semibold px-5 py-2 rounded-full"
                    >
                      Open
                    </button>
                  ) : token && channel.has_requested ? (
                    <button className="mt-2 bg-gray-400 text-white font-semibold px-5 py-2 rounded-full" disabled>
                      Requested
                    </button>
                  ) : token ? (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        const res = await fetch(
                          `http://localhost:8000/account/groupchats/${channel.group_id}/request/`,
                          {
                            method: "POST",
                            headers: {
                              Authorization: `Token ${token}`,
                            },
                          }
                        );
                        if (res.ok) {
                          Swal.fire({
                            icon: "success",
                            title: "Join Request Sent",
                            text: "Your request has been sent to the admin.",
                            confirmButtonColor: "#0B3D20",
                          }).then(() => window.location.reload());
                        } else {
                          Swal.fire({
                            icon: "error",
                            title: "Request Failed",
                            text: "Unable to send join request. Please try again.",
                            confirmButtonColor: "#B91C1C",
                          });
                        }
                        
                      }}
                      className="mt-2 bg-[#0B3D20] hover:bg-[#295b42] text-white font-semibold px-5 py-2 rounded-full"
                    >
                      Join
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
