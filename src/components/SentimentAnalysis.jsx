import React, { useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function SentimentAnalysis() {
  const [destination, setDestination] = useState("");
  const [sentimentData, setSentimentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch sentiment data for a given destination
  const fetchSentimentData = async () => {
    if (!destination.trim()) {
      setError("Please enter a destination name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Send a GET request to the Django backend with destination as query parameter
      const response = await axios.get(
        `http://127.0.0.1:8000/machine_learning/get_sentiment_analysis/?destination=${destination}`
      );

      console.log("API Response:", response.data);

      setSentimentData(response.data.sentiments); // Save sentiments from API response
    } catch (err) {
      console.error("Error fetching sentiment data:", err);
      setError("Failed to fetch sentiment data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate percentages for sentiments
  const calculateSentimentPercentages = () => {
    if (!sentimentData || sentimentData.length === 0) return null;

    // Sum all sentiment scores for positive, neutral, and negative
    const total = sentimentData.reduce(
      (acc, data) => {
        acc.positive += data.positive_score;
        acc.neutral += data.neutral_score;
        acc.negative += data.negative_score;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    // Calculate the total number of sentiments
    const totalSentiment = total.positive + total.neutral + total.negative;

    // Calculate percentages
    const positivePercentage = totalSentiment
      ? (total.positive / totalSentiment) * 100
      : 0;
    const neutralPercentage = totalSentiment
      ? (total.neutral / totalSentiment) * 100
      : 0;
    const negativePercentage = totalSentiment
      ? (total.negative / totalSentiment) * 100
      : 0;

    return {
      sentiment1: [positivePercentage, neutralPercentage, negativePercentage],
      sentimentTrends: {
        positive: sentimentData.map(
          (data) => (data.positive_score / totalSentiment) * 100
        ),
        neutral: sentimentData.map(
          (data) => (data.neutral_score / totalSentiment) * 100
        ),
        negative: sentimentData.map(
          (data) => (data.negative_score / totalSentiment) * 100
        ),
      },
    };
  };

  const chartData = calculateSentimentPercentages();

  return (
    <div className="text-center p-8 bg-[rgba(211,211,211,0.5)] backdrop-blur-lg rounded-lg shadow-md">
      
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Sentiment Analysis
      </h2>

      {/* Destination Input */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter a destination name"
          className="p-2 border rounded-md w-64"
        />
        <button
          onClick={fetchSentimentData}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Analyze
        </button>
      </div>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display charts only when sentimentData is available */}
      {chartData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Bar Chart */}
          <div className="w-full sm:max-w-[600px] max-h-[600px] mx-auto">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Sentiment Comparison
            </h3>
            <Bar
              data={{
                labels: ["Positive", "Neutral", "Negative"],
                datasets: [
                  {
                    label: "Sentiment Analysis",
                    data: chartData.sentiment1,
                    backgroundColor: ["green", "yellow", "red"],
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
              height={300}
            />
          </div>

          {/* Line Chart */}
          <div className="w-full sm:max-w-[600px] max-h-[600px] mx-auto">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Sentiment Trends
            </h3>
            <Line
              data={{
                labels: [1, 2, 3, 4, 5, 6], // Replace with actual review indices or date if available
                datasets: [
                  {
                    label: "Positive",
                    data: chartData.sentimentTrends.positive,
                    borderColor: "green",
                    fill: false,
                  },
                  {
                    label: "Neutral",
                    data: chartData.sentimentTrends.neutral,
                    borderColor: "yellow",
                    fill: false,
                  },
                  {
                    label: "Negative",
                    data: chartData.sentimentTrends.negative,
                    borderColor: "red",
                    fill: false,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
              height={300}
            />
          </div>
        </div>
      )}
    </div>
  );
}
