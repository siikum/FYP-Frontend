import { useState } from "react";
import { FaTimes, FaMinus } from "react-icons/fa";

const ChatPopup = ({ user, closeChat }) => {
  const [messages, setMessages] = useState([
    { text: "Hey there!", sender: "them" },
    { text: "Hello!", sender: "me" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [minimized, setMinimized] = useState(false);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { text: newMessage, sender: "me" }]);
      setNewMessage("");
    }
  };

  return (
    <div className={`fixed bottom-0 right-4 w-72 bg-white shadow-lg rounded-t-lg ${minimized ? "h-12" : "h-80"} transition-all`}>
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-500 text-white p-2 rounded-t-lg cursor-pointer">
        <p className="font-bold">{user.name}</p>
        <div className="flex space-x-2">
          <FaMinus className="cursor-pointer" onClick={() => setMinimized(!minimized)} />
          <FaTimes className="cursor-pointer" onClick={closeChat} />
        </div>
      </div>

      {/* Chat Messages */}
      {!minimized && (
        <div className="p-3 h-56 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 my-1 max-w-xs ${msg.sender === "me" ? "bg-blue-500 text-white ml-auto rounded-l-lg rounded-br-lg" : "bg-gray-200 text-black mr-auto rounded-r-lg rounded-bl-lg"}`}>
              {msg.text}
            </div>
          ))}
        </div>
      )}

      {/* Input Box */}
      {!minimized && (
        <div className="p-2 border-t flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full p-2 rounded-l-lg border focus:outline-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-3 rounded-r-lg" onClick={sendMessage}>
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatPopup;
