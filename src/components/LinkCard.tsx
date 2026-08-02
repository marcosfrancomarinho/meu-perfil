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

  return (
    <motion.a
      href={link.href}
      target='_blank'
      rel='noreferrer'
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 + index * 0.12 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl transition-all duration-300 ${theme.border}`}
    >
      <div className='absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100'>
        <div className='absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full' />
      </div>

      <div className='relative flex items-center justify-between gap-3 p-4 sm:p-5'>
        <div className='flex min-w-0 items-center gap-3 sm:gap-4'>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.15 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl ${theme.bg} ${theme.icon}`}
          >
            <Icon size={24} />
          </motion.div>

          <div className='min-w-0'>
            <h2 className='truncate text-base sm:text-lg font-semibold tracking-wide'>{link.title}</h2>
            <p className='truncate text-xs sm:text-sm text-zinc-400'>{link.description}</p>
          </div>
        </div>

        <motion.div whileHover={{ x: 4, y: -4 }} className='shrink-0'>
          <ArrowUpRight size={20} className='text-zinc-500 transition group-hover:text-white sm:size-[22px]' />
        </motion.div>
      </div>
    </motion.a>
  );
}
