import { useEffect } from 'react';
import { Gamepad2, RotateCcw, Skull } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnakeGame, type Direction } from "../../hooks/useSnakeGame.ts";
import { DPad } from './DPad.tsx';

interface SnakeGameProps {
  techs: string[];
}

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  s: 'DOWN',
  a: 'LEFT',
  d: 'RIGHT',
};

export function SnakeGame({ techs }: SnakeGameProps) {
  const {
    snake,
    food,
    score,
    collectedTechs,
    isGameOver,
    hasStarted,
    nextTech,
    gridSize,
    setDirection,
    start,
    reset,
  } = useSnakeGame(techs);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const direction = KEY_MAP[event.key];
      if (!direction) return;
      event.preventDefault();
      setDirection(direction);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setDirection]);

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
            <Gamepad2 size={18} className='sm:size-5' />
          </div>
          <div>
            <h3 className='text-sm font-semibold sm:text-base'>Jogo da cobrinha</h3>
            <p className='text-[11px] text-zinc-500 sm:text-xs'>Coma as techs sem bater na parede</p>
          </div>
        </div>

        <button
          type='button'
          onClick={reset}
          className='flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[11px] text-zinc-400 transition hover:border-zinc-700 hover:text-white sm:text-xs'
        >
          <RotateCcw size={13} />
          Reiniciar
        </button>
      </div>

      <div className='mt-3 flex items-center justify-between text-[11px] text-zinc-500 sm:text-xs'>
        <span>Pontos: {score}</span>
        <span className='truncate'>Próxima: {nextTech}</span>
      </div>

      <div className='relative mt-4'>
        <div
          className='mx-auto grid aspect-square w-full max-w-xs gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 sm:max-w-sm sm:rounded-2xl'
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
                    ? 'rounded-[2px] bg-green-400'
                    : isBody
                      ? 'rounded-[2px] bg-green-600/70'
                      : isFood
                        ? 'rounded-[2px] bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,.9)]'
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
              className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-zinc-950/90 px-4 text-center backdrop-blur-sm sm:rounded-2xl'
            >
              <p className='text-sm font-semibold sm:text-base'>Pronto para jogar?</p>
              <p className='max-w-[220px] text-xs text-zinc-400 sm:text-sm'>
                Use as setas do teclado (ou o D-pad no celular) para guiar a cobrinha
              </p>
              <button
                type='button'
                onClick={start}
                className='mt-1 rounded-full border border-green-500/40 bg-green-500/10 px-4 py-1.5 text-xs text-green-300 transition hover:bg-green-500/20 sm:text-sm'
              >
                Começar
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
                <Skull size={26} />
              </motion.div>
              <p className='text-sm font-semibold sm:text-base'>Game over 💀</p>
              <p className='text-xs text-zinc-400 sm:text-sm'>Você coletou {score} techs</p>
              <button
                type='button'
                onClick={reset}
                className='mt-1 rounded-full border border-green-500/40 bg-green-500/10 px-4 py-1.5 text-xs text-green-300 transition hover:bg-green-500/20 sm:text-sm'
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

      {collectedTechs.length > 0 && (
        <div className='mt-4 flex flex-wrap justify-center gap-1.5 border-t border-zinc-800 pt-4'>
          {collectedTechs.map((tech, index) => (
            <span
              key={`${tech}-${index}`}
              className='rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[10px] text-zinc-400 sm:text-xs'
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <p className='mt-3 hidden text-center text-[11px] text-zinc-600 sm:block'>
        Use as setas do teclado ou W A S D
      </p>
    </motion.section>
  );
}
