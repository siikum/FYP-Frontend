export default function WeatherForecast() {
  const weatherData = {
    currentTemp: 8,
    condition: "Partly cloudy with a chance of rain.",
    windSpeed: "12 km/h",
    humidity: "75%",
    pressure: "1015 hPa",
    uvIndex: 3,
    daily: [
      { day: "Sat", date: 22 },
      { day: "Sun", date: 23 },
      { day: "Mon", date: 24 },
      { day: "Tue", date: 25 },
      { day: "Wed", date: 26 },
      { day: "Thu", date: 27 },
      { day: "Fri", date: 28 },
    ],
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-6xl mx-auto">
      {/* Title */}
      <h2 className="text-2xl font-bold border-b pb-2">Weather Condition</h2>

      {/* 7 Days Weather */}
      <div className="flex justify-between mt-4">
        {weatherData.daily.map((day, index) => (
          <div
            key={index}
            className="bg-white px-4 py-2 rounded-md text-center shadow w-29 cursor-pointer transition duration-300 hover:bg-gray-200 hover:scale-105"
            onClick={() => console.log(`Clicked on ${day.day}`)}
          >
            <div className="font-semibold">{day.day}</div>
            <div className="text-lg font-bold">{day.date}</div>
          </div>
        ))}
      </div>

      {/* Main Weather Box */}
      <div className="bg-white p-6 mt-6 rounded-lg shadow-md flex justify-between h-64">
        {/* Left Side - Temperature & Condition */}
        <div>
          <div className="text-6xl font-bold">{weatherData.currentTemp}°</div>
          <br />
          <p className="mt-2 text-gray-600">{weatherData.condition}</p>
        </div>

        {/* Right Side - Extra Weather Info */}
        <div className="text-gray-700 space-y-2">
          <p>
            <strong>Wind Speed:</strong> {weatherData.windSpeed}
          </p>
          <p>
            <strong>Humidity:</strong> {weatherData.humidity}
          </p>
          <p>
            <strong>Pressure:</strong> {weatherData.pressure}
          </p>
          <p>
            <strong>UV Index:</strong> {weatherData.uvIndex}
          </p>
        </div>
      </div>
    </div>
  );
}
