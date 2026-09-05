import { useCallback, useEffect, useRef, useState } from 'react';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type RewardId = 'starter' | 'blue-skin' | 'master' | 'golden-food';
export type PowerUpType = 'debug' | 'double-xp' | 'ghost';

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

export interface SnakePowerUp {
  type: PowerUpType;
  position: Position;
}

export interface ActivePowerUp {
  type: PowerUpType;
  expiresAt: number;
}

export const GRID_SIZE = 15;

const INITIAL_SPEED_MS = 220;
const MIN_SPEED_MS = 90;
const SPEED_STEP_MS = 10;
const POINTS_PER_LEVEL = 10;
const COMBO_WINDOW_MS = 4500;
const MAX_COMBO = 4;
const POWER_UP_CHANCE = 0.3;
const POWER_UP_DURATION_MS = 7000;
const OBSTACLE_START_LEVEL = 3;
const OBSTACLES_PER_LEVEL = 2;
const MAX_OBSTACLES = 12;
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
    description: 'Pegue o bônus especial para ganhar ainda mais pontos.',
  },
];

const POWER_UP_TYPES: PowerUpType[] = ['debug', 'double-xp', 'ghost'];

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

function getRandomPowerUpType(): PowerUpType {
  return POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
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

function getLevelTitle(level: number) {
  if (level <= 1) return 'Júnior';
  if (level === 2) return 'Pleno';
  if (level === 3) return 'Sênior';
  if (level === 4) return 'Staff';
  return 'Arquiteto';
}

export function useSnakeGame() {
  const storedRewards = useRef<RewardId[]>(getStoredRewards());
  const lastFoodAtRef = useRef(0);
  const comboRef = useRef(1);
  const [snake, setSnake] = useState<Position[]>(getInitialSnake);
  const [food, setFood] = useState<Position>(() => randomEmptyCell(new Set(getInitialSnake().map(toKey))));
  const [obstacles, setObstacles] = useState<Position[]>([]);
  const [powerUp, setPowerUp] = useState<SnakePowerUp | null>(null);
  const [activePowerUp, setActivePowerUp] = useState<ActivePowerUp | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
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
  const levelTitle = getLevelTitle(level);
  const baseSpeed = Math.max(MIN_SPEED_MS, INITIAL_SPEED_MS - (level - 1) * SPEED_STEP_MS);
  const isPowerUpActive = activePowerUp !== null && activePowerUp.expiresAt > Date.now();
  const speed =
    activePowerUp?.type === 'debug' && isPowerUpActive
      ? Math.min(INITIAL_SPEED_MS + 80, baseSpeed + 80)
      : baseSpeed;
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
    setObstacles([]);
    setPowerUp(null);
    setActivePowerUp(null);
    setScore(0);
    setCombo(1);
    setLatestReward(null);
    setIsGoldenFood(false);
    setIsGameOver(false);
    setIsRunning(true);
    setHasStarted(true);
    lastFoodAtRef.current = 0;
    comboRef.current = 1;
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
    if (combo <= 1) return;

    const elapsed = Date.now() - lastFoodAtRef.current;
    const timeout = window.setTimeout(() => {
      comboRef.current = 1;
      setCombo(1);
    }, Math.max(0, COMBO_WINDOW_MS - elapsed));

    return () => window.clearTimeout(timeout);
  }, [combo]);

  useEffect(() => {
    if (!activePowerUp) return;

    const timeout = window.setTimeout(() => {
      setActivePowerUp((current) =>
        current?.expiresAt === activePowerUp.expiresAt ? null : current,
      );
    }, Math.max(0, activePowerUp.expiresAt - Date.now()));

    return () => window.clearTimeout(timeout);
  }, [activePowerUp]);

  useEffect(() => {
    if (!hasStarted || isGameOver) return;

    const desiredObstacleCount =
      level < OBSTACLE_START_LEVEL
        ? 0
        : Math.min(
            MAX_OBSTACLES,
            (level - OBSTACLE_START_LEVEL + 1) * OBSTACLES_PER_LEVEL,
          );

    setObstacles((currentObstacles) => {
      if (currentObstacles.length === desiredObstacleCount) return currentObstacles;
      if (currentObstacles.length > desiredObstacleCount) {
        return currentObstacles.slice(0, desiredObstacleCount);
      }

      const nextObstacles = [...currentObstacles];
      const occupied = new Set([
        ...snake.map(toKey),
        ...currentObstacles.map(toKey),
        toKey(food),
      ]);

      if (powerUp) occupied.add(toKey(powerUp.position));

      while (nextObstacles.length < desiredObstacleCount) {
        const obstacle = randomEmptyCell(occupied);
        nextObstacles.push(obstacle);
        occupied.add(toKey(obstacle));
      }

      return nextObstacles;
    });
  }, [food, hasStarted, isGameOver, level, powerUp, snake]);

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

        const now = Date.now();
        const powerUpStillActive = activePowerUp !== null && activePowerUp.expiresAt > now;
        const ghostActive = activePowerUp?.type === 'ghost' && powerUpStillActive;
        const doubleXpActive = activePowerUp?.type === 'double-xp' && powerUpStillActive;

        const hitWall =
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE;

        const ateFood = newHead.x === food.x && newHead.y === food.y;
        const collectedPowerUp =
          powerUp !== null &&
          newHead.x === powerUp.position.x &&
          newHead.y === powerUp.position.y;
        const bodyToCheck = ateFood ? previousSnake : previousSnake.slice(0, -1);
        const hitSelf =
          !ghostActive &&
          bodyToCheck.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y,
          );
        const hitObstacle =
          !ghostActive &&
          obstacles.some(
            (obstacle) => obstacle.x === newHead.x && obstacle.y === newHead.y,
          );

        if (hitWall || hitSelf || hitObstacle) {
          setIsGameOver(true);
          setIsRunning(false);
          return previousSnake;
        }

        const nextSnake = [newHead, ...previousSnake];

        if (collectedPowerUp && powerUp) {
          setActivePowerUp({
            type: powerUp.type,
            expiresAt: now + POWER_UP_DURATION_MS,
          });
          setPowerUp(null);
        }

        if (ateFood) {
          const withinComboWindow =
            lastFoodAtRef.current > 0 && now - lastFoodAtRef.current <= COMBO_WINDOW_MS;
          const nextCombo = withinComboWindow
            ? Math.min(MAX_COMBO, comboRef.current + 1)
            : 1;

          lastFoodAtRef.current = now;
          comboRef.current = nextCombo;
          setCombo(nextCombo);

          setScore((currentScore) => {
            const basePoints = isGoldenFood ? 3 : 1;
            const xpMultiplier = doubleXpActive ? 2 : 1;
            const earnedPoints = basePoints * nextCombo * xpMultiplier;
            const nextScore = currentScore + earnedPoints;
            const newlyUnlockedRewards = REWARDS.filter(
              (reward) =>
                reward.score <= nextScore &&
                !storedRewards.current.includes(reward.id),
            );

            if (newlyUnlockedRewards.length > 0) {
              const nextRewards = [
                ...storedRewards.current,
                ...newlyUnlockedRewards.map((reward) => reward.id),
              ];
              storedRewards.current = nextRewards;
              setUnlockedRewardIds(nextRewards);
              setLatestReward(newlyUnlockedRewards[newlyUnlockedRewards.length - 1]);
              window.localStorage.setItem(REWARDS_KEY, JSON.stringify(nextRewards));
            }

            if (isGoldenFood) {
              setIsGoldenFood(false);
            } else {
              const previousMilestone = Math.floor(currentScore / 10);
              const nextMilestone = Math.floor(nextScore / 10);
              if (nextScore >= 30 && nextMilestone > previousMilestone) {
                setIsGoldenFood(true);
              }
            }

            setHighScore((currentHighScore) => {
              const nextHighScore = Math.max(currentHighScore, nextScore);
              window.localStorage.setItem(HIGH_SCORE_KEY, String(nextHighScore));
              return nextHighScore;
            });

            return nextScore;
          });

          const occupied = new Set([
            ...nextSnake.map(toKey),
            ...obstacles.map(toKey),
          ]);
          if (powerUp) occupied.add(toKey(powerUp.position));

          const nextFood = randomEmptyCell(occupied);
          setFood(nextFood);
          occupied.add(toKey(nextFood));

          if (!powerUp && Math.random() < POWER_UP_CHANCE) {
            setPowerUp({
              type: getRandomPowerUpType(),
              position: randomEmptyCell(occupied),
            });
          }

          return nextSnake;
        }

        nextSnake.pop();
        return nextSnake;
      });
    };

    const interval = window.setInterval(tick, speed);
    return () => window.clearInterval(interval);
  }, [activePowerUp, food, isGameOver, isGoldenFood, isRunning, obstacles, powerUp, speed]);

  return {
    snake,
    food,
    obstacles,
    powerUp,
    activePowerUp,
    score,
    combo,
    maxCombo: MAX_COMBO,
    highScore,
    level,
    levelTitle,
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
