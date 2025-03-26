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

const DailyForecast = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentWeather, setCurrentWeather] = useState({});
  const [isSunrise, setIsSunrise] = useState(true);
  const [weatherDetails, setWeatherDetails] = useState([]);

  const fetchWeatherDetails = async () => {
    const response = await axiosInstance.get(
      "itinerary/weather_info/?city=Jajarkot&country=Nepal"
    );

    console.log;

    if (
      response?.data?.jsonData?.days &&
      Array.isArray(response.data.jsonData?.days) &&
      response.data.jsonData?.days.length >= 7
    ) {
      console.log(response.data.jsonData?.days);

      setWeatherDetails(response.data.jsonData.days.slice(0, 7));
      setCurrentDate(response.data.jsonData.days[0].datetime);
      setCurrentWeather(response.data.jsonData.days[0]);
    }
  };

  useEffect(() => {
    fetchWeatherDetails();
  }, []);

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

  const availableOptions = [
    {
      day: "Sun",
      date: "23",
    },
    {
      day: "Mon",
      date: "24",
    },
    {
      day: "Tue",
      date: "25",
    },
    {
      day: "Wed",
      date: "26",
    },
    {
      day: "Thurs",
      date: "27",
    },
  ];

  const weatherData = [
    {
      date: 23,
      temperature: 21,
      description: "Clear",
      minTemperature: 21,
      maxTemperature: 21,
      humidity: 1,
      sunrise: 21,
      sunset: 21,
    },
    {
      date: 24,
      temperature: 22,
      description: "Partly Cloudy",
      minTemperature: 20,
      maxTemperature: 23,
      humidity: 10,
      sunrise: 22,
      sunset: 22,
    },
    {
      date: 25,
      temperature: 19,
      description: "Cloudy",
      minTemperature: 18,
      maxTemperature: 20,
      humidity: 15,
      sunrise: 21,
      sunset: 21,
    },
    {
      date: 26,
      temperature: 18,
      description: "Rainy",
      minTemperature: 17,
      maxTemperature: 19,
      humidity: 85,
      sunrise: 20,
      sunset: 20,
    },
    {
      date: 27,
      temperature: 20,
      description: "Sunny",
      minTemperature: 18,
      maxTemperature: 22,
      humidity: 5,
      sunrise: 21,
      sunset: 21,
    },
  ];

  const getIcon = (value) => {
    switch (value.toLowerCase()) {
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
        return <CloudSun className="w-[120px] h-[120px] mt-[20px]" />;
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
    if (time) {
      // Split the time by the colon
      let timeParts = time.split(":");

      // Return only hours and minutes
      return timeParts.slice(0, 2).join(":");
    }
  }

  return (
    <div className="flex flex-col gap-y-10 px-[200px] backdrop-blur-lg">
      <div className="grid grid-cols-7 w-full gap-x-10 justify-between">
        {weatherDetails &&
          weatherDetails.map((val) => (
            <div
              onClick={() => {
                setCurrentDate(val.datetime);
                setCurrentWeather(val);
                setIsSunrise((prev) => !prev);
              }}
              className={`col-span-1 ${
                currentDate === val.datetime && "border-2"
              } text-2xl flex flex-col p-4 gap-y-2 cursor-pointer rounded-2xl hover:border-2 hover:border-black-200`}
              key={val.datetime[0] + val.datetime[1]}
            >
              <div className="font-medium text-gray-500">
                {getShortDayFromDate(val.datetime)}
              </div>
              <div className="font-bold">
                {val.datetime[0] + val.datetime[1]}
              </div>
            </div>
          ))}
      </div>

      {/* Render the selected weather data */}
      <motion.div
        animate={isSunrise ? "sunrise" : "sunset"}
        variants={gradientVariants}
        className="weatherBG w-full h-[500px] text-white rounded-2xl px-14 py-10"
      >
        {currentWeather ? (
          <>
            <div className="text-[150px] flex items-center font-semibold leading-tight raleway">
              <div className="">{Math.floor(currentWeather.temp)}&deg;</div>
              {currentWeather?.icon && getIcon(currentWeather.icon)}
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
  );
};

export default DailyForecast;
