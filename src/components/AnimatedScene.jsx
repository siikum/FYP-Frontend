import React from 'react';
import { ScrollContainer, ScrollPage, Animator, FadeOut, FadeIn } from 'react-scroll-motion';
import doorImage from '../assets/images/door-1.png'; // Adjust the path accordingly


const AnimatedScene = () => {
  return (
    <ScrollContainer>
      {/* First ScrollPage with FadeOut animation */}
      <ScrollPage>
        <Animator animation={FadeOut()}>
          <img
            src={doorImage}
            alt="First"
            style={{
              width: "400px",
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          />
        </Animator>
      </ScrollPage>

      {/* Second ScrollPage with FadeIn animation */}
      <ScrollPage>
        <Animator animation={FadeIn()}>
          <img
            src="../assets/images/door-2.png"
            alt="Second"
            style={{
              width: "400px",
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          />
        </Animator>
      </ScrollPage>

      {/* Optional third ScrollPage with more content */}
      <ScrollPage>
        <div style={{ fontSize: "30px", textAlign: "center" }}>
          Scroll more to see the next part!
        </div>
      </ScrollPage>
    </ScrollContainer>
  );
};

export default AnimatedScene;
