import { motion } from "framer-motion";

function AnimatedSection({
    children, delay = 0,
    duration = 0.6,
    y = 40,
    scale = 0.97, }) {

  return (
    <motion.div
      initial={{opacity: 0, y, scale,}}
      whileInView={{opacity: 1,y: 0, scale: 1,}}
      viewport={{once: false, amount: 0.3,}}
      transition={{duration, delay, ease: "easeOut",}}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedSection;