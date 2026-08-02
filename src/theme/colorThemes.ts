import type { ColorKey, ColorTheme } from '../types/index.ts';

export const colorThemes: Record<ColorKey, ColorTheme> = {
  blue: {
    border: 'hover:border-blue-500/60',
    icon: 'text-blue-400',
    bg: 'bg-blue-500/10',
    text: 'text-blue-300',
  },
  violet: {
    border: 'hover:border-violet-500/60',
    icon: 'text-violet-400',
    bg: 'bg-violet-500/10',
    text: 'text-violet-300',
  },
  amber: {
    border: 'hover:border-amber-500/60',
    icon: 'text-amber-400',
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
  },
  green: {
    border: 'hover:border-green-500/60',
    icon: 'text-green-400',
    bg: 'bg-green-500/10',
    text: 'text-green-300',
  },
  pink: {
    border: 'hover:border-pink-500/60',
    icon: 'text-pink-400',
    bg: 'bg-pink-500/10',
    text: 'text-pink-300',
  },
};

// Ordem cíclica usada para colorir elementos que não têm uma cor fixa
// definida (ex: as cartas do jogo da memória).
export const colorCycle: ColorKey[] = ['blue', 'violet', 'amber', 'green', 'pink'];
