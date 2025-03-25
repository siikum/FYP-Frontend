import gsap from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import '../styles/ScrollAnimation.css';

function ScrollAnimation() {
  const ref = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!ref.current) return; // Ensure ref is available

    const sections = ref.current.querySelectorAll(".first, .second, .third");

    sections.forEach((section) => {
      gsap.from(section, {
        y: -50,
        autoAlpha: 0,
        scale: 0.5,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
          end: "bottom 10%",
          scrub: true,
        },
      });
    });
  }, [ref]); // Add ref as a dependency

  return (
    <div ref={ref}>
      <div className="first">First Section</div>
      <div className="second">Second Section</div>
      <div className="third">Third Section</div>
    </div>
  );
}

export default ScrollAnimation;
