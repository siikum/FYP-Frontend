import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminSentimentReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/admin_dashboard/sentiments/?destination=${filter}`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`
          },
        }
      );
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching sentiment reviews:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(
        `http://localhost:8000/admin_dashboard/sentiments/${id}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`
          },
        }
      );
      fetchReviews();
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const handleExportPDF = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/admin_dashboard/sentiments/export-pdf/",
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`
          },
        }
      );

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sentiment_reviews.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("PDF export failed: " + err.message);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/admin_dashboard/sentiments/export-csv/",
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`
          },
        }
      );

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sentiment_reviews.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("CSV export failed: " + err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0B3D20] mb-6">
        Sentiment Reviews
      </h1>

      <div className="mb-6 flex items-center gap-4">
        <input
          placeholder="Filter by destination"
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded w-full max-w-sm"
        />
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-[#0B3D20] text-white rounded hover:bg-[#12492b]"
        >
          Export PDF
        </button>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-[#0B3D20] text-white rounded hover:bg-[#12492b]"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#0B3D20] text-white">
            <tr>
              <th className="px-6 py-3">Sentiment ID</th>
              <th className="px-6 py-3">Destination</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Review</th>
              <th className="px-6 py-3">Positive</th>
              <th className="px-6 py-3">Neutral</th>
              <th className="px-6 py-3">Negative</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.sentiment_id} className="border-b">
                <td className="px-6 py-2">{review.sentiment_id}</td>
                <td className="px-6 py-2">{review.destination_name}</td>
                <td className="px-6 py-2">{review.user || "-"}</td>
                <td className="px-6 py-2">{review.review}</td>
                <td className="px-6 py-2">{review.positive_score ?? "—"}</td>
                <td className="px-6 py-2">{review.neutral_score ?? "—"}</td>
                <td className="px-6 py-2">{review.negative_score ?? "—"}</td>
                <td className="px-6 py-2">
                  {new Date(review.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-2">
                  <button
                    onClick={() => handleDelete(review.sentiment_id)}
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
    </div>
  );
};

export default AdminSentimentReviews;
