import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 60;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  
  const directionRef = useRef(direction);
  
  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (isGameOver) {
          resetGame();
        } else {
          setIsPaused(p => !p);
        }
        return;
      }

      if (isPaused || isGameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isGameOver]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [isPaused, isGameOver, food, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center w-full p-2 md:p-4">
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-lg md:text-xl font-pixel text-[#0ff] glitch-text" data-text="SECTOR_7G">
          SECTOR_7G
        </h2>
        <div className="text-lg md:text-xl font-pixel text-[#f0f] glitch-text" data-text={`PTS:${score.toString().padStart(4, '0')}`}>
          PTS:{score.toString().padStart(4, '0')}
        </div>
      </div>

      <div 
        className="relative bg-black border border-[#0ff] overflow-hidden"
        style={{
          width: '100%',
          aspectRatio: '1/1',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 pointer-events-none" 
             style={{
               backgroundImage: 'linear-gradient(to right, rgba(0,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,255,0.15) 1px, transparent 1px)',
               backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
             }}
        />

        {/* Food */}
        <div
          className="bg-[#0ff] animate-pulse"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            margin: '1px'
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`${isHead ? 'bg-[#fff]' : 'bg-[#f0f]'}`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                margin: '1px',
              }}
            />
          );
        })}

        {/* Overlays */}
        {(isPaused || isGameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 border-4 border-[#f0f] m-4">
            {isGameOver ? (
              <>
                <h3 className="text-2xl md:text-3xl font-pixel text-[#f0f] mb-4 glitch-text text-center" data-text="FATAL_ERROR">FATAL_ERROR</h3>
                <p className="text-[#0ff] mb-6 font-terminal text-xl md:text-2xl">&gt; SCORE: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-[#f0f] text-black font-pixel text-sm md:text-base hover:bg-[#0ff] transition-colors uppercase"
                >
                  [ REBOOT ]
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsPaused(false)}
                className="px-4 py-2 bg-[#0ff] text-black font-pixel text-sm md:text-base hover:bg-[#f0f] transition-colors uppercase"
              >
                [ INITIATE ]
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-[#f0f] text-xs md:text-sm font-tech flex flex-col w-full">
        <span>&gt; INPUT: [W,A,S,D] | [ARROWS]</span>
        <span>&gt; HALT: [SPACE]</span>
      </div>
    </div>
  );
}
