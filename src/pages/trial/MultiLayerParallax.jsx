import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import backgroundImg from "../../assets/images/mountain/back.jpg";
import backgroundBottom from "../../assets/images/mountain/front.png";

export default function MultiLayerParallax() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["-220%", "100%"]);

  return (
    <div
      ref={ref}
      className="w-full h-[120vh] overflow-hidden relative grid place-items-center"
    >
      {/* Centered Slogan */}
      <motion.h1
        style={{ y: textY }}
        className="font-serif font-bold mb-30 text-amber-50 text-3xl md:text-7xl relative z-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 1] }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.15 }}
      >
        Explore, Experience,{" "}
        <span className="text-[#083043] italic drop-shadow-md">Feel</span>
      </motion.h1>

      {/* Background Layers */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundPosition: "bottom",
          backgroundSize: "cover",
          y: backgroundY,
        }}
      />
      <div
        className="absolute inset-0 z-20"
        style={{
          backgroundImage: `url(${backgroundBottom})`,
          backgroundPosition: "bottom",
          backgroundSize: "cover",
        }}
      />

      {/* Top Right Quote */}
      {/* <div className="absolute top-35 left-4 text-[#FCD34D] font-serif font-semibold text-sm md:text-lg italic opacity-90 z-30 text-right">
        "Let the silence of the peaks tell your story."
      </div> */}
    </div>
  );
}
