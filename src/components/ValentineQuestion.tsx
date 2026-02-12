import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export function ValentineQuestion() {
  const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
  const [accepted, setAccepted] = useState(false);
  const [yesScale, setYesScale] = useState(1);
  const moveCount = useRef(0);

  const moveNoButton = () => {
    moveCount.current += 1;
    const range = Math.min(150 + moveCount.current * 30, 400);
    const x = (Math.random() - 0.5) * range * 2;
    const y = (Math.random() - 0.5) * range * 2;
    setNoBtnPosition({ x, y });
    setYesScale((prev) => Math.min(prev + 0.1, 2));
  };

  if (accepted) {
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 10 }}
        className="flex flex-col items-center justify-center p-8 bg-white/90 rounded-2xl shadow-2xl text-center max-w-lg"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-7xl mb-4"
        >
          💖
        </motion.div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-600 mb-4">
          WIEDZIAŁEM! ❤️
        </h1>
        <p className="text-2xl font-bold text-pink-600 mb-6">
          Kocham Cię najbardziej na świecie Oluś!
        </p>

        {/* Hearts scattered around */}
        <div className="flex flex-wrap justify-center gap-2 mb-4 text-3xl">
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }}>❤️</motion.span>
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.15 }}>💗</motion.span>
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}>💖</motion.span>
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.45 }}>💝</motion.span>
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.6 }}>💕</motion.span>
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.75 }}>💓</motion.span>
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.9 }}>💞</motion.span>
        </div>

        {/* Bouncing emojis from the main text */}
        <div className="flex gap-4 text-5xl">
          <motion.span animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}>❣️</motion.span>
          <motion.span animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}>😘</motion.span>
          <motion.span animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}>😍</motion.span>
          <motion.span animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.45 }}>💕</motion.span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/80 rounded-2xl shadow-xl backdrop-blur-sm max-w-md w-full text-center">
      <h1 className="text-3xl font-bold text-pink-600 mb-8">
        Czy będziesz moją Walentynką? 🌹
      </h1>

      <div className="flex gap-8 items-center justify-center w-full min-h-[200px] relative">
        <motion.button
          animate={{ scale: yesScale }}
          whileHover={{ scale: yesScale * 1.1 }}
          whileTap={{ scale: yesScale * 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-full shadow-lg text-xl z-20 cursor-pointer"
          onClick={() => setAccepted(true)}
        >
          TAK! 😍
        </motion.button>

        <motion.button
          animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          onMouseEnter={moveNoButton}
          onTouchStart={moveNoButton}
          onClick={moveNoButton}
          className="px-8 py-4 bg-red-500 text-white font-bold rounded-full shadow-lg text-lg cursor-pointer z-10 fixed-size"
          style={{ position: 'relative' }}
        >
          NIE 😢
        </motion.button>
      </div>
    </div>
  );
}
