import { Bar, Line } from "react-chartjs-2";

const DestinationSentiment = () => {
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
      {chartData && (
        <div className="flex flex-col justify-between w-full px-[200px] lg:flex-row">
          {/* Bar Chart */}
          <div className="w-full sm:max-w-[400px] max-h-[400px] mx-auto">
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
                    backgroundColor: ["#4CAF50", "#B0BEC5", "#FF7043"],
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
              height={300}
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
