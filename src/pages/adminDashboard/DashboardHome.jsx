import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboardHome = () => {
  const [summary, setSummary] = useState({
    users: 0,
    destinations: 0,
    blogs: 0,
    messages: 0,
  });
  const [sentimentData, setSentimentData] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    fetchSummary();
    fetchSentiments();
    fetchRecentReviews();
  }, []);

  const fetchSummary = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const [usersRes, destRes, blogRes, msgRes] = await Promise.all([
        axios.get("http://localhost:8000/admin_dashboard/users/", { headers: { Authorization: `Token ${token}` } }),
        axios.get("http://localhost:8000/admin_dashboard/destinations/", { headers: { Authorization: `Token ${token}` } }),
        axios.get("http://localhost:8000/admin_dashboard/blogs/", { headers: { Authorization: `Token ${token}` } }),
        axios.get("http://localhost:8000/admin_dashboard/contacts/", { headers: { Authorization: `Token ${token}` } }),
      ]);

      setSummary({
        users: usersRes.data.length,
        destinations: destRes.data.length,
        blogs: blogRes.data.length,
        messages: msgRes.data.length,
      });
    } catch (err) {
      console.error("Summary fetch error", err);
    }
  };

  const fetchSentiments = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin_dashboard/sentiments/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("adminAuthToken")}`
        },
      });
      setSentimentData(res.data);
    } catch (err) {
      console.error("Sentiment fetch failed", err);
    }
  };

  const fetchRecentReviews = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin_dashboard/sentiments/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("adminAuthToken")}`
        },
      });
      setRecentReviews(res.data.slice(0, 5));
    } catch (err) {
      console.error("Review fetch failed", err);
    }
  };

  const chartData = {
    labels: sentimentData.map((s) => s.destination_name),
    datasets: [
      {
        label: "Positive",
        backgroundColor: "#16a34a",
        data: sentimentData.map((s) => s.positive_score ?? 0),
      },
      {
        label: "Neutral",
        backgroundColor: "#facc15",
        data: sentimentData.map((s) => s.neutral_score ?? 0),
      },
      {
        label: "Negative",
        backgroundColor: "#dc2626",
        data: sentimentData.map((s) => s.negative_score ?? 0),
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-sm text-gray-600">Total Users</h2>
          <p className="text-2xl font-bold text-[#0B3D20]">{summary.users}</p>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-sm text-gray-600">Destinations</h2>
          <p className="text-2xl font-bold text-[#0B3D20]">{summary.destinations}</p>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-sm text-gray-600">Blogs</h2>
          <p className="text-2xl font-bold text-[#0B3D20]">{summary.blogs}</p>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-sm text-gray-600">Messages</h2>
          <p className="text-2xl font-bold text-[#0B3D20]">{summary.messages}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold text-[#0B3D20] mb-4">Sentiment Overview (Recent 5)</h2>
        <Bar data={chartData} height={70} />
      </div>

      {/* Recent Reviews */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold text-[#0B3D20] mb-4">Recent Reviews</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-[#0B3D20] text-white">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Destination</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Review</th>
            </tr>
          </thead>
          <tbody>
            {recentReviews.map((r) => (
              <tr key={r.sentiment_id} className="border-b">
                <td className="px-4 py-2">{r.sentiment_id}</td>
                <td className="px-4 py-2">{r.destination_name}</td>
                <td className="px-4 py-2">{r.user}</td>
                <td className="px-4 py-2">{r.review}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
