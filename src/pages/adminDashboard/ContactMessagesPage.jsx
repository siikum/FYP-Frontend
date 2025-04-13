import React, { useEffect, useState } from "react";
import axios from "axios";

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin_dashboard/contacts/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("adminAuthToken")}`
        },
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await axios.delete(`http://localhost:8000/admin_dashboard/contacts/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("adminAuthToken")}`
        },
      });
      fetchMessages();
    } catch (err) {
      console.error(err);
      alert("Failed to delete message");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0B3D20] mb-6">Contact Messages</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-600">No messages found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#0B3D20] text-white">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">First Name</th>
                <th className="px-6 py-3">Last Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Message</th>
                <th className="px-6 py-3">Submitted At</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id} className="border-b">
                  <td className="px-6 py-2">{msg.user}</td>
                  <td className="px-6 py-2">{msg.first_name}</td>
                  <td className="px-6 py-2">{msg.last_name}</td>
                  <td className="px-6 py-2">{msg.email}</td>
                  <td className="px-6 py-2">{msg.phone || "—"}</td>
                  <td className="px-6 py-2">{msg.message}</td>
                  <td className="px-6 py-2">
                    {new Date(msg.submitted_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-2">
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContactMessagesPage;
