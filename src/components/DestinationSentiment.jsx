import { Bar, Line } from "react-chartjs-2";
import axiosInstance from "../api/axiosConfig";
import { useEffect, useState } from "react";

const DestinationSentiment = ({ destination }) => {
  const [sentimentData, setSentimentData] = useState(null);
  const [sentimentRawData, setSentimentRawData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSentimentData = async () => {
    try {
      const response = await axiosInstance.get(
        `http://127.0.0.1:8000/machine_learning/get_sentiment_analysis/?destination=${destination}`
      );

      console.log("API Response:", response.data);

      setSentimentData(response.data.aggregated_sentiment);
      setSentimentRawData(response.data.sentiment_data);
    } catch (err) {
      console.error("Error fetching sentiment data:", err);
    }
  };

  useEffect(() => {
    fetchSentimentData();
  }, []);

  const chartDataLine = {
    sentimentTrends: {
      positive: sentimentRawData.map((s) => s.positive_score * 100),
      neutral: sentimentRawData.map((s) => s.neutral_score * 100),
      negative: sentimentRawData.map((s) => s.negative_score * 100),
    },
  };

  return (
    <div className="text-center p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Sentiment Analysis
      </h2>

      {sentimentData && (
        <div className="flex flex-col gap-x-[100px] justify-between w-full lg:flex-row">
          {/* Bar Chart */}
          <div className="w-[50%]">
            <h3 className="text-xl text-left font-semibold text-gray-700 mb-4">
              Sentiment Comparison
            </h3>
            <Bar
              className="w-full max-h-[526px]"
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
            />
          </div>

          {/* Line Chart */}
          <div className="w-[50%]">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Sentiment Trends
            </h3>
            <Line
              className="w-full max-h-[526px]"
              data={{
                labels: sentimentRawData.map((_, i) => `Review ${i + 1}`),
                datasets: [
                  {
                    label: "Positive",
                    data: chartDataLine.sentimentTrends.positive,
                    borderColor: "#4CAF50",
                    fill: false,
                  },
                  {
                    label: "Neutral",
                    data: chartDataLine.sentimentTrends.neutral,
                    borderColor: "#B0BEC5",
                    fill: false,
                  },
                  {
                    label: "Negative",
                    data: chartDataLine.sentimentTrends.negative,
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
