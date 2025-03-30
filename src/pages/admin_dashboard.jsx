import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import 'chart.js/auto';

Chart.register(...registerables);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_blog_posts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const barChartRef = useRef(null);
  const lineChartUsersRef = useRef(null);
  const lineChartPostsRef = useRef(null);

  const [userChartData, setUserChartData] = useState([10, 20, 15, 25, 30, 22]);
  const [postChartData, setPostChartData] = useState([5, 15, 10, 20, 25, 18]);

  useEffect(() => {
    // Fetch stats from the backend API
    axios
      .get('http://127.0.0.1:8000/adminAPI/stats/')
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      // Destroy existing charts
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
      if (lineChartUsersRef.current) {
        lineChartUsersRef.current.destroy();
      }
      if (lineChartPostsRef.current) {
        lineChartPostsRef.current.destroy();
      }

      // Bar Chart
      const barCtx = document.getElementById('barChart').getContext('2d');
      barChartRef.current = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['Users', 'Blog Posts'],
          datasets: [
            {
              label: 'Statistics',
              data: [stats.total_users, stats.total_blog_posts],
              backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
              borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      // Line Chart - Users
      const lineCtxUsers = document.getElementById('lineChartUsers').getContext('2d');
      lineChartUsersRef.current = new Chart(lineCtxUsers, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'New Users',
              data: userChartData, // Example data for users
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      // Line Chart - Posts
      const lineCtxPosts = document.getElementById('lineChartPosts').getContext('2d');
      lineChartPostsRef.current = new Chart(lineCtxPosts, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'New Blog Posts',
              data: postChartData, // Example data for posts
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    return () => {
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
      if (lineChartUsersRef.current) {
        lineChartUsersRef.current.destroy();
      }
      if (lineChartPostsRef.current) {
        lineChartPostsRef.current.destroy();
      }
    };
  }, [stats, loading, error, userChartData, postChartData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto mt-5 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-white">Admin Panel</h2>
        </div>
        <nav>
          <ul>
            <li className="p-4 hover:bg-gray-700">
              <a href="#" className="block"><i className="fas fa-tachometer-alt mr-2"></i>Dashboard</a>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <a href="#" className="block"><i className="fas fa-users mr-2"></i>Users</a>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <a href="#" className="block"><i className="fas fa-file-alt mr-2"></i>Posts</a>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <a href="#" className="block"><i className="fas fa-cog mr-2"></i>Settings</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
          {/* Stats Cards */}
          <div className="bg-white shadow-md rounded-md p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-users fa-2x text-gray-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Total Users
                </p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total_users}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-md p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-file-alt fa-2x text-gray-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Total Blog Posts
                </p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total_blog_posts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow-md rounded-md p-4">
            <canvas id="barChart" width="400" height="200"></canvas>
          </div>
          <div className="bg-white shadow-md rounded-md p-4">
            <canvas id="lineChartUsers" width="400" height="200"></canvas>
          </div>
          <div className="bg-white shadow-md rounded-md p-4">
            <canvas id="lineChartPosts" width="400" height="200"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;