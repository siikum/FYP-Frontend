import React from "react";
import "./styles/Rara.css"; // Make sure this path is correct
import raraBackground from "../../assets/images/slider-destination/rara trail.jpg"; // Correct image path

const Rara = () => {
    return (
      <div className="rara-container">
        <div className="rara-header">
            <div className="background">
            <img src={raraBackground} alt="Rara Lake" className="background-image" />
            </div>
            <div className="card">
            <h2>Rara Lake, Mugu</h2>
            <p>Welcome to the mesmerizing Rara Lake, the largest and deepest freshwater lake in Nepal...</p>
            </div>
        </div>
      </div>
    );
  };
  

export default Rara;
