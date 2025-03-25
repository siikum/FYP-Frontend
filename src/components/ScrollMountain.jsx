import { motion, useAnimate, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useRef } from "react";
import "../styles/ScrollMountain.css"; // New CSS file
import imageFullIMG from "../assets/images/mountain/front.png";
import imageaBottomIMG from "../assets/images/mountain/back.jpg";

export default function ScrollMountain() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["500px", "100%", "200%"]
  );
  const textY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["0%", "100%", "200%"]
  );

  console.log("bacl", backgroundY);
  const scaleValue = useTransform(
    scrollYProgress,
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  );

  useEffect(() => {
    scaleValue.get((latest) => {
      console.log("latest", latest);
    });
  }, [scaleValue]);

  return (
    <div ref={ref} className="scroll-container">
      <motion.h1
        style={{
          y: backgroundY,
          scale: textY,
          visibility: textY,
          fontSize: "81px",
        }}
        initial={{ visibility: 0 }}
        className="scroll-title"
      >
        {scaleValue.get()}
      </motion.h1>

      <motion.div
        className="scroll-background"
        style={{
          backgroundImage: `url(${imageFullIMG})`,
          y: backgroundY,
        }}
      />
      <div
        className="scroll-foreground"
        style={{
          backgroundImage: `url(${imageaBottomIMG})`,
        }}
      />
    </div>
  );
}
