import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";

const API = "http://localhost:8000";

const backgroundImage = "/images/message_backgrounds/bg5.jpg";

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
      const res = await fetch(
        `${API}/account/groupchats/${channelId}/messages/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        setTimeout(
          () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
          100
        );
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
      formData.append(
        "message_type",
        file.type.startsWith("image")
          ? "image"
          : file.type.startsWith("video")
          ? "video"
          : "file"
      );
    } else {
      formData.append("message_type", "text");
    }

    const res = await fetch(
      `${API}/account/groupchats/${channelId}/messages/send/`,
      {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
        body: formData,
      }
    );

    if (res.ok) {
      setNewMessage("");
      setFile(null);
      fetchMessages();
    }
  };

  const handleDelete = async (msgId) => {
    const confirmResult = await Swal.fire({
      title: "Delete this message?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B91C1C",
      cancelButtonColor: "#0B3D20",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await fetch(
          `${API}/account/messages/${msgId}/delete/`,
          {
            method: "DELETE",
            headers: { Authorization: `Token ${token}` },
          }
        );
        if (response.ok) {
          await fetchMessages();
          Swal.fire("Deleted!", "The message has been removed.", "success");
        }
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLeaveChannel = async () => {
    const confirmResult = await Swal.fire({
      title: "Leave this channel?",
      text: "Are you sure you want to leave this channel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B91C1C",
      cancelButtonColor: "#0B3D20",
      confirmButtonText: "Yes, leave",
      cancelButtonText: "Cancel",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await fetch(
          `${API}/account/groupchats/${channelId}/leave/`,
          {
            method: "POST",
            headers: { Authorization: `Token ${token}` },
          }
        );

        if (res.ok) {
          Swal.fire({
            title: "Left!",
            text: "You have left the channel.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          navigate("/channels");
        } else {
          Swal.fire("Error", "Failed to leave the channel.", "error");
        }
      } catch (err) {
        console.error("Error leaving channel:", err);
        Swal.fire("Error", "Something went wrong.", "error");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen font-sans overflow-hidden">
      <Navbar isBlack={true} />
      <div className="flex flex-1 pt-20">
        {/* Sidebar */}
        <aside className="w-[20%] bg-[#f3f8f6] p-4 shadow-md h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto">
          <h2 className="text-3xl font-bold text-[#0B3D20] mb-10">
            My Channels
          </h2>
          <ul className="space-y-4">
            {myChannels.map((ch) => (
              <li
                key={ch.group_id}
                onClick={() => navigate(`/channels/${ch.group_id}`)}
                className={`cursor-pointer text-[18px] hover:underline ${
                  ch.group_id == channelId
                    ? "text-[#0B3D20] font-semibold"
                    : "text-gray-600"
                }`}
              >
                {ch.group_name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat Section */}
        <div className="flex flex-col flex-1 h-[calc(100vh-5rem)]">
          {/* Header */}
          <div className="bg-[#f3f8f6] p-4 border-b sticky top-20 z-10 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[#0B3D20]">
              Channel #{channelId}
            </h1>
            <button
              onClick={handleLeaveChannel}
              className=" text-red-600 text-sm px-4 py-2 hover:text-red-800"
            >
              Leave Channel
            </button>
          </div>

          {/* Messages - Only This Should Scroll */}
          <div
            className="flex-1 overflow-y-auto p-6 space-y-4 relative"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {messages.length === 0 ? (
              <div className="text-center text-[#0B3D20]">No messages yet.</div>
            ) : (
              messages.map((msg) => {
                const isSender = msg.sender_username === currentUsername;
                return (
                  <div
                    key={msg.message_id}
                    className={`relative p-4 rounded-lg max-w-lg break-words ${
                      isSender
                        ? "ml-auto bg-[#d9fdd3] text-[#0B3D20]"
                        : "mr-auto bg-[#ffffff] text-gray-800"
                    }`}
                  >
                    {!isSender && (
                      <p className="text-xs font-bold mb-1">
                        {msg.sender_username}
                      </p>
                    )}
                    {msg.message_type === "text" && <p>{msg.content}</p>}
                    {msg.message_type === "image" && msg.attachment_url && (
                      <img
                        src={`${API}${msg.attachment_url}`}
                        alt="uploaded"
                        className="rounded-md max-h-72 mt-2"
                      />
                    )}
                    {msg.message_type === "video" && msg.attachment_url && (
                      <video
                        src={`${API}${msg.attachment_url}`}
                        controls
                        className="mt-2 max-h-72 rounded-md"
                      />
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
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {isSender && (
                      <button
                        onClick={() => handleDelete(msg.message_id)}
                        className="absolute top-2 right-2 text-sm text-gray-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                );
              })
            )}
            <div ref={scrollRef}></div>
          </div>

          {/* Input Section */}
          <div className="bg-white p-4 border-t sticky bottom-0 flex flex-col gap-2">
            {file && (
              <div className="flex items-center gap-2">
                {file.type.startsWith("image") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="h-20 rounded"
                  />
                ) : file.type.startsWith("video") ? (
                  <video
                    src={URL.createObjectURL(file)}
                    controls
                    className="h-20 rounded"
                  />
                ) : (
                  <p className="text-sm text-gray-500">
                    Selected file: {file.name}
                  </p>
                )}
                <button
                  onClick={() => setFile(null)}
                  className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ✖
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
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
              <label
                htmlFor="fileInput"
                className="flex items-center justify-center bg-[#0B3D20] p-3 rounded-md cursor-pointer"
              >
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
    </div>
  );
}
