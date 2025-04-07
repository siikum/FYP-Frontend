import React from "react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import CreatorImage from "../assets/images/creator1.jpg"; // replace with real images

const creators = [
  {
    name: "Ram Lama",
    image: CreatorImage,
    instagram: "https://instagram.com/ramlama",
    youtube: "https://youtube.com/@ramlama",
  },
  {
    name: "Sita Rai",
    image: CreatorImage,
    instagram: "https://instagram.com/sitarai",
    youtube: "https://youtube.com/@sitarai",
  },
  {
    name: "Bikash Gurung",
    image: CreatorImage,
    instagram: "https://instagram.com/bikashgurung",
    youtube: "https://youtube.com/@bikashgurung",
  },
];

const FeaturedCreators = () => {
  return (
    <section className="w-full bg-[#183029] text-amber-50 py-24">
      <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-5xl md:text-[80px] font-serif font-bold text-center mb-16">
      CREATORS OF NEPAL
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator, index) => (
            <div
              key={index}
              className="relative w-[900] h-[700px] overflow-hidden group "
            >
              <img
                src={creator.image}
                alt={creator.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300 space-y-3">
                <h3 className="text-white text-2xl font-bold">{creator.name}</h3>
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
