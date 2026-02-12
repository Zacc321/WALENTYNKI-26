import { useState, useCallback } from 'react';
import { CaptchaPuzzle } from './components/CaptchaPuzzle';
import { LoadingLove } from './components/LoadingLove';
import { ValentineQuestion } from './components/ValentineQuestion';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'puzzle' | 'loading' | 'question';

export function App() {
  const [step, setStep] = useState<Step>('puzzle');

  const goToLoading = useCallback(() => {
    setStep('loading');
  }, []);

  const goToQuestion = useCallback(() => {
    setStep('question');
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['❤️', '💖', '💕', '💗', '💝', '💘', '♥️', '💞'].map((heart, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-500/20"
            style={{
              fontSize: `${20 + Math.random() * 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random() * 3,
              delay: Math.random() * 2,
            }}
          >
            {heart}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'puzzle' && (
          <motion.div
            key="puzzle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="z-10 w-full flex justify-center"
          >
            <CaptchaPuzzle onSolve={goToLoading} />
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="z-10 w-full flex justify-center"
          >
            <LoadingLove onComplete={goToQuestion} />
          </motion.div>
        )}

        {step === 'question' && (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="z-10 w-full flex justify-center"
          >
            <ValentineQuestion />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
