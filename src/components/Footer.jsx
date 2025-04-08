import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#183029] text-[#d2e3dc] px-6 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Left Contact Info & Logo */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide font-serif text-white">
              <span className="text-amber-50">Trail</span>
              <span className="text-[#b3cccd]">Himalaya</span>
            </h1>
          </div>
          <div className="space-y-2 text-base">
            <p>☏ +977-9828839274</p>
            <p>⚲ Kathmandu, Nepal</p>
            <p>✉ info@trailhimalaya.com</p>
          </div>
        </div>

        {/* Right Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-base">
          <div>
            <h4 className="font-semibold mb-2 border-b border-[#d2e3dc] w-fit">Destinations</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Popular Routes</a></li>
              <li><a href="#" className="hover:underline">Hidden Gems</a></li>
              <li><a href="#" className="hover:underline">Map View</a></li>
              <li><a href="#" className="hover:underline">Weather Updates</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 border-b border-[#d2e3dc] w-fit">Info</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">News & Events</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 border-b border-[#d2e3dc] w-fit">Legal</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Use</a></li>
              <li><a href="#" className="hover:underline">Cookies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 border-b border-[#d2e3dc] w-fit">Community</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Blogs</a></li>
              <li><a href="#" className="hover:underline">Vloggers</a></li>
              <li><a href="#" className="hover:underline">Join Us</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 text-sm text-center text-[#9fbcb1] border-t border-[#295b42] pt-6">
        &copy; {new Date().getFullYear()} Trail Himalaya. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
