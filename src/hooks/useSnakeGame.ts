import { useCallback, useEffect, useRef, useState } from 'react';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type RewardId = 'starter' | 'blue-skin' | 'master' | 'golden-food';

export interface Position {
  x: number;
  y: number;
}

export interface SnakeReward {
  id: RewardId;
  score: number;
  title: string;
  description: string;
}

export const GRID_SIZE = 15;

const INITIAL_SPEED_MS = 220;
const MIN_SPEED_MS = 90;
const SPEED_STEP_MS = 8;
const POINTS_PER_LEVEL = 3;
const HIGH_SCORE_KEY = 'meu-perfil:snake-high-score';
const REWARDS_KEY = 'meu-perfil:snake-rewards';

const REWARDS: SnakeReward[] = [
  {
    id: 'starter',
    score: 5,
    title: 'Começando bem!',
    description: 'Você conquistou seus primeiros 5 pontos.',
  },
  {
    id: 'blue-skin',
    score: 10,
    title: 'Cobrinha azul desbloqueada!',
    description: 'Uma nova cor já está disponível.',
  },
  {
    id: 'master',
    score: 20,
    title: 'Mestre da Cobrinha!',
    description: 'A cobrinha violeta foi desbloqueada.',
  },
  {
    id: 'golden-food',
    score: 30,
    title: 'Comida dourada!',
    description: 'Pegue o bônus especial para ganhar 3 pontos.',
  },
];

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

function getStoredRewards(): RewardId[] {
  try {
    const storedValue = JSON.parse(window.localStorage.getItem(REWARDS_KEY) ?? '[]');
    if (!Array.isArray(storedValue)) return [];

    return storedValue.filter((id): id is RewardId =>
      REWARDS.some((reward) => reward.id === id),
    );
  } catch {
    return [];
  }
}

export function useSnakeGame() {
  const storedRewards = useRef<RewardId[]>(getStoredRewards());
  const [snake, setSnake] = useState<Position[]>(getInitialSnake);
  const [food, setFood] = useState<Position>(() => randomEmptyCell(new Set(getInitialSnake().map(toKey))));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getStoredHighScore);
  const [unlockedRewardIds, setUnlockedRewardIds] = useState<RewardId[]>(storedRewards.current);
  const [latestReward, setLatestReward] = useState<SnakeReward | null>(null);
  const [isGoldenFood, setIsGoldenFood] = useState(false);
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

  const clearLatestReward = useCallback(() => {
    setLatestReward(null);
  }, []);

  const reset = useCallback(() => {
    const initialSnake = getInitialSnake();

    setSnake(initialSnake);
    setFood(randomEmptyCell(new Set(initialSnake.map(toKey))));
    setScore(0);
    setLatestReward(null);
    setIsGoldenFood(false);
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
            const earnedPoints = isGoldenFood ? 3 : 1;
            const nextScore = currentScore + earnedPoints;
            const unlockedReward = REWARDS.find(
              (reward) =>
                reward.score === nextScore &&
                !storedRewards.current.includes(reward.id),
            );

            if (unlockedReward) {
              const nextRewards = [...storedRewards.current, unlockedReward.id];
              storedRewards.current = nextRewards;
              setUnlockedRewardIds(nextRewards);
              setLatestReward(unlockedReward);
              window.localStorage.setItem(REWARDS_KEY, JSON.stringify(nextRewards));
            }

            if (isGoldenFood) {
              setIsGoldenFood(false);
            } else if (nextScore >= 30 && nextScore % 10 === 0) {
              setIsGoldenFood(true);
            }

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
  }, [food, isGameOver, isGoldenFood, isRunning, speed]);

  return {
    snake,
    food,
    score,
    highScore,
    level,
    latestReward,
    unlockedRewardIds,
    isGoldenFood,
    isGameOver,
    isPaused,
    hasStarted,
    gridSize: GRID_SIZE,
    setDirection,
    start,
    togglePause,
    clearLatestReward,
    reset,
  };
}
