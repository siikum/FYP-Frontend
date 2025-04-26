import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/slider.css";
import singlaMane from "../assets/images/slider-destination/Singla-mane.jpg";
import apiHimal from "../assets/images/slider-destination/api-himal.jpg";
import shivaDhara from "../assets/images/slider-destination/shivadhara.jpg";
import tsumValley from "../assets/images/slider-destination/tsumvalley.jpg";
import limiValley from "../assets/images/slider-destination/limi-valley.jpg";
import sheyPhoksundo from "../assets/images/slider-destination/shey-phoksundo.jpg";
import sekonglake from "../assets/images/slider-destination/sekonglake.jpg";
import dlp from "../assets/images/slider-destination/dlp.jpg";
import kailashparbhat from "../assets/images/slider-destination/kailashparbhat.jpg";
import mundhunmTrail from "../assets/images/slider-destination/mundhumTrail.jpg";
import bara from "../assets/images/slider-destination/bara.png";
import tshoRolpa from "../assets/images/slider-destination/tshoRolpa.jpg";
import kbc from "../assets/images/slider-destination/kbc.jpg";
import lomanthang from "../assets/images/slider-destination/lomanthang.jpg";



const Slider = () => {
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
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    sliderRef.current.scrollLeft += 400;
  }, []);

  const destinations = [
    { name: "Sekong Lake, Mustang", path: "sekong-lake", image: sekonglake },
    { name: "Kanchenjunga  Base Camp, Taplejung", path: "kbc", image: kbc },
    { name: "Kailash Mansarovar, Humla", path: "kailash-overland", image: kailashparbhat },
    { name: "Limi Valley, Humla", path: "limi-valley", image: limiValley },
    { name: "Mainali Farm House, Bara", path: "bara", image: bara },
    { name: "Mundhum Trail, Khotang", path: "mundhum-trail", image: mundhunmTrail },
    { name: "Lo-manthang, Upper Mustang", path: "lomanthang", image: lomanthang },
    { name: "Daphne Lagna Pass, Rukum", path: "daphne-lagna-pass", image: dlp },
    { name: "Api Himal Base Camp, Darchula", path: "api-himal-base-camp", image: apiHimal },
    { name: "Shiva Dhara, Solukhumbu", path: "shiva-dhara", image: shivaDhara },
    { name: "Shey Phoksundo Lake, Dolpa", path: "shey-phoksundo-lake", image: sheyPhoksundo },
    { name: "Singla Mane, Rasuwa", path: "singla-mane", image: singlaMane },
    { name: "Tsum Valley, Gorkha", path: "tsum-valley", image: tsumValley },
    { name: "Tsho Rolpa, Dolakha", path: "tsho-rolpa", image: tshoRolpa },
  ];

  return (
    <div
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
    </div>
  );
};

export default Slider;
