import { useState } from "react";

const Notifications = () => {
  // Dummy notifications
  const [notifications, setNotifications] = useState([
    { id: 1, user: "John Doe", message: "liked your post", date: "2 hours ago", avatar: "https://i.pravatar.cc/40?img=1" },
    { id: 2, user: "Jane Smith", message: "commented on your photo", date: "5 hours ago", avatar: "https://i.pravatar.cc/40?img=2" },
    { id: 3, user: "Alice Johnson", message: "started following you", date: "1 day ago", avatar: "https://i.pravatar.cc/40?img=3" },
    { id: 4, user: "Bob Williams", message: "shared your post", date: "2 days ago", avatar: "https://i.pravatar.cc/40?img=4" },
    { id: 5, user: "Charlie Brown", message: "mentioned you in a comment", date: "3 days ago", avatar: "https://i.pravatar.cc/40?img=5" }
  ]);

  return (
    <div className="w-90 h-screen bg-white fixed left-5 top-20 p-4 overflow-y-auto shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-4">Notifications</h2>
      {notifications.map((notif) => (
        <div key={notif.id} className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
          <img src={notif.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-sm">
              <span className="font-semibold">{notif.user}</span> {notif.message}
            </p>
            <p className="text-xs text-gray-500">{notif.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
