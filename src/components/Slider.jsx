import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/slider.css";
import singlaMane from "../assets/images/slider-destination/Singla-mane.jpg";
import apiHimal from "../assets/images/slider-destination/api-himal.jpg";
import shivaDhara from "../assets/images/slider-destination/shivav-dhara.jpg";
import tsumValley from "../assets/images/slider-destination/tsum-valley.jpg";
import limiValley from "../assets/images/slider-destination/limi-valley.jpg";
import sheyPhoksundo from "../assets/images/slider-destination/shey-phoksundo.jpg";
import { motion } from "framer-motion";

const Slider = ({ shouldAnimate }) => {
  const sliderRef = useRef();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const navigate = useNavigate();

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    sliderRef.current.scrollLeft += 400;
  }, []);

  const destinations = [
    { name: "Singla Mane, Rasuwa", path: "singla-mane", image: singlaMane },
    { name: "Api Himal Base Camp, Darchula", path: "api-himal-base-camp", image: apiHimal },
    { name: "Shiva Dhara, Solukhumbu", path: "shiva-dhara", image: shivaDhara },
    { name: "Tsum Valley, Gorkha", path: "tsum-valley", image: tsumValley },
    { name: "Limi Valley, Humla", path: "limi-valley", image: limiValley },
    { name: "Shey Phoksundo Lake, Dolpa", path: "shey-phoksundo-lake", image: sheyPhoksundo },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{
        opacity: shouldAnimate && [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 1],
        y: shouldAnimate && "0",
      }}
      transition={{ duration: 2, ease: "easeInOut", delay: 0.15 }}
      className="slider-container"
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {destinations.map((destination, index) => (
        <div
          key={index}
          className="slider-box"
          onClick={() => navigate(`/destination/${destination.path}`)}
          style={{ cursor: "pointer" }}
        >
          <div className="text">{destination.name}</div>
          <img src={destination.image} alt={destination.name} />
        </div>
      ))}
    </motion.div>
  );
};

export default Slider;
