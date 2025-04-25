import React from "react";
import { HashLink } from "react-router-hash-link";

const Footer = () => {
  return (
    <footer className="bg-[#183029] text-[#d2e3dc] px-6 pt-16 pb-8 font-serif">
      {/* Hero CTA Section */}
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm tracking-widest uppercase text-[#9fbcb1] mb-2">
          One step closer to the mountains.
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Discover Hidden Trails
        </h2>
        {/* <p className="text-lg max-w-2xl mx-auto mb-8 text-[#bdd3c5]">
          Trail Himalaya helps you explore the unexplored with personalized treks, authentic reviews, and real-time weather — all in one place.
        </p> */}
        <br />
        <HashLink
          to="/About#contact"
          smooth
          className="bg-[#0B3D20] text-white px-6 py-3 rounded-full font-semibold hover:bg-green-900 transition"
        >
          Contact Us
        </HashLink>
        <br />
        <p className="text-xs text-[#9fbcb1] mt-4">
          &copy; {new Date().getFullYear()} Trail Himalaya
        </p>
      </div>

      {/* Divider */}
      <hr className="my-5 border-[#295b42]" />

      {/* Footer Nav */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-mm">
        {/* Logo */}
        <div className="text-xl font-extrabold tracking-wide">
          <span className="text-amber-50">Trail</span>
          <span className="text-[#b3cccd]">Himalaya</span>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-8">
          <a href="/blog" className="hover:underline">
            Blog
          </a>
          <a href="/channels" className="hover:underline">
            Channels
          </a>
          <a href="/TripPlannerForm" className="hover:underline">
            Itinerary
          </a>
          <HashLink
            to="/About#SafetyGuidlines"
            smooth
            className="hover:underline"
          >
            Safety Guidlines
          </HashLink>
          <HashLink
            to="/About#AboutUs"
            smooth
            className="hover:underline"
          >
            About Us
          </HashLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
