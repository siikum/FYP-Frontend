import React from "react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import CreatorImage1 from "../assets/images/HemantaBhandari.png"; // replace with real images
import CreatorImage2 from "../assets/images/KanchanRai.jpg"; // replace with real images
import CreatorImage3 from "../assets/images/DivyaDhakal.png"; // replace with real images
import CreatorImage4 from "../assets/images/pallav.png"; // replace with real images

const creators = [
  {
    name: "Hemanta Bhandari",
    image: CreatorImage1,
    instagram: "https://www.instagram.com/nepal8thwonder_/",
    youtube: "https://www.youtube.com/@nepal8thwonder",
  },
  {
    name: "Kanchan Rai",
    image: CreatorImage2,
    instagram: "http://instagram.com/ghumante/",
    youtube: "https://www.youtube.com/@Ghumante",
  },
  {
    name: "Divya Dhakal",
    image: CreatorImage3,
    instagram: "https://www.instagram.com/divyadhakal_/",
    youtube: "https://www.youtube.com/@dhakaldivya",
  },
  {
    name: "Pallav",
    image: CreatorImage4, // Replace with a different image later
    instagram: "https://www.instagram.com/pallav.pp/",
    youtube: "https://www.youtube.com/@nomadpallav",
  },
];

const FeaturedCreators = () => {
  return (
    <section className="w-full bg-[#183029] text-amber-50 py-24">
      <div className="max-w-7xl mx-auto px-4 mb-3">
        <h2 className="text-5xl md:text-[60px] font-serif font-bold text-center mb-4">
          CREATORS OF NEPAL
        </h2>
        <p className="text-center italic text-lg md:text-xl text-[#d9e7d6] mt-4 max-w-3xl mx-auto mb-12">
        From mountain peaks to village streets, these creators capture the heart of Nepal — one story at a time.        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-18">
          {creators.map((creator, index) => (
            <div
              key={index}
              className="relative w-[340px] h-[700px] mx-auto overflow-hidden group"
            >
              <img
                src={creator.image}
                alt={creator.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300 space-y-3">
                <h3 className="text-white text-2xl font-bold">
                  {creator.name}
                </h3>
                <div className="flex gap-4">
                  <a href={creator.instagram} target="_blank" rel="noreferrer">
                    <FaInstagram className="text-white text-2xl hover:text-pink-400" />
                  </a>
                  <a href={creator.youtube} target="_blank" rel="noreferrer">
                    <FaYoutube className="text-white text-2xl hover:text-red-500" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCreators;
