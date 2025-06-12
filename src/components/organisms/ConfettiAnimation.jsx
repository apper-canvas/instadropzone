import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfettiAnimation = ({ showConfetti }) => {
  return (
    <AnimatePresence>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                rotate: 0,
                scale: 1
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: 360,
                scale: 0
              }}
              transition={{
                duration: 3,
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute w-3 h-3 gradient-secondary rounded-full"
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfettiAnimation;