import { Bar, Line } from "react-chartjs-2";
import axiosInstance from "../api/axiosConfig";
import { useEffect, useState } from "react";

const DestinationSentiment = ({ destination }) => {
  const [sentimentData, setSentimentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchSentimentData = async () => {
    try {
      // Send a GET request to the Django backend with destination as query parameter
      const response = await axiosInstance.get(
        `http://127.0.0.1:8000/machine_learning/get_sentiment_analysis/?destination=${destination}`
      );

      console.log("API Response:", response.data);

      setSentimentData(response.data.aggregated_sentiment); // Save sentiments from API response
    } catch (err) {
      console.error("Error fetching sentiment data:", err);
    }
  };

  useEffect(() => {
    fetchSentimentData();
  }, []);

  const chartData = {
    sentiment1: [0.7, 0.2, 0.1], // Positive, Neutral, Negative sentiment values
    sentimentTrends: {
      positive: [0.6, 0.7, 0.8, 0.75, 0.85, 0.9], // Positive sentiment trend over time
      neutral: [0.2, 0.25, 0.3, 0.2, 0.15, 0.1], // Neutral sentiment trend over time
      negative: [0.1, 0.05, 0.05, 0.05, 0.05, 0.05], // Negative sentiment trend over time
    },
  };
  return (
    <div className="text-center p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Sentiment Analysis
      </h2>

      {/* Display charts only when sentimentData is available */}
      {sentimentData && (
        <div className="flex flex-col justify-between w-full lg:flex-row">
          {/* Bar Chart */}
          <div className="w-full sm:max-w-[400px] max-h-[400px]">
            <h3 className="text-xl text-left font-semibold text-gray-700 mb-4">
              Sentiment Comparison
            </h3>
            <Bar
              data={{
                labels: ["Positive", "Neutral", "Negative"],
                datasets: [
                  {
                    label: "Sentiment Analysis",
                    data: [
                      sentimentData.average_positive
                        ? sentimentData.average_positive * 100
                        : 0,
                      sentimentData.average_neutral
                        ? sentimentData.average_neutral * 100
                        : 0,
                      sentimentData.average_negative
                        ? sentimentData.average_negative * 100
                        : 0,
                    ],
                    backgroundColor: [
                      "rgba(75, 192, 192, 0.2)",
                      "rgba(255, 205, 86, 0.2)",
                      "rgba(255, 99, 132, 0.2)",
                      "rgba(255, 159, 64, 0.2)",
                      "rgba(54, 162, 235, 0.2)",
                      "rgba(153, 102, 255, 0.2)",
                      "rgba(201, 203, 207, 0.2)",
                    ],
                    borderColor: [
                      "rgb(75, 192, 192)",
                      "rgb(255, 205, 86)",
                      "rgb(255, 99, 132)",
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
              height={250}
            />
          </div>

          {/* Line Chart */}
          <div className="w-full sm:max-w-[400px] max-h-[400px] mx-auto">
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
                    borderColor: "#4CAF50",
                    fill: false,
                  },
                  {
                    label: "Neutral",
                    data: chartData.sentimentTrends.neutral,
                    borderColor: "#B0BEC5",
                    fill: false,
                  },
                  {
                    label: "Negative",
                    data: chartData.sentimentTrends.negative,
                    borderColor: "#FF7043",
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
};

export default DestinationSentiment;
