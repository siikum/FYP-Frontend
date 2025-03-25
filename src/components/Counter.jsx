import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Counter = ({ initialValue, finalValue, duration }) => {
  const count = useMotionValue(initialValue);
  let rounded = useTransform(count, Math.round);
  const counterContainer = useRef(null);
  const isInView = useInView(counterContainer, { once: true });

  const [isFinalValue, setIsFinalValue] = useState(false);

  const runAnimation = async () => {
    if (isInView) {
      await animate(count, finalValue, { duration: duration });
      setIsFinalValue(true);
    }
  };

  useEffect(() => {
    if (isInView) {
      runAnimation();
    }
  }, [isInView]);

  return (
    <motion.span ref={counterContainer}>
      {!isFinalValue ? rounded : finalValue.toLocaleString("en-US")}
    </motion.span>
  );
};

export default Counter;
