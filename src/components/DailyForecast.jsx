import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Snowflake,
  CloudRain,
  CloudFog,
  Wind,
  Cloud,
  Moon,
  Sun,
  CloudSun,
  Droplet,
} from "lucide-react";

import axiosInstance from "../api/axiosConfig";

const DailyForecast = ({ destination }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [isSunrise, setIsSunrise] = useState(true);
  const [weatherDetails, setWeatherDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchWeatherDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `itinerary/weather_info/?city=${destination}&country=Nepal`
      );

      const days = response?.data?.jsonData?.days;

      if (Array.isArray(days) && days.length >= 7) {
        setWeatherDetails(days.slice(0, 7));
        setCurrentDate(days[0].datetime);
        setCurrentWeather(days[0]);
        setErrorMessage(""); // clear any error
      } else {
        setWeatherDetails([]);
        setErrorMessage("Weather data not available for this destination.");
      }
    } catch (error) {
      console.error("Weather fetch failed:", error.response?.data || error.message);
      setWeatherDetails([]);
      setErrorMessage("Weather data could not be loaded for this destination.");
    }
  };

  useEffect(() => {
    fetchWeatherDetails();
  }, [destination]);

  const gradientVariants = {
    sunrise: {
      background: "linear-gradient(180deg, #FF7A6A, #FFA880, #FFD700)",
      transition: { duration: 0.5 },
    },
    sunset: {
      background: "linear-gradient(180deg, #FFD700, #FFA880, #FF7A6A)",
      transition: { duration: 0.5 },
    },
  };

  const getIcon = (value) => {
    switch (value?.toLowerCase()) {
      case "snow":
        return <Snowflake className="w-[120px] h-[120px] mt-[20px]" />;
      case "rain":
        return <CloudRain className="w-[120px] h-[120px] mt-[20px]" />;
      case "fog":
        return <CloudFog className="w-[120px] h-[120px] mt-[20px]" />;
      case "wind":
        return <Wind className="w-[120px] h-[120px] mt-[20px]" />;
      case "cloudy":
        return <Cloud className="w-[120px] h-[120px] mt-[20px]" />;
      case "partly-cloudy-day":
      case "partly-cloudy-night":
        return <CloudSun className="w-[120px] h-[120px] mt-[20px]" />;
      case "clear-day":
        return <Sun className="w-[120px] h-[120px] mt-[20px]" />;
      case "clear-night":
        return <Moon className="w-[120px] h-[120px] mt-[20px]" />;
      default:
        return <Sun className="w-[120px] h-[120px] mt-[20px]" />;
    }
  };

  function getShortDayFromDate(dateInput) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date(dateInput);
    return days[date.getDay()];
  }

  function formatTime(time) {
    if (!time) return "";
    return time.split(":").slice(0, 2).join(":");
  }

  if (errorMessage) {
    return (
      <div className="text-center text-xl font-semibold text-red-600 px-4 py-10">
        {errorMessage}
      </div>
    );
  }

  return weatherDetails.length ? (
    <div className="flex flex-col gap-y-10 px-[200px] backdrop-blur-lg">
      {/* Days selector */}
      <div className="grid grid-cols-7 w-full gap-x-4 justify-between">
        {weatherDetails.map((val) => (
          <div
            onClick={() => {
              setCurrentDate(val.datetime);
              setCurrentWeather(val);
              setIsSunrise((prev) => !prev);
            }}
            className={`col-span-1 ${
              currentDate === val.datetime ? "border-2 border-black" : ""
            } text-2xl flex flex-col p-4 gap-y-2 cursor-pointer rounded-2xl hover:border-2 hover:border-black-200`}
            key={val.datetime}
          >
            <div className="font-medium text-gray-500">
              {getShortDayFromDate(val.datetime)}
            </div>
            <div className="font-bold">{val.datetime.slice(8, 10)}</div>
          </div>
        ))}
      </div>

      {/* Current Weather Display */}
      <motion.div
        animate={isSunrise ? "sunrise" : "sunset"}
        variants={gradientVariants}
        className="weatherBG w-full h-[500px] text-white rounded-2xl px-14 py-10"
      >
        {currentWeather ? (
          <>
            <div className="text-[150px] flex items-center font-semibold leading-tight raleway">
              <div>{Math.floor(currentWeather.temp)}&deg;</div>
              {getIcon(currentWeather.icon)}
            </div>
            <div className="flex flex-col gap-y-[5px] mt-[30px]">
              <div className="flex gap-x-4 text-xl font-medium">
                <div>{currentWeather.conditions}</div>
                <div>Min: {currentWeather.tempmin}&deg;</div>
                <div>Max: {currentWeather.tempmax}&deg;</div>
              </div>
              <div className="flex gap-x-4 text-xl font-medium">
                <div className="flex items-center">
                  <Droplet /> <span>{currentWeather.humidity}%</span>
                </div>
                <div>Sunrise: {formatTime(currentWeather.sunrise)}</div>
                <div>Sunset: {formatTime(currentWeather.sunset)}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-xl font-medium">
            No weather data available for the selected date.
          </div>
        )}
      </motion.div>
    </div>
  ) : null;
};

export default DailyForecast;
