import { useNavigate } from "react-router-dom";
import { MapPinned, Mountain, MountainSnow, Timer } from "lucide-react";
import randomIMG from "../../assets/images/2.jpg";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Counter from "../../components/Counter";
// import Weather from "../../components/Weather";
// import SentimentAnalysis from "../../components/SentimentAnalysis";
import DailyForecast from "../../components/DailyForecast";
import DestinationSentiment from "../../components/DestinationSentiment";
import LoManthangMonastery from "../../assets/images/Lo Manthang Monastery.jpg";
import LoManthangLandscape from "../../assets/images/Lo Manthang Landscape.jpg";
import Navbar from "../../components/Navbar";
import ReviewCard from "../../components/ReviewCard";
import axiosInstance from "../../api/axiosConfig";
import { useEffect } from "react";

const IndividualDestination = () => {
  const navigate = useNavigate(); // Initialize the navigate function


  const handleRedirect = () => {
    navigate("/TripPlannerForm"); // Replace '/your-target-page' with the path you want to navigate to
  };
  return (
    <div className="flex flex-col pb-[100px]">
      <Navbar />
      <div className="w-full h-full flex flex-col items-center relative">
        <img
          src={randomIMG}
          className="flex w-full h-full object-cover max-h-screen"
        />
        <div className="flex w-full max-h-screen  justify-between absolute">
          <div className="flex  w-fit min-h-screen items-end">
            <div className="relative flex-1 py-8 pb-20 flex flex-col gap-y-4 z-[3] rounded-xl">
              <div className="flex flex-col gap-y-5 mx-5 mt-5">
                <motion.div
                  initial={{
                    visibility: "hidden",
                    y: 400,
                  }}
                  viewport={{ once: true }}
                  whileInView={{
                    visibility: "visible",
                    y: 0,
                  }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="text-6xl text-white font-bold"
                >
                  Lomanthang | लोमान्थाङ
                </motion.div>
              </div>
            </div>
          </div>
          <div className="flex  w-[45%] min-h-screen items-end justify-end text-justify">
            <div className="relative flex-1 p-8 flex flex-col gap-y-4 z-[3] rounded-xl">
              <div className="flex flex-col gap-y-5 mx-5 mt-5">
                {/* Button to generate itinerary */}
                <button
                  onClick={handleRedirect}
                  className="bg-blue-500 text-white py-2 px-4 rounded mb-5"
                >
                  Generate Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="px-[20%] flex w-full justify-between py-[70px] backdrop-blur-lg ">
          <div className="flex flex-col gap-y-2 items-center">
            <div className="text-6xl font-bold flex items-center gap-x-2 ">
              <div>
                <Counter initialValue={0} finalValue={6444} duration={2} />
              </div>
              <Mountain className="w-[50px] h-[50px]" />
            </div>
            <div className="text-2xl font-medium">Altitude</div>
          </div>
          <div className="flex flex-col gap-y-2 items-center">
            <div className="text-6xl font-bold flex items-center gap-x-2 ">
              <div>
                <Counter initialValue={0} finalValue={2} duration={2} /> B
              </div>
              <MapPinned className="w-[50px] h-[50px]" />
            </div>
            <div className="text-2xl font-medium">Grade</div>
          </div>
          <div className="flex flex-col gap-y-2 items-center">
            <div className="text-6xl font-bold flex items-center gap-x-2 ">
              <div>
                <Counter initialValue={0} finalValue={16} duration={2} />
              </div>
              <Timer className="w-[50px] h-[50px] font-medium" />
            </div>
            <div className="text-2xl font-medium">Duration</div>
          </div>
        </div>
      </div>
      {/* New Destination Description Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10 mb-20"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          About Lo Manthang
        </h2>

        {/* First Row: Text - Image */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <p className="text-lg text-gray-600 leading-relaxed md:w-1/2 text-justify">
            Lomanthang (Nepali: लोमान्थाङ) is a rural municipality in Mustang
            district in Gandaki Province of western Nepal. It is located at the
            northern end of the district, bordering the Tibet Autonomous Region
            of China to the north and Lo-Ghekar Damodarkunda rural municipality
            of Mustang in the south.Lo Manthang, the ancient walled city of
            Upper Mustang, is a hidden gem in Nepal. Surrounded by the rugged
            landscapes of the Trans-Himalayan region, it boasts a deep-rooted
            Tibetan heritage, stunning monasteries, and a royal palace.
          </p>
          <img
            src={LoManthangLandscape}
            className="w-full md:w-[580px] rounded-xl shadow-md"
            alt="Lo Manthang Landscape"
          />
        </div>
        <br />
        {/* Second Row: Image - Text */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-6">
          <p className="text-lg text-gray-600 leading-relaxed md:w-1/2 text-justify">
            Visitors to Lo Manthang can explore its intricate mud-brick
            architecture, witness traditional Tibetan festivals, and trek
            through breathtaking arid valleys. The region remains one of Nepal’s
            best-kept secrets, accessible only through special trekking permits.
            Lo Manthang was the walled capital of the Kingdom of Lo from its
            founding in 1380 by Ame Pal who oversaw construction of the city
            wall and many of the still-standing structures. After the Shahs of
            Gorkha unified Nepal out of numerous petty kingdoms in the 18th
            century, Lo became a dependency but kept its hereditary rulers. This
            arrangement continued as long as Nepal remained a kingdom, until the
            country was declared a republic in 2008 and Jigme Dorje Palbar Bista
            was stripped of his title.[5] His suzerain King Gyanendra suffered
            the same fate, however the raja or gyelpo of Mustang was 25th in a
            direct line of rulers dating back to 1380 AD.
          </p>
          <img
            src={LoManthangMonastery}
            className="w-full md:w-[580px] h-[300px] md:h-[400px] rounded-xl shadow-md"
            alt="Lo Manthang Monastery"
          />
        </div>
      </motion.div>
      <DailyForecast />
      {/* Weather Destination added here */}

      {/* Use SentimentAnalysis Component */}
      <DestinationSentiment />
      <br />
      <br />

      <div className="max-w-7xl mx-auto flex justify-center items-center ">
        <ReviewCard />
      </div>
    </div>
  );
};

export default IndividualDestination;
