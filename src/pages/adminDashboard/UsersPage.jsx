import React, { useEffect, useState } from "react";
import axios from "axios";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No admin token found. Redirecting to login...");
      window.location.href = "/LoginPage"; // or wherever your admin login page is
    }
    return token;
  };

  const fetchUsers = async () => {
    try {
      const token = getAuthToken();
      const res = await axios.get(
        "http://localhost:8000/admin_dashboard/users/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const toggleActivation = async (userId, currentStatus) => {
    try {
      const token = getAuthToken();
      await axios.patch(
        `http://localhost:8000/admin_dashboard/users/${userId}/toggle/`,
        { is_active: !currentStatus },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      fetchUsers(); // Refresh after toggle
    } catch (err) {
      console.error("Failed to toggle activation", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0B3D20] mb-6">All Users</h1>

      <input
        type="text"
        placeholder="Search by username or email"
        className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#0B3D20] text-white">
              <tr>
                <th className="px-6 py-3">Profile</th>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">First Name</th>
                <th className="px-6 py-3">Last Name</th>
                <th className="px-6 py-3">Bio</th>
                <th className="px-6 py-3">Active</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="px-6 py-4">
                    {user.profile_picture ? (
                      <img
                        src={`http://localhost:8000${user.profile_picture}`}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    )}
                  </td>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.first_name}</td>
                  <td className="px-6 py-4">{user.last_name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.bio || <em>—</em>}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActivation(user.id, user.is_active)}
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        user.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
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

export default UsersPage;
