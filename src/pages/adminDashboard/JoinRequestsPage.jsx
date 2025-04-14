import React, { useEffect, useState } from "react";
import axios from "axios";

const JoinRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJoinRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/admin_dashboard/join-requests/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("adminAuthToken")}`,
        },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch join requests", err);
    }
    setLoading(false);
  };

  const handleAction = async (id, type) => {
    const url = `http://localhost:8000/account/joinrequests/${id}/${type}/`;
    try {
      await axios.post(url, {}, {
        headers: {
          Authorization: `Token ${localStorage.getItem("adminAuthToken")}`,
        },
      });
      fetchJoinRequests();
    } catch (err) {
      console.error(`${type} failed`, err);
    }
  };

  useEffect(() => {
    fetchJoinRequests();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#0B3D20] mb-6">Pending Join Requests</h1>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#0B3D20] text-white">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Group</th>
                <th className="px-6 py-3">Requested At</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b">
                  <td className="px-6 py-3 font-semibold">{req.user_username}</td>
                  <td className="px-6 py-3">{req.group_name}</td>
                  <td className="px-6 py-3 text-gray-500">{new Date(req.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <button
                      onClick={() => handleAction(req.id, "approve")}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "reject")}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                    >
                      Reject
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

export default JoinRequestsPage;
