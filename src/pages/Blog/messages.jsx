import { useState } from "react";

const Messages = ({ openChat }) => {
  // Dummy user list
  const users = [
    { id: 1, name: "John Doe", avatar: "https://i.pravatar.cc/40?img=1" },
    { id: 2, name: "Jane Smith", avatar: "https://i.pravatar.cc/40?img=2" },
    { id: 3, name: "Alice Johnson", avatar: "https://i.pravatar.cc/40?img=3" },
    { id: 4, name: "Bob Williams", avatar: "https://i.pravatar.cc/40?img=4" }
  ];

  return (
    <div className="w-90 h-screen bg-white fixed right-0 top-20 p-4 overflow-y-auto shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-4">Messages</h2>
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
          onClick={() => openChat(user)}
        >
          <img src={user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
          <p className="font-semibold">{user.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Messages;
