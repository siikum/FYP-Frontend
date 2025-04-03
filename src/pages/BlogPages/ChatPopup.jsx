import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Mic, SendHorizonal, X } from "lucide-react";

const MessageBubble = ({ message, isOwnMessage }) => (
  <div
    className={`flex ${
      isOwnMessage ? "justify-end" : "justify-start"
    } mb-3 mx-3`}
  >
    {!isOwnMessage && (
      <img
        src={message.sender.avatar}
        alt={message.sender.name}
        className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
      />
    )}
    <div className="flex flex-col max-w-[80%]">
      {!isOwnMessage && (
        <p className="text-xs font-medium text-gray-700 mb-1">
          {message.sender.name}
        </p>
      )}
      <div
        className={`py-2 px-3 rounded-xl text-sm ${
          isOwnMessage
            ? "bg-purple-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        {message.type === "text" && <p>{message.content}</p>}
      </div>
      <span
        className={`text-[10px] mt-1 ${
          isOwnMessage ? "text-right" : "text-left"
        } text-gray-400`}
      >
        {message.timestamp} {isOwnMessage && <span className="ml-1">✓✓</span>}
      </span>
    </div>
  </div>
);

const ChatPopup = ({ chat, onClose }) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const currentUser = {
    id: "userId1",
    name: "You",
    avatar: "https://via.placeholder.com/40/93C5FD/FFFFFF?text=Me",
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: chat?.participants?.[0] || {
        name: chat?.name || "Other User",
        avatar: chat?.avatar,
      },
      content: `Hello! This is the start of your chat with ${
        chat?.name || "..."
      }`,
      type: "text",
      timestamp: "09:00",
    },
    {
      id: 2,
      sender: currentUser,
      content: "Hi there! Nice to chat.",
      type: "text",
      timestamp: "09:01",
    },
  ]);

  useEffect(() => {
    console.log("Fetching messages for chat:", chat?.id);
  }, [chat?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    const messageToSend = {
      id: Date.now(),
      sender: currentUser,
      content: newMessage,
      type: "text",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, messageToSend]);
    setNewMessage("");
  };

  if (!chat) return null;

  return (
    <div className="fixed bottom-0 left-[20rem] z-50 w-[340px] h-[500px] bg-white rounded-t-lg shadow-xl flex flex-col border border-gray-300 border-b-0">
      <div className="flex items-center justify-between p-3 bg-white border-b rounded-t-lg sticky top-0 z-10">
        <div className="flex items-center overflow-hidden mr-2">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
          />
          <p className="font-semibold text-sm text-gray-800 truncate">
            {chat.name}
          </p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatPopup;
