import type { ComponentType } from 'react';

export type ColorKey = 'blue' | 'violet' | 'amber' | 'green' | 'pink';

export interface LinkItem {
  title: string;
  description: string;
  href: string;
  icon: ComponentType<{ size?: number }>;
  color: ColorKey;
}

export interface ColorTheme {
  border: string;
  icon: string;
  bg: string;
  text: string;
}
