import { useCallback, useEffect, useRef, useState } from 'react';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export const GRID_SIZE = 15;

const INITIAL_SPEED_MS = 220;
const MIN_SPEED_MS = 90;
const SPEED_STEP_MS = 3;
const POINTS_PER_SPEED_UP = 2;

const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

function toKey(pos: Position) {
  return `${pos.x},${pos.y}`;
}

function getInitialSnake(): Position[] {
  const mid = Math.floor(GRID_SIZE / 2);
  return [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
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

export function useSnakeGame() {
  const [snake, setSnake] = useState<Position[]>(getInitialSnake);
  const [food, setFood] = useState<Position>(() => randomEmptyCell(new Set(getInitialSnake().map(toKey))));
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction>('RIGHT');

  const setDirection = useCallback((direction: Direction) => {
    if (OPPOSITE[direction] === directionRef.current) return;
    nextDirectionRef.current = direction;
  }, []);

  const start = useCallback(() => {
    setHasStarted(true);
    setIsRunning(true);
  }, []);

  const reset = useCallback(() => {
    const initial = getInitialSnake();
    setSnake(initial);
    setFood(randomEmptyCell(new Set(initial.map(toKey))));
    setScore(0);
    setIsGameOver(false);
    setIsRunning(true);
    setHasStarted(true);
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
  }, []);

  const speed = Math.max(MIN_SPEED_MS, INITIAL_SPEED_MS - Math.floor(score / POINTS_PER_SPEED_UP) * SPEED_STEP_MS);

  useEffect(() => {
    if (!isRunning || isGameOver) return;

    const tick = () => {
      directionRef.current = nextDirectionRef.current;

      setSnake((prev) => {
        const head = prev[0];
        let newHead: Position = head;

        if (directionRef.current === 'UP') newHead = { x: head.x, y: head.y - 1 };
        if (directionRef.current === 'DOWN') newHead = { x: head.x, y: head.y + 1 };
        if (directionRef.current === 'LEFT') newHead = { x: head.x - 1, y: head.y };
        if (directionRef.current === 'RIGHT') newHead = { x: head.x + 1, y: head.y };

        const hitWall = newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE;
        const hitSelf = prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y);

        if (hitWall || hitSelf) {
          setIsGameOver(true);
          setIsRunning(false);
          return prev;
        }

        const ateFood = newHead.x === food.x && newHead.y === food.y;
        const nextBody = [newHead, ...prev];

        if (ateFood) {
          setScore((prevScore) => prevScore + 1);
          setFood(randomEmptyCell(new Set(nextBody.map(toKey))));
          return nextBody;
        }

        nextBody.pop();
        return nextBody;
      });
    };

    const interval = setInterval(tick, speed);
    return () => clearInterval(interval);
  }, [isRunning, isGameOver, food, speed]);

  return {
    snake,
    food,
    score,
    isGameOver,
    hasStarted,
    gridSize: GRID_SIZE,
    setDirection,
    start,
    reset,
  };
}
