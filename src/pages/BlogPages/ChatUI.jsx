import { useState } from "react";

const ChatUI = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("individual");
  const [messages, setMessages] = useState([
    { sender: "Andy", text: "Wkp bruh!!", type: "received" },
    { sender: "Andy", text: "It's 8 AM bruh!! wake up!", type: "received" },
    { sender: "Me", text: "Argghh! what happened?", type: "sent" },
    { sender: "Andy", text: "Finally you're awake rn", type: "received" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { sender: "Me", text: newMessage, type: "sent" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="bg-amber-50 w-[500px] h-[600px] rounded-2xl shadow-lg flex flex-col">
        {/* Header */}
        <div className="bg-orange-500 text-white p-4 flex justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold">Chat</h2>
          <button onClick={onClose} className="text-xl">✖</button>
        </div>

        {/* Tabs (Individual / Group) */}
        <div className="flex justify-around bg-white p-2 shadow">
          <button
            className={`w-1/2 py-2 ${activeTab === "individual" ? "bg-orange-500 text-white" : "text-gray-600"}`}
            onClick={() => setActiveTab("individual")}
          >
            Individual
          </button>
          <button
            className={`w-1/2 py-2 ${activeTab === "group" ? "bg-orange-500 text-white" : "text-gray-600"}`}
            onClick={() => setActiveTab("group")}
          >
            Group
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3">
          <input type="text" placeholder="Search..." className="w-full p-2 border rounded-md" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-lg max-w-[70%] ${msg.type === "sent" ? "bg-orange-500 text-white" : "bg-white"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="p-3 flex items-center border-t">
          <input
            type="text"
            className="flex-1 p-2 border rounded-md"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={sendMessage} className="bg-orange-500 text-white px-4 py-2 ml-2 rounded-md">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
