import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";

export default function ChannelMessage() {
  const { id: channelId } = useParams();
  const navigate = useNavigate();
  const currentUsername = localStorage.getItem("username");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [myChannels, setMyChannels] = useState([]);

  // Fetch user channels (for sidebar)
  useEffect(() => {
    const fetchMyChannels = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/account/groupchats/my-channels/",
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setMyChannels(data);
        } else {
          console.error("Failed to fetch user channels");
        }
      } catch (error) {
        console.error("Error fetching user channels:", error);
      }
    };

    fetchMyChannels();
  }, []);

  // Fetch messages for this channel
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/account/groupchats/${channelId}/messages/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [channelId]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:8000/account/groupchats/${channelId}/messages/send/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ content: newMessage }),
        }
      );

      if (response.ok) {
        const timestamp = new Date().toISOString();
        setMessages((prev) => [
          ...prev,
          {
            sender_username: currentUsername,
            content: newMessage,
            timestamp,
          },
        ]);
        setNewMessage("");
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/account/groupchats/${channelId}/is-member/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );
  
        const data = await res.json();
  
        if (!data.is_member) {
          alert("❌ You are not a member of this group. Request access first.");
          navigate("/channels");
        }
      } catch (err) {
        console.error("Access check failed:", err);
      }
    };
  
    checkAccess();
  }, [channelId]);
  

  return (
    <div className="min-h-screen bg-amber-50 font-serif">
      <Navbar isBlack={true} />
      <div className="flex justify-center pt-28 px-6">
        <div className="w-full max-w-6xl flex gap-6">
          {/* Sidebar */}
          <aside className="w-[30%] bg-[rgb(244,231,231)] px-6 py-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-[#0B3D20] mb-8">
              My Channels
            </h2>
            <ul className="space-y-4">
              {myChannels.length > 0 ? (
                myChannels.map((channel) => (
                  <li
                    key={channel.group_id}
                    onClick={() => navigate(`/channels/${channel.group_id}`)}
                    className={`cursor-pointer text-lg ${
                      channel.group_id.toString() === channelId
                        ? "text-[#0B3D20] font-semibold"
                        : "text-[#295b42]"
                    } hover:text-[#0B3D20] transition`}
                  >
                    {channel.group_name}
                  </li>
                ))
              ) : (
                <li className="text-[#999] text-sm">No joined channels.</li>
              )}
            </ul>
          </aside>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col justify-between bg-white rounded-3xl px-8 py-6 shadow-sm">
            {/* Chat Header */}
            <div className="pb-6 border-b border-[#e0e0e0]">
              <h2 className="text-3xl font-bold text-[#0B3D20]">
                Channel #{channelId}
              </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mt-6 mb-4 pr-2 space-y-6">
              {messages.map((msg, i) => {
                const isSender = msg.sender_username === currentUsername;

                return (
                  <div
                    key={i}
                    className={`max-w-[75%] text-base leading-relaxed ${
                      isSender ? "ml-auto text-right" : "mr-auto text-left"
                    }`}
                  >
                    <div
                      className={`inline-block px-6 py-3 rounded-2xl ${
                        isSender
                          ? "bg-[#d0f0c0] text-[#0B3D20]"
                          : "bg-[#f5f5f5] text-[#0B3D20]"
                      }`}
                    >
                      {!isSender && (
                        <p className="font-semibold mb-1">
                          {msg.sender_username}
                        </p>
                      )}
                      <p>{msg.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B3D20] bg-[#fafafa]"
              />
              <button
                onClick={handleSend}
                className="px-6 py-3 rounded-full bg-[#0B3D20] text-white font-semibold hover:bg-[#295b42] transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
