import { useEffect, useRef } from 'react';
import { Gamepad2, Pause, Play, RotateCcw, Skull, Trophy, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnakeGame, type Direction } from '../../hooks/useSnakeGame';
import { DPad } from './DPad';

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  W: 'UP',
  s: 'DOWN',
  S: 'DOWN',
  a: 'LEFT',
  A: 'LEFT',
  d: 'RIGHT',
  D: 'RIGHT',
};

const START_ICON_CELLS = [
  { x: 15, y: 55, delay: 0.15 },
  { x: 30, y: 55, delay: 0.22 },
  { x: 30, y: 40, delay: 0.29 },
  { x: 30, y: 25, delay: 0.36 },
  { x: 45, y: 25, delay: 0.43 },
  { x: 60, y: 25, delay: 0.5 },
  { x: 60, y: 40, delay: 0.57 },
];

const SWIPE_DISTANCE = 24;

export function SnakeGame() {
  const {
    snake,
    food,
    score,
    highScore,
    level,
    isGameOver,
    isPaused,
    hasStarted,
    gridSize,
    setDirection,
    start,
    togglePause,
    reset,
  } = useSnakeGame();

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === ' ' && hasStarted && !isGameOver) {
        event.preventDefault();
        togglePause();
        return;
      }

      const direction = KEY_MAP[event.key];
      if (!direction) return;

      event.preventDefault();
      setDirection(direction);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, isGameOver, setDirection, togglePause]);

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (!touchStart.current) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < SWIPE_DISTANCE) return;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setDirection(deltaX > 0 ? 'RIGHT' : 'LEFT');
      return;
    }

    setDirection(deltaY > 0 ? 'DOWN' : 'UP');
  }

  const snakeCells = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const headKey = `${snake[0].x},${snake[0].y}`;
  const foodKey = `${food.x},${food.y}`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      className='relative mt-12 w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 backdrop-blur-xl sm:mt-14 sm:rounded-3xl sm:p-6'
    >
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400 sm:h-10 sm:w-10'>
            <Gamepad2 size={18} aria-hidden='true' className='sm:size-5' />
          </div>
          <div>
            <h3 className='text-sm font-semibold sm:text-base'>Snake Game</h3>
            <p className='text-[11px] text-zinc-500 sm:text-xs'>Pegue os pontos azuis e não bata 🐍</p>
          </div>
        </div>

        <div className='flex gap-2'>
          {hasStarted && !isGameOver && (
            <button
              type='button'
              onClick={togglePause}
              aria-label={isPaused ? 'Continuar jogo' : 'Pausar jogo'}
              className='flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-zinc-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400'
            >
              {isPaused ? <Play size={14} aria-hidden='true' /> : <Pause size={14} aria-hidden='true' />}
            </button>
          )}

          <button
            type='button'
            onClick={reset}
            className='flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[11px] text-zinc-400 transition hover:border-zinc-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 sm:text-xs'
          >
            <RotateCcw size={13} aria-hidden='true' />
            Reiniciar
          </button>
        </div>
      </div>

      <div className='mt-4 grid grid-cols-3 gap-2' aria-label='Estatísticas do jogo'>
        <div className='rounded-xl border border-zinc-800 bg-zinc-950/60 px-2 py-2 text-center'>
          <span className='block text-[10px] uppercase tracking-wide text-zinc-600'>Pontos</span>
          <strong aria-live='polite' className='text-sm text-green-400'>{score}</strong>
        </div>
        <div className='rounded-xl border border-zinc-800 bg-zinc-950/60 px-2 py-2 text-center'>
          <span className='flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-zinc-600'>
            <Trophy size={10} aria-hidden='true' /> Recorde
          </span>
          <strong className='text-sm text-amber-400'>{highScore}</strong>
        </div>
        <div className='rounded-xl border border-zinc-800 bg-zinc-950/60 px-2 py-2 text-center'>
          <span className='flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-zinc-600'>
            <Zap size={10} aria-hidden='true' /> Nível
          </span>
          <strong className='text-sm text-blue-400'>{level}</strong>
        </div>
      </div>

      <div className='relative mt-4'>
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-label='Tabuleiro do jogo da cobrinha. No celular, deslize para mudar a direção.'
          className='mx-auto grid aspect-square w-full max-w-md touch-none gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 sm:rounded-2xl'
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {Array.from({ length: gridSize * gridSize }, (_, index) => {
            const key = `${index % gridSize},${Math.floor(index / gridSize)}`;
            const isHead = key === headKey;
            const isBody = !isHead && snakeCells.has(key);
            const isFood = key === foodKey;

            return (
              <div
                key={key}
                className={
                  isHead
                    ? 'rounded-[2px] bg-green-300 shadow-[0_0_7px_rgba(134,239,172,.75)]'
                    : isBody
                      ? 'rounded-[2px] bg-green-600/75'
                      : isFood
                        ? 'animate-pulse rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,1)]'
                        : 'bg-zinc-900/40'
                }
              />
            );
          })}
        </div>

        <AnimatePresence>
          {!hasStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 overflow-hidden rounded-xl bg-zinc-950/95 px-6 text-center backdrop-blur-sm sm:rounded-2xl'
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 180, delay: 0.1 }}
                className='relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28'
              >
                <motion.div
                  animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.12, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  className='absolute inset-0 rounded-full bg-green-500/25 blur-2xl'
                />

                <svg viewBox='0 0 100 100' className='relative h-16 w-16 sm:h-20 sm:w-20' fill='none' aria-hidden='true'>
                  {START_ICON_CELLS.map((cell, index) => (
                    <motion.rect
                      key={`${cell.x}-${cell.y}`}
                      x={cell.x}
                      y={cell.y}
                      width='13'
                      height='13'
                      rx='2'
                      fill={index === START_ICON_CELLS.length - 1 ? '#4ade80' : '#16a34a'}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: cell.delay, type: 'spring', stiffness: 260 }}
                    />
                  ))}
                  <motion.rect
                    x='75'
                    y='40'
                    width='11'
                    height='11'
                    rx='5.5'
                    fill='#60a5fa'
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 1], scale: [0, 1.3, 1] }}
                    transition={{ delay: 0.65, duration: 0.5 }}
                    style={{ filter: 'drop-shadow(0 0 4px rgba(96,165,250,.9))' }}
                  />
                </svg>
              </motion.div>

              <div className='relative space-y-1.5'>
                <p className='text-base font-semibold sm:text-lg'>Pronto para jogar?</p>
                <p className='max-w-[250px] text-xs text-zinc-400 sm:text-sm'>
                  Use o teclado, os botões ou deslize no tabuleiro pelo celular.
                </p>
              </div>

              <motion.button
                type='button'
                onClick={start}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className='relative mt-1 flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 px-6 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_0_25px_rgba(74,222,128,.4)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-base'
              >
                <Gamepad2 size={16} aria-hidden='true' />
                Começar
              </motion.button>
            </motion.div>
          )}

          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-zinc-950/85 text-center backdrop-blur-sm sm:rounded-2xl'
            >
              <Pause size={32} className='text-blue-400' aria-hidden='true' />
              <p className='font-semibold'>Jogo pausado</p>
              <button
                type='button'
                onClick={togglePause}
                className='flex items-center gap-2 rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
              >
                <Play size={15} aria-hidden='true' />
                Continuar
              </button>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-zinc-950/90 px-4 text-center backdrop-blur-sm sm:rounded-2xl'
            >
              <motion.div
                initial={{ scale: 0.6, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className='flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 text-red-400'
              >
                <Skull size={26} aria-hidden='true' />
              </motion.div>
              <p className='text-sm font-semibold sm:text-base'>Game over 💀</p>
              <p className='text-xs text-zinc-400 sm:text-sm'>
                Você fez {score} ponto{score === 1 ? '' : 's'}.
              </p>
              {score > 0 && score === highScore && (
                <p className='text-xs font-semibold text-amber-400'>Novo recorde! 🏆</p>
              )}
              <button
                type='button'
                onClick={reset}
                className='mt-1 rounded-full border border-green-500/40 bg-green-500/10 px-4 py-1.5 text-xs text-green-300 transition hover:bg-green-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 sm:text-sm'
              >
                Jogar de novo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className='mt-4 flex justify-center'>
        <DPad onPress={setDirection} />
      </div>

      <p className='mt-4 text-center text-[11px] text-zinc-600'>
        <span className='sm:hidden'>Use os botões ou deslize no tabuleiro</span>
        <span className='hidden sm:inline'>Setas ou W A S D para mover • Espaço para pausar</span>
      </p>
    </motion.section>
  );
}
