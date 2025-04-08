import React from "react";
import { motion } from "framer-motion";
import BackgroundImage from "../assets/images/AboutImage1.jpg";
import Navbar from "../components/Navbar";
import AboutTrailHimalaya from "../components/AboutTrailHimalaya";
import FeaturedCreators from "../components/FeaturedCreators";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer"; 



const About = () => {
  return (
    <>
      {/* Landing Section */}
      <section className="relative w-full raleway h-screen overflow-hidden bg-[#0B3D20]">
        {/* Background Image */}
        <div className="absolute inset-0 z-10 border-4 border-[#0B3D20]">
          <img
            src={BackgroundImage}
            alt="Sustainable Nepal"
            className="w-full h-full object-cover animate-zoomSlow"
          />
        </div>

        {/* Navbar */}
        <div className="absolute top-0 left-0 w-full z-20">
          <Navbar />
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4"
        >
          <h1 className="text-4xl md:text-7xl font-serif font-bold leading-tight tracking-wide">
            Support a Sustainable <br className="hidden md:block" />
            Future
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl">
            Embrace conscious travel. Protect the pristine landscapes. Let
            nature breathe through your journey.
          </p>
        </motion.div>
      </section>

      {/* Scroll Section */}
      <AboutTrailHimalaya />
      <FeaturedCreators />

      {/* Safety Guidelines Section */}
      <section className="w-full bg-[#e6f1ec] text-[#0B3D20] py-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-serif font-bold text-center mb-16"
          >
            Travel Smart. Travel Safe.
          </motion.h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center mb-20">
            {[
              {
                icon: "🧭",
                number: "1,200+",
                label: "Trails with Local Guides",
              },
              {
                icon: "🏥",
                number: "50+",
                label: "Trekking Zone Health Posts",
              },
              { icon: "📞", number: "112", label: "Nepal Emergency Hotline" },
              {
                icon: "📶",
                number: "60%+",
                label: "Trails with Mobile Coverage",
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <div className="text-4xl">{stat.icon}</div>
                <div className="text-2xl font-bold mt-2">{stat.number}</div>
                <div className="mt-1 text-[#2e5b45]">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Guidelines Title */}
          <h3 className="text-2xl font-semibold mb-10 text-center">
            Guidelines for a Safer Journey
          </h3>

          {/* Guidelines: 2 cards with 3 items each */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {[
              [
                "Always check the weather forecast before departure",
                "Register your trek with local authorities when possible",
                "Carry a map, compass, or GPS tracking device",
              ],
              [
                "Respect altitude: acclimatize slowly to prevent AMS",
                "Keep emergency contacts written on paper & your phone",
                "Support local businesses and eco-friendly accommodation",
              ],
            ].map((group, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-md space-y-4"
              >
                {group.map((tip, i) => (
                  <div key={i} className="text-lg md:text-xl font-medium">
                    • {tip}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Emergency Contacts Title */}
          <h3 className="text-2xl font-semibold mb-10 text-center">
            Emergency Contacts
          </h3>

          {/* Emergency Contacts as Individual Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🚓", number: "100", label: "Police" },
              { icon: "🚑", number: "102", label: "Ambulance" },
              { icon: "📞", number: "1144", label: "Tourist Info" },
              { icon: "🆘", number: "+977-1-4442747", label: "Rescue" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <div className="text-4xl">{item.icon}</div>
                <div className="text-2xl font-bold mt-2">{item.label}</div>
                <div className="mt-1 text-[#2e5b45]">{item.number}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactUs />
      <Footer />
    </>
  );
};

export default About;
