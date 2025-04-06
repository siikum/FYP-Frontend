import React from "react";
import { motion } from "framer-motion";
import BackgroundImage from "../assets/images/AboutImage1.jpg";
import Navbar from "../components/Navbar";
import AboutTrailHimalaya from "../components/AboutTrailHimalaya";

const About = () => {
  return (
    <>
      {/* Landing Section */}
      <section className="relative w-full raleway h-screen overflow-hidden bg-[#0B3D20]">
        {/* Background Image */}
        <div className="absolute inset-0 z-10 border-4 border-[#0B3D20]">
          <img
            src={BackgroundImage}
            alt="Sustainable Nepal"
            className="w-full h-full object-cover animate-zoomSlow"
          />
        </div>

        {/* Navbar */}
        <div className="absolute top-0 left-0 w-full z-20">
          <Navbar />
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4"
        >
          <h1 className="text-4xl md:text-7xl font-serif font-bold leading-tight tracking-wide">
            Support a Sustainable <br className="hidden md:block" />
            Future
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl">
            Embrace conscious travel. Protect the pristine landscapes. Let nature
            breathe through your journey.
          </p>
        </motion.div>
      </section>

      {/* Scroll Section */}
      <AboutTrailHimalaya />
    </>
  );
};

export default About;
