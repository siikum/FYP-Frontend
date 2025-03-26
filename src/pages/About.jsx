import React from "react";
import "../styles/Fall.css";
import Leaf1 from "../assets/images/leaf/leaf 1.png";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

function App() {
  const leafCount = 6; // The number of leaves you want falling

  // Function to generate random position and delay
  const getRandomPosition = () => {
    return Math.random() * 100; // Random left position between 0% and 100%
  };

  const getRandomDuration = () => {
    return Math.random() * 3 + 5; // Random duration between 5s and 8s
  };

  const getRandomDelay = () => {
    return Math.random() * 2 + 0; // Random delay between 0s and 2s
  };

  return (
    <div className="relative min-h-screen bg-beige-100 overflow-hidden">
      <Navbar />
      {/* Falling Leaves */}
      {Array.from({ length: leafCount }).map((_, index) => (
        <motion.img
          key={index}
          src={Leaf1}
          initial={{ y: -400, x: getRandomPosition() + "%" }}
          alt="Falling Leaf"
          className="leaf absolute top-0 fall-animation"
          style={{
            left: `${getRandomPosition}%`,
            animationDuration: `${getRandomDuration()}s`,
            animationDelay: `${getRandomDelay()}s`,
          }}
        />
      ))}

      {/* Slogan in the center */}
      <div
        className="absolute inset-0 flex items-center justify-center text-4xl font-bold px-6 py-4"
        style={{ color: "#013220" }}
      >
        <p className="text-center text-6xl">
          Promote Sustainable Travel, <br />
          Support Local Economy.
        </p>
      </div>
    </div>
  );
}

export default App;
