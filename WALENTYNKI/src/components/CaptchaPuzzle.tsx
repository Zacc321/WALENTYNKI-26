import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface CaptchaPuzzleProps {
  onSolve: () => void;
}

const GRID_SIZE = 3;
const IMAGE_URL = "https://i.postimg.cc/Hxb2Wc1F/OLA.png";

function shuffleArray(arr: number[]): number[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function checkSolved(tiles: number[]): boolean {
  return tiles.every((tile, index) => tile === index);
}

export function CaptchaPuzzle({ onSolve }: CaptchaPuzzleProps) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true);
    img.src = IMAGE_URL;
  }, []);

  useEffect(() => {
    let shuffled: number[];
    const base = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);
    do {
      shuffled = shuffleArray(base);
    } while (checkSolved(shuffled));
    setTiles(shuffled);
  }, []);

  const handleSolved = useCallback(() => {
    setIsSolved(true);
    setTimeout(() => {
      onSolve();
    }, 1200);
  }, [onSolve]);

  const handleTileClick = (index: number) => {
    if (isSolved) return;

    if (selectedTileIndex === null) {
      setSelectedTileIndex(index);
    } else {
      if (selectedTileIndex === index) {
        setSelectedTileIndex(null);
        return;
      }
      const newTiles = [...tiles];
      [newTiles[index], newTiles[selectedTileIndex]] = [newTiles[selectedTileIndex], newTiles[index]];
      setTiles(newTiles);
      setSelectedTileIndex(null);

      if (checkSolved(newTiles)) {
        handleSolved();
      }
    }
  };

  if (!imageLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/80 rounded-2xl shadow-xl backdrop-blur-sm max-w-md w-full">
        <div className="text-4xl animate-pulse mb-4">❤️</div>
        <p className="text-pink-600 font-bold">Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/80 rounded-2xl shadow-xl backdrop-blur-sm max-w-md w-full">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">
        Potwierdź że to Ty kochanie💖💕
      </h2>

      <div
        className="grid gap-1 bg-pink-200 p-1 rounded-lg relative"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: '300px',
          height: '300px',
        }}
      >
        {tiles.map((tileNumber, index) => {
          const row = Math.floor(tileNumber / GRID_SIZE);
          const col = tileNumber % GRID_SIZE;
          const bgX = (col * 100) / (GRID_SIZE - 1);
          const bgY = (row * 100) / (GRID_SIZE - 1);

          return (
            <motion.div
              key={`tile-${index}`}
              onClick={() => handleTileClick(index)}
              className={`
                cursor-pointer overflow-hidden rounded-sm border-2 transition-all
                ${selectedTileIndex === index ? 'border-pink-500 scale-95 brightness-110' : 'border-transparent'}
                ${isSolved ? 'border-transparent' : ''}
              `}
              style={{
                backgroundImage: `url(${IMAGE_URL})`,
                backgroundSize: `${GRID_SIZE * 100}%`,
                backgroundPosition: `${bgX}% ${bgY}%`,
              }}
              whileHover={!isSolved ? { scale: 0.95 } : {}}
              whileTap={!isSolved ? { scale: 0.9 } : {}}
            />
          );
        })}

        {isSolved && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-pink-500/50 rounded-lg z-20"
          >
            <span className="text-white text-3xl font-bold drop-shadow-lg">
              Brawo! 🎉
            </span>
          </motion.div>
        )}
      </div>

      {/* "Nie jestem robotem" style checkbox */}
      <div className="mt-5 flex items-center gap-3 bg-pink-50 border-2 border-pink-300 rounded-xl px-5 py-3">
        <div className={`w-6 h-6 rounded border-2 border-pink-400 flex items-center justify-center transition-all ${isSolved ? 'bg-pink-500' : 'bg-white'}`}>
          {isSolved && <span className="text-white text-sm font-bold">✓</span>}
        </div>
        <span className="text-pink-700 font-semibold text-lg">Kocham Cię❣️</span>
      </div>
    </div>
  );
}
