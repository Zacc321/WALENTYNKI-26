import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LoadingLoveProps {
  onComplete: () => void;
}

const VISUAL_MAX = 100;
const FINAL_MAX = 99999;

export function LoadingLove({ onComplete }: LoadingLoveProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'filling' | 'counting'>('filling');
  const hasFired = useRef(false);

  useEffect(() => {
    if (phase === 'filling') {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= VISUAL_MAX) {
            clearInterval(timer);
            setPhase('counting');
            return VISUAL_MAX;
          }
          const increment = Math.random() * 3 + 1;
          return Math.min(Math.round(prev + increment), VISUAL_MAX);
        });
      }, 100);
      return () => clearInterval(timer);
    }

    if (phase === 'counting') {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= FINAL_MAX) {
            clearInterval(timer);
            return FINAL_MAX;
          }
          // Very fast counting
          const increment = Math.floor(Math.random() * 800 + 200);
          return Math.min(prev + increment, FINAL_MAX);
        });
      }, 30);
      return () => clearInterval(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (progress >= FINAL_MAX && !hasFired.current) {
      hasFired.current = true;
      setTimeout(onComplete, 1200);
    }
  }, [progress, onComplete]);

  const barWidth = Math.min((progress / VISUAL_MAX) * 100, 100);

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
              {progress}%
            </span>
          )}
        </motion.div>
      </div>

      {barWidth <= 15 && (
        <p className="text-xl font-bold text-pink-600">{progress}%</p>
      )}

      {progress >= FINAL_MAX && (
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
