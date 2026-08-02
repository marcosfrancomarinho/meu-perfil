import { useCallback, useEffect, useRef, useState } from 'react';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export const GRID_SIZE = 15;

const INITIAL_SPEED_MS = 170;
const MIN_SPEED_MS = 75;
const SPEED_STEP_MS = 7;

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

export function useSnakeGame(techs: string[]) {
  const initialSnake = getInitialSnake();

  const [snake, setSnake] = useState<Position[]>(initialSnake);

  const [food, setFood] = useState<Position>(() => randomEmptyCell(new Set(initialSnake.map(toKey))));

  const [score, setScore] = useState(0);

  const [collectedTechs, setCollectedTechs] = useState<string[]>([]);

  const [isGameOver, setIsGameOver] = useState(false);

  const [isRunning, setIsRunning] = useState(false);

  const [hasStarted, setHasStarted] = useState(false);

  // Estado usado para renderizar a próxima tecnologia
  const [foodIndex, setFoodIndex] = useState(0);

  // Refs usados apenas pela lógica do jogo
  const directionRef = useRef<Direction>('RIGHT');

  const nextDirectionRef = useRef<Direction>('RIGHT');

  const foodIndexRef = useRef(0);

  const setDirection = useCallback((direction: Direction) => {
    if (OPPOSITE[direction] === directionRef.current) {
      return;
    }

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

    setCollectedTechs([]);

    setIsGameOver(false);

    setIsRunning(true);

    setHasStarted(true);

    directionRef.current = 'RIGHT';

    nextDirectionRef.current = 'RIGHT';

    foodIndexRef.current = 0;

    setFoodIndex(0);
  }, []);

  const speed = Math.max(MIN_SPEED_MS, INITIAL_SPEED_MS - score * SPEED_STEP_MS);

  useEffect(() => {
    if (!isRunning || isGameOver) {
      return;
    }

    const tick = () => {
      directionRef.current = nextDirectionRef.current;

      setSnake((prev) => {
        const head = prev[0];

        let newHead = head;

        switch (directionRef.current) {
          case 'UP':
            newHead = {
              x: head.x,
              y: head.y - 1,
            };
            break;

          case 'DOWN':
            newHead = {
              x: head.x,
              y: head.y + 1,
            };
            break;

          case 'LEFT':
            newHead = {
              x: head.x - 1,
              y: head.y,
            };
            break;

          case 'RIGHT':
            newHead = {
              x: head.x + 1,
              y: head.y,
            };
            break;
        }

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
          const tech = techs[foodIndexRef.current % techs.length];

          setCollectedTechs((prevTechs) => [...prevTechs, tech]);

          setScore((value) => value + 1);

          foodIndexRef.current += 1;

          setFoodIndex(foodIndexRef.current);

          setFood(randomEmptyCell(new Set(nextBody.map(toKey))));

          return nextBody;
        }

        nextBody.pop();

        return nextBody;
      });
    };

    const interval = setInterval(tick, speed);

    return () => clearInterval(interval);
  }, [isRunning, isGameOver, food, speed, techs]);

  // Agora leitura segura no render
  const nextTech = techs[foodIndex % techs.length];

  return {
    snake,

    food,

    score,

    collectedTechs,

    isGameOver,

    isRunning,

    hasStarted,

    nextTech,

    gridSize: GRID_SIZE,

    setDirection,

    start,

    reset,
  };
}
