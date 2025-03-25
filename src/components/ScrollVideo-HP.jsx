import gsap from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import '../styles/ScrollVideo-HP.css';

function ScrollVideo() {
  const ref = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!ref.current) return;

    const sections = ref.current.querySelectorAll(".video-section");

    sections.forEach((section, index) => {
      gsap.fromTo(
        section,
        { opacity: 0, scale: 0.9 }, // Start small and transparent
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "bottom center",
            scrub: true, // Smooth transition
            pin: true, // Hold each video in place
          },
        }
      );
    });
  }, []);

  return (
    <div ref={ref} className="video-container">
      <div className="video-section">
        <video autoPlay loop muted>
          <source src="/assets/videos/humla-1.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="video-section">
        <video autoPlay loop muted>
          <source src="/assets/videos/manag-pt-1.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="video-section">
        <video autoPlay loop muted>
          <source src="/assets/videos/manang-pt-2.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="video-section">
        <video autoPlay loop muted>
          <source src="/assets/videos/terai.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export default ScrollVideo;
