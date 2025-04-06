import React from "react";
import { motion } from "framer-motion";
import AboutTH from "../assets/images/AboutTH.jpg";

const AboutTrailHimalaya = () => {
  return (
    <section className="w-full h-[100vh] bg-amber-50 flex flex-col md:flex-row overflow-hidden">
      {/* Left Content */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-6 md:px-20 text-[#0B3D20]">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-8">
            About Trail <br /> Himalaya
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-xl">
            Trail Himalaya is a movement toward mindful and eco-conscious tourism.
            We promote hidden and underrated trails in Nepal to help preserve their cultural and natural heritage.
            Through real-time weather updates, custom itineraries, community reviews, and interactive maps,
            we empower travelers to explore responsibly and sustainably.
          </p>
          <button className="bg-[#0B3D20] text-white px-6 py-3 uppercase tracking-wide font-semibold text-sm hover:bg-green-900 transition-all duration-300">
            Discover More
          </button>
        </motion.div>
      </div>

      {/* Right Image */}
      <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="w-full md:w-1/2 h-full overflow-hidden"
    >
      <motion.img
        src={AboutTH}
        alt="Trail Himalaya"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="w-full h-full object-cover"
      />
    </motion.div>


    </section>
  );
};

export default AboutTrailHimalaya;
