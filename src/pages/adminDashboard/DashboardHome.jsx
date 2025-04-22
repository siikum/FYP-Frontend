import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Line, Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const DashboardHome = () => {
  const navigate = useNavigate();
  const [totals, setTotals] = useState({ users: 0, blogs: 0, channels: 0, sentiments: 0 });
  const [topDestinations, setTopDestinations] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async (token) => {
    try {
      const [usersRes, blogsRes, channelsRes, sentimentsRes] = await Promise.all([
        axios.get("http://localhost:8000/admin_dashboard/users/", { headers: { Authorization: `Token ${token}` } }),
        axios.get("http://localhost:8000/admin_dashboard/blogs/", { headers: { Authorization: `Token ${token}` } }),
        axios.get("http://localhost:8000/admin_dashboard/groupchats/", { headers: { Authorization: `Token ${token}` } }),
        axios.get("http://localhost:8000/admin_dashboard/sentiments/", { headers: { Authorization: `Token ${token}` } }),
      ]);

      setTotals({
        users: usersRes.data.length,
        blogs: blogsRes.data.length,
        channels: channelsRes.data.length,
        sentiments: sentimentsRes.data.length,
      });

      const destinationCounts = {};
      sentimentsRes.data.forEach((s) => {
        const dest = s.destination_name || "Unknown";
        destinationCounts[dest] = (destinationCounts[dest] || 0) + 1;
      });
      const sorted = Object.entries(destinationCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      setTopDestinations(sorted);

      const activities = blogsRes.data.slice(-5).reverse();
      setRecentActivities(activities);
    } catch (err) {
      console.error("Dashboard fetch failed", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No valid token. Redirecting...");
      navigate("/LoginPage");
    } else {
      fetchDashboardData(token);
    }
  }, [navigate]);

  const lineChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "New Users",
        data: [5, 8, 6, 10, 7, 9, 11],
        borderColor: "#0B3D20",
        backgroundColor: "#0B3D20",
        tension: 0.4,
      },
      {
        label: "New Blogs",
        data: [2, 4, 3, 5, 2, 4, 5],
        borderColor: "#f59e0b",
        backgroundColor: "#f59e0b",
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: topDestinations.map(([name]) => name),
    datasets: [
      {
        label: "Sentiment Reviews",
        data: topDestinations.map(([, count]) => count),
        backgroundColor: "#0B3D20",
      },
    ],
  };

  const areaChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Active Users",
        data: [50, 55, 53, 60, 57, 65, 70],
        fill: true,
        backgroundColor: "rgba(11,61,32,0.2)",
        borderColor: "#0B3D20",
        tension: 0.4,
      },
    ],
  };

  const blogsPerDayData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Blogs Created",
        data: [2, 3, 1, 4, 2, 3, 5],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[#0B3D20] mb-6">Admin Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          {/* Top Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-100 p-6 rounded-lg shadow text-center">
              <h2 className="text-xl font-semibold">Users</h2>
              <p className="text-2xl font-bold">{totals.users}</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg shadow text-center">
              <h2 className="text-xl font-semibold">Blogs</h2>
              <p className="text-2xl font-bold">{totals.blogs}</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg shadow text-center">
              <h2 className="text-xl font-semibold">Channels</h2>
              <p className="text-2xl font-bold">{totals.channels}</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg shadow text-center">
              <h2 className="text-xl font-semibold">Reviews</h2>
              <p className="text-2xl font-bold">{totals.sentiments}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">New Users vs New Blogs</h2>
              <Line data={lineChartData} />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Top Destinations by Reviews</h2>
              <Bar data={barChartData} />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Active Users Trend</h2>
              <Line data={areaChartData} />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Blogs Created by Day</h2>
              <Bar data={blogsPerDayData} />
            </div>
          </div>

          
        </>
      )}
    </div>
  );
};

export default DashboardHome;