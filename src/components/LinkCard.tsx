import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LinkItem } from '../types';
import { colorThemes } from '../theme/colorThemes';

interface LinkCardProps {
  link: LinkItem;
  index: number;
}

export function LinkCard({ link, index }: LinkCardProps) {
  const Icon = link.icon;
  const theme = colorThemes[link.color];
  const isExternal = link.href.startsWith('http');

  return (
    <motion.a
      href={link.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 + index * 0.12 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:rounded-3xl ${theme.border}`}
    >
      <div aria-hidden='true' className='absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100'>
        <div className='absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full' />
      </div>

      <div className='relative flex items-center justify-between gap-3 p-4 sm:p-5'>
        <div className='flex min-w-0 items-center gap-3 sm:gap-4'>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.15 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${theme.bg} ${theme.icon}`}
          >
            <Icon size={24} aria-hidden='true' />
          </motion.div>

          <div className='min-w-0'>
            <h3 className='truncate text-base font-semibold tracking-wide sm:text-lg'>{link.title}</h3>
            <p className='truncate text-xs text-zinc-400 sm:text-sm'>{link.description}</p>
          </div>
        </div>

        <motion.div aria-hidden='true' whileHover={{ x: 4, y: -4 }} className='shrink-0'>
          <ArrowUpRight size={20} className='text-zinc-500 transition group-hover:text-white sm:size-[22px]' />
        </motion.div>
      </div>
    </motion.a>
  );
}
