import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LoadingLoveProps {
  onComplete: () => void;
}

export function LoadingLove({ onComplete }: LoadingLoveProps) {
  const [displayPercent, setDisplayPercent] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    let current = 0;
    let phase: 'bar' | 'fast' | 'done' = 'bar';

    const timer = setInterval(() => {
      if (phase === 'bar') {
        // Phase 1: fill bar from 0 to 100
        current += Math.random() * 3 + 1;
        if (current >= 100) {
          current = 100;
          phase = 'fast';
        }
        setDisplayPercent(Math.round(current));
        setBarWidth(Math.min(current, 100));
      } else if (phase === 'fast') {
        // Phase 2: number keeps going up very fast, bar stays full
        current += Math.random() * 2000 + 500;
        if (current >= 99999) {
          current = 99999;
          phase = 'done';
        }
        setDisplayPercent(Math.round(current));
        setBarWidth(100);
      } else if (phase === 'done') {
        clearInterval(timer);
        if (!done.current) {
          done.current = true;
          setTimeout(() => onComplete(), 1200);
        }
      }
    }, phase === 'bar' ? 100 : 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/80 rounded-2xl shadow-xl backdrop-blur-sm max-w-md w-full text-center">
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="text-6xl mb-6"
      >
        ❤️
      </motion.div>

      <h2 className="text-3xl font-bold text-pink-600 mb-6">
        Kocham Cię na
      </h2>

      <div className="w-full bg-pink-100 rounded-full h-10 mb-4 overflow-hidden relative border-2 border-pink-300">
        <motion.div
          className="bg-gradient-to-r from-pink-400 via-red-400 to-red-500 h-full rounded-full flex items-center justify-center"
          initial={{ width: '0%' }}
          animate={{ width: `${barWidth}%` }}
          transition={{ duration: 0.15 }}
        >
          {barWidth > 15 && (
            <span className="text-white font-extrabold text-lg drop-shadow">
              {displayPercent >= 99999 ? '∞' : displayPercent}%
            </span>
          )}
        </motion.div>
      </div>

      {barWidth <= 15 && (
        <p className="text-xl font-bold text-pink-600">{displayPercent}%</p>
      )}

      {displayPercent >= 99999 && (
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-2xl font-bold text-pink-600 mt-2"
        >
          💖 ∞% 💖
        </motion.p>
      )}
    </div>
  );
}
