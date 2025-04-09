import "../styles/home.css";
import Navbar from "../components/Navbar";
// import SentimentAnalysis from "../components/SentimentAnalysis";
import ReactPlayer from "react-player";
import Footer from "../components/Footer"; 
import Slider from "../components/Slider";
import TopDestination from "../components/TopDestinations"; // Import Slider
import MultiLayerParallax from "./trial/MultiLayerParallax";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import firstIMG from "../assets/images/1.jpg";


const Home = () => {
  const ref = useRef(null);

  const isInView = useInView(ref, { once: true });

  const [currentImg, setCurrentIMG] = useState(firstIMG);

  return (
    <main className="bg-amber-50 raleway">
      
      <MultiLayerParallax />
      <Navbar />

      {/* Explore Beyond Imagination Section */}
      <div className="explore-section w-full flex px-20">
        <motion.h1
          ref={ref}
          viewport={{ once: true }}
          initial={{
            opacity: 0,
            x: "-100%",
            visibility: "hidden",
          }}
          whileInView={{
            visibility: "visible",
            opacity: [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 1],
            x: "75%",
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            delay: 0.15,
          }}
          className="explore-heading"
        >
          Explore Worlds <br />
          Beyond Imagination
        </motion.h1>
      </div>
      {/* Slider added here */}
      <div className="px-20">
        <Slider shouldAnimate={isInView} />
      </div>
      <div className="home-header">
        {/* <h1>
            Moments
            <br />
            to share
          </h1> */}
      </div>


      <TopDestination />

      {/* Footer added here */}
      <Footer />
    </main>
  );
};

export default Home;
