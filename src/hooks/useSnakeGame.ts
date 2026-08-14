import { useCallback, useEffect, useRef, useState } from 'react';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export const GRID_SIZE = 15;

const INITIAL_SPEED_MS = 220;
const MIN_SPEED_MS = 90;
const SPEED_STEP_MS = 8;
const POINTS_PER_LEVEL = 3;
const HIGH_SCORE_KEY = 'meu-perfil:snake-high-score';

const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

function toKey(position: Position) {
  return `${position.x},${position.y}`;
}

function getInitialSnake(): Position[] {
  const middle = Math.floor(GRID_SIZE / 2);

  return [
    { x: middle, y: middle },
    { x: middle - 1, y: middle },
    { x: middle - 2, y: middle },
  ];
}

function randomEmptyCell(occupied: Set<string>): Position {
  let position: Position;

  do {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (occupied.has(toKey(position)));

  return position;
}

function getStoredHighScore() {
  const storedValue = Number(window.localStorage.getItem(HIGH_SCORE_KEY));
  return Number.isFinite(storedValue) && storedValue > 0 ? storedValue : 0;
}

export function useSnakeGame() {
  const [snake, setSnake] = useState<Position[]>(getInitialSnake);
  const [food, setFood] = useState<Position>(() => randomEmptyCell(new Set(getInitialSnake().map(toKey))));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getStoredHighScore);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction>('RIGHT');

  const level = Math.floor(score / POINTS_PER_LEVEL) + 1;
  const speed = Math.max(MIN_SPEED_MS, INITIAL_SPEED_MS - (level - 1) * SPEED_STEP_MS);
  const isPaused = hasStarted && !isRunning && !isGameOver;

  const setDirection = useCallback((direction: Direction) => {
    if (OPPOSITE[direction] === directionRef.current) return;
    nextDirectionRef.current = direction;
  }, []);

  const start = useCallback(() => {
    setHasStarted(true);
    setIsRunning(true);
  }, []);

  const togglePause = useCallback(() => {
    setIsRunning((current) => {
      if (!hasStarted || isGameOver) return current;
      return !current;
    });
  }, [hasStarted, isGameOver]);

  const reset = useCallback(() => {
    const initialSnake = getInitialSnake();

    setSnake(initialSnake);
    setFood(randomEmptyCell(new Set(initialSnake.map(toKey))));
    setScore(0);
    setIsGameOver(false);
    setIsRunning(true);
    setHasStarted(true);
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
  }, []);

  useEffect(() => {
    function pauseWhenPageIsHidden() {
      if (document.hidden) setIsRunning(false);
    }

    document.addEventListener('visibilitychange', pauseWhenPageIsHidden);
    return () => document.removeEventListener('visibilitychange', pauseWhenPageIsHidden);
  }, []);

  useEffect(() => {
    if (!isRunning || isGameOver) return;

    const tick = () => {
      directionRef.current = nextDirectionRef.current;

      setSnake((previousSnake) => {
        const head = previousSnake[0];
        let newHead = head;

        if (directionRef.current === 'UP') newHead = { x: head.x, y: head.y - 1 };
        if (directionRef.current === 'DOWN') newHead = { x: head.x, y: head.y + 1 };
        if (directionRef.current === 'LEFT') newHead = { x: head.x - 1, y: head.y };
        if (directionRef.current === 'RIGHT') newHead = { x: head.x + 1, y: head.y };

        const hitWall =
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE;

        const ateFood = newHead.x === food.x && newHead.y === food.y;
        const bodyToCheck = ateFood ? previousSnake : previousSnake.slice(0, -1);
        const hitSelf = bodyToCheck.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y,
        );

        if (hitWall || hitSelf) {
          setIsGameOver(true);
          setIsRunning(false);
          return previousSnake;
        }

        const nextSnake = [newHead, ...previousSnake];

        if (ateFood) {
          setScore((currentScore) => {
            const nextScore = currentScore + 1;

            setHighScore((currentHighScore) => {
              const nextHighScore = Math.max(currentHighScore, nextScore);
              window.localStorage.setItem(HIGH_SCORE_KEY, String(nextHighScore));
              return nextHighScore;
            });

            return nextScore;
          });

          setFood(randomEmptyCell(new Set(nextSnake.map(toKey))));
          return nextSnake;
        }

        nextSnake.pop();
        return nextSnake;
      });
    };

    const interval = window.setInterval(tick, speed);
    return () => window.clearInterval(interval);
  }, [food, isGameOver, isRunning, speed]);

  return {
    snake,
    food,
    score,
    highScore,
    level,
    isGameOver,
    isPaused,
    hasStarted,
    gridSize: GRID_SIZE,
    setDirection,
    start,
    togglePause,
    reset,
  };
}
