import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import ReactPlayer from "react-player";

export default function Random() {
  const container = useRef();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10vh", "10vh"]);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="w-full h-full flex items-center justify-center text-7xl font-bold">
        Dive in the <br />
        beauty of Nepal
      </div>
      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full">
        <motion.div style={{ y }} className="relative w-full h-full">
          <ReactPlayer
            url="/assets/videos/c1.mp4"
            className="w-screen min-h-screen flex object-cover"
            playing
            width={"100%"}
            muted
            loop
          />
        </motion.div>
      </div>
    </div>
  );
}
