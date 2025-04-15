import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const API = "http://localhost:8000";

export default function ChannelMessage() {
  const { id: channelId } = useParams();
  const navigate = useNavigate();
  const currentUsername = localStorage.getItem("username");
  const token = localStorage.getItem("authToken");

  const [messages, setMessages] = useState([]);
  const [myChannels, setMyChannels] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);

  const scrollRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API}/account/groupchats/${channelId}/messages/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        console.error("Failed to fetch messages");
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const fetchChannels = async () => {
    const res = await fetch(`${API}/account/groupchats/my-channels/`, {
      headers: { Authorization: `Token ${token}` },
    });
    const data = await res.json();
    setMyChannels(data);
  };

  useEffect(() => {
    if (!token) {
      alert("❌ Please log in to view this channel.");
      return navigate("/channels");
    }
    fetchChannels();
    fetchMessages();
  }, [channelId]);

  const handleSend = async () => {
    if (!newMessage.trim() && !file) return;

    const formData = new FormData();
    formData.append("content", newMessage);
    if (file) {
      formData.append("attachment", file);
      formData.append("message_type", file.type.startsWith("image") ? "image" : file.type.startsWith("video") ? "video" : "file");
    } else {
      formData.append("message_type", "text");
    }

    const res = await fetch(`${API}/account/groupchats/${channelId}/messages/send/`, {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      body: formData,
    });

    if (res.ok) {
      setNewMessage("");
      setFile(null);
      fetchMessages();
    }
  };

  const handleDelete = async (msgId) => {
    if (!window.confirm("Delete this message?")) return;
    await fetch(`${API}/account/messages/${msgId}/delete/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    });
    fetchMessages();
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-[#f3f8f6] font-serif">
      <Navbar isBlack={true} />
      <div className="flex flex-1 px-4 pt-20">
        {/* Sidebar */}
        <aside className="w-[25%] hidden md:block bg-white rounded-md p-6 shadow overflow-y-auto">
          <h2 className="text-xl font-bold text-[#0B3D20] mb-4">My Channels</h2>
          <ul className="space-y-3">
            {myChannels.map((ch) => (
              <li
                key={ch.group_id}
                onClick={() => navigate(`/channels/${ch.group_id}`)}
                className={`cursor-pointer text-sm ${ch.group_id == channelId ? "text-[#0B3D20] font-semibold" : "text-gray-600"}`}
              >
                # {ch.group_name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-md p-6 shadow flex flex-col sticky max-h-full">
          <div className="border-b pb-4 mb-4">
            <h1 className="text-2xl font-bold text-[#0B3D20]">Channel #{channelId}</h1>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 text-sm mt-10">No messages yet.</div>
            ) : (
              messages.map((msg) => {
                const isSender = msg.sender_username === currentUsername;
                return (
                  <div
                    key={msg.message_id}
                    className={`relative p-3 rounded-md max-w-full break-words ${
                      isSender ? "ml-auto bg-[#d0f0c0] text-[#0B3D20]" : "mr-auto bg-[#f1f5f9] text-[#1f2937]"
                    }`}
                  >
                    {!isSender && <p className="text-xs font-semibold mb-1">{msg.sender_username}</p>}
                    {msg.message_type === "text" && <p>{msg.content}</p>}
                    {msg.message_type === "image" && msg.attachment_url && (
                      <img src={`${API}${msg.attachment_url}`} alt="uploaded" className="rounded-md max-h-72 mt-2" />
                    )}
                    {msg.message_type === "video" && msg.attachment_url && (
                      <video src={`${API}${msg.attachment_url}`} controls className="mt-2 max-h-72 rounded-md" />
                    )}
                    {msg.message_type === "file" && msg.attachment_url && (
                      <a
                        href={`${API}${msg.attachment_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        Download File
                      </a>
                    )}
                    <p className="text-[10px] text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    {isSender && (
                      <div className="absolute top-2 right-2 space-x-2 text-xs text-gray-500">
                        <button onClick={() => handleDelete(msg.message_id)} className="hover:underline">Delete</button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={scrollRef}></div>
          </div>

          {/* Input */}
          <div className="pt-4 border-t flex gap-2 items-center sticky bottom-0 bg-white mt-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#0B3D20]"
            />
            <input
              type="file"
              accept="image/*,video/*,.pdf,.doc,.docx,.zip,.rar"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="bg-[#0B3D20] px-3 py-2 rounded-md cursor-pointer">
            🔗
            </label>
            <button
              onClick={handleSend}
              className="bg-[#0B3D20] text-white px-6 py-3 rounded-md hover:bg-[#295b42]"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}