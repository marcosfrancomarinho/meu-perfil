import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Direction } from '../../hooks/useSnakeGame';

interface DPadProps {
  onPress: (direction: Direction) => void;
}

const buttonClass =
  'flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition active:scale-90 active:bg-zinc-800 active:text-white';

export function DPad({ onPress }: DPadProps) {
  return (
    <div className='grid grid-cols-3 grid-rows-2 gap-1 select-none sm:hidden'>
      <div />
      <button type='button' className={buttonClass} onClick={() => onPress('UP')} aria-label='Mover para cima'>
        <ChevronUp size={24} />
      </button>
      <div />

      <button type='button' className={buttonClass} onClick={() => onPress('LEFT')} aria-label='Mover para esquerda'>
        <ChevronLeft size={24} />
      </button>
      <button type='button' className={buttonClass} onClick={() => onPress('DOWN')} aria-label='Mover para baixo'>
        <ChevronDown size={24} />
      </button>
      <button type='button' className={buttonClass} onClick={() => onPress('RIGHT')} aria-label='Mover para direita'>
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
