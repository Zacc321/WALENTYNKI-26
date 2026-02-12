import { useState, useEffect, useCallback, useRef } from 'react';
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

function isSolved(tiles: number[]): boolean {
  return tiles.every((tile, index) => tile === index);
}

export function CaptchaPuzzle({ onSolve }: CaptchaPuzzleProps) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [imageReady, setImageReady] = useState(false);

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  // Touch drag state
  const touchStartIndex = useRef<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [draggingTouchIndex, setDraggingTouchIndex] = useState<number | null>(null);
  const [touchOffset, setTouchOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageReady(true);
    img.onerror = () => setImageReady(true);
    img.src = IMAGE_URL;
    const fallback = setTimeout(() => setImageReady(true), 3000);
    return () => clearTimeout(fallback);
  }, []);

  useEffect(() => {
    let shuffled: number[];
    const base = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);
    do {
      shuffled = shuffleArray(base);
    } while (isSolved(shuffled));
    setTiles(shuffled);
  }, []);

  const handleSolvedPuzzle = useCallback(() => {
    setSolved(true);
    const timer = setTimeout(() => {
      onSolve();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onSolve]);

  const swapTiles = useCallback((fromIndex: number, toIndex: number) => {
    if (solved || fromIndex === toIndex) return;
    setTiles(prev => {
      const newTiles = [...prev];
      [newTiles[fromIndex], newTiles[toIndex]] = [newTiles[toIndex], newTiles[fromIndex]];
      if (isSolved(newTiles)) {
        handleSolvedPuzzle();
      }
      return newTiles;
    });
  }, [solved, handleSolvedPuzzle]);

  // --- Desktop Drag & Drop ---
  const handleDragStart = (index: number) => {
    if (solved) return;
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setOverIndex(index);
  };

  const handleDragLeave = () => {
    setOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (dragIndex !== null) {
      swapTiles(dragIndex, toIndex);
    }
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  // --- Touch Drag & Drop ---
  const getTileIndexFromPoint = (x: number, y: number): number | null => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const gap = 4; // gap-1 = 0.25rem = 4px
    const padding = 4; // p-1 = 0.25rem = 4px
    const innerW = rect.width - padding * 2;
    const innerH = rect.height - padding * 2;
    const tileW = (innerW - gap * (GRID_SIZE - 1)) / GRID_SIZE;
    const tileH = (innerH - gap * (GRID_SIZE - 1)) / GRID_SIZE;
    const localX = x - rect.left - padding;
    const localY = y - rect.top - padding;
    const col = Math.floor(localX / (tileW + gap));
    const row = Math.floor(localY / (tileH + gap));
    if (col < 0 || col >= GRID_SIZE || row < 0 || row >= GRID_SIZE) return null;
    return row * GRID_SIZE + col;
  };

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    if (solved) return;
    e.preventDefault();
    touchStartIndex.current = index;
    setDraggingTouchIndex(index);
    const touch = e.touches[0];
    setTouchOffset({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartIndex.current === null) return;
    e.preventDefault();
    const touch = e.touches[0];
    setTouchOffset({ x: touch.clientX, y: touch.clientY });
    const idx = getTileIndexFromPoint(touch.clientX, touch.clientY);
    setOverIndex(idx);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartIndex.current === null) return;
    e.preventDefault();
    const touch = e.changedTouches[0];
    const toIndex = getTileIndexFromPoint(touch.clientX, touch.clientY);
    if (toIndex !== null && touchStartIndex.current !== null) {
      swapTiles(touchStartIndex.current, toIndex);
    }
    touchStartIndex.current = null;
    setDraggingTouchIndex(null);
    setOverIndex(null);
  };

  if (!imageReady || tiles.length === 0) {
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
        ref={gridRef}
        className="grid gap-1 bg-pink-200 p-1 rounded-lg relative select-none"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: '300px',
          height: '300px',
          touchAction: 'none',
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {tiles.map((tileNumber, index) => {
          const row = Math.floor(tileNumber / GRID_SIZE);
          const col = tileNumber % GRID_SIZE;
          const bgX = (col * 100) / (GRID_SIZE - 1);
          const bgY = (row * 100) / (GRID_SIZE - 1);

          const isDragging = dragIndex === index || draggingTouchIndex === index;
          const isOver = overIndex === index && !isDragging;

          return (
            <motion.div
              key={`tile-${index}`}
              draggable={!solved}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e as unknown as React.DragEvent, index)}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => handleTouchStart(e, index)}
              className={`
                cursor-grab active:cursor-grabbing overflow-hidden rounded-sm border-2 transition-all
                ${isDragging ? 'opacity-50 border-pink-500 scale-95' : ''}
                ${isOver ? 'border-pink-400 scale-105 brightness-110' : 'border-transparent'}
                ${solved ? 'border-transparent' : ''}
              `}
              style={{
                backgroundImage: `url(${IMAGE_URL})`,
                backgroundSize: `${GRID_SIZE * 100}%`,
                backgroundPosition: `${bgX}% ${bgY}%`,
              }}
              whileHover={!solved && !isDragging ? { scale: 0.97 } : {}}
            />
          );
        })}

        {solved && (
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

      {/* Label below image */}
      <p className="mt-3 text-pink-500 font-semibold text-lg">Ułóż obrazek 🧩</p>

      {/* Checkbox */}
      <div className="mt-4 flex items-center gap-3 bg-pink-50 border-2 border-pink-300 rounded-xl px-5 py-3">
        <div className={`w-6 h-6 rounded border-2 border-pink-400 flex items-center justify-center transition-all ${solved ? 'bg-pink-500' : 'bg-white'}`}>
          {solved && <span className="text-white text-sm font-bold">✓</span>}
        </div>
        <span className="text-pink-700 font-semibold text-lg">Kocham Cię❣️</span>
      </div>

      {/* Touch drag ghost indicator */}
      {draggingTouchIndex !== null && (
        <div
          className="fixed pointer-events-none z-50 rounded-sm border-2 border-pink-500 opacity-80"
          style={{
            width: '96px',
            height: '96px',
            left: touchOffset.x - 48,
            top: touchOffset.y - 48,
            backgroundImage: `url(${IMAGE_URL})`,
            backgroundSize: `${GRID_SIZE * 100}%`,
            backgroundPosition: (() => {
              const tn = tiles[draggingTouchIndex];
              const r = Math.floor(tn / GRID_SIZE);
              const c = tn % GRID_SIZE;
              return `${(c * 100) / (GRID_SIZE - 1)}% ${(r * 100) / (GRID_SIZE - 1)}%`;
            })(),
          }}
        />
      )}
    </div>
  );
}
