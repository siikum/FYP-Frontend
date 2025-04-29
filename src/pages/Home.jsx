import "../styles/home.css";
import Navbar from "../components/Navbar";
// import SentimentAnalysis from "../components/SentimentAnalysis";
import ReactPlayer from "react-player";
import Footer from "../components/Footer";
import Slider from "../components/Slider";
import TopDestination from "../components/TopDestinations";
import MultiLayerParallax from "./trial/MultiLayerParallax";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const ref = useRef(null);
  const navigate = useNavigate();

  const isInView = useInView(ref, { once: true });

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:8000/blog/blogposts/");
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        } else {
          console.error("Failed to fetch blogs");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <main className="bg-[#f3f8f6] font-serif">
      <MultiLayerParallax />
      <Navbar />

      {/* Explore Beyond Imagination Section */}
      <div className="explore-section w-full flex pr-250 py-10">
        <h1 className="font-serif text-3xl md:text-6xl font-bold text-left text-black leading-snug">
          A Window to <br />
          <span className="italic text-[#295b42]">New Adventures</span>
        </h1>
      </div>

      {/* Slider */}
      <div ref={ref} className="px-20">
        <Slider shouldAnimate={isInView} />
      </div>
      <br></br>
      {/* Featured Blogs */}
      <div className="px-20 py-12 bg-[#f3f8f6] font-serif">
        <h2 className="text-4xl font-bold text-[#0B3D20] mb-10">
          Our Stories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {blogs.slice(0, 3).map((blog) => (
            <div
              key={blog.id}
              onClick={() => navigate(`/blog/${blog.id}`)}
              className="min-h-[500px] cursor-pointer hover:shadow-lg transition duration-300 rounded-xl overflow-hidden bg-white"
            >
              <div className="h-[300px] overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full w-fit">
                  Blog
                </span>
                <h3 className="text-xl font-bold leading-snug">{blog.title}</h3>
                <div className="text-base text-gray-500 italic">
                  by {blog.author}
                </div>
                <br />
                <p className="text-gray-600 text-sm line-clamp-3">
                  {blog.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TopDestination />
      <Footer />
    </main>
  );
};

export default Home;
