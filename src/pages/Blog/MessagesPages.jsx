import { useState } from "react";

const MessagesPage = () => {
  // Dummy chat data
  const [chats, setChats] = useState([
    { id: 1, type: "user", name: "John Doe", avatar: "https://i.pravatar.cc/40?img=1" },
    { id: 2, type: "user", name: "Jane Smith", avatar: "https://i.pravatar.cc/40?img=2" },
    { 
      id: 3, 
      type: "group", 
      name: "Project Team", 
      avatar: "https://i.pravatar.cc/40?img=3",
      members: [1, 2], // Example group members
      messages: [
        { sender: "John Doe", text: "Hey team!" },
        { sender: "Jane Smith", text: "Hello everyone!" },
        { sender: "You", text: "Let's get started on our project." }
      ]
    }
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const selectChat = (chat) => {
    setSelectedChat(chat);
    setMessages(chat.messages || []);
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMessage = { sender: "You", text: inputMessage };
    setMessages([...messages, newMessage]);
    setInputMessage("");
    setChats(chats.map(chat => chat.id === selectedChat.id ? { ...chat, messages: [...chat.messages, newMessage] } : chat));
  };

  const createGroupChat = () => {
    const newGroup = {
      id: chats.length + 1,
      type: "group",
      name: `New Group ${chats.length + 1}`,
      avatar: "https://i.pravatar.cc/40?img=5",
      members: [],
      messages: []
    };
    setChats([...chats, newGroup]);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-bold mb-3">Messaging</h2>
        <input type="text" placeholder="Search..." className="w-full p-2 mb-3 border rounded" />
        <button onClick={createGroupChat} className="w-full p-2 bg-blue-500 text-white rounded mb-3">+ Create Group</button>
        <div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center space-x-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer"
              onClick={() => selectChat(chat)}
            >
              <img src={chat.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
              <p className="font-semibold">{chat.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white shadow-md">
              <div className="flex items-center space-x-3">
                <img src={selectedChat.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                <h2 className="text-lg font-bold">{selectedChat.name}</h2>
              </div>
              <div className="flex space-x-3">
                <button className="p-2 bg-blue-500 text-white rounded">📞 Call</button>
                <button className="p-2 bg-green-500 text-white rounded">📹 Video</button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 p-2 rounded ${msg.sender === "You" ? "bg-blue-200 self-end" : "bg-gray-200"}`}
                >
                  <p className="font-semibold">{msg.sender}</p>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t flex bg-white">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button
                className="ml-3 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
