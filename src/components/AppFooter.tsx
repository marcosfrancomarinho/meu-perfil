import { motion } from 'framer-motion';

interface AppFooterProps {
  name: string;
  year: number;
}

export function AppFooter({ name, year }: AppFooterProps) {
  return (
    <motion.footer
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 4, repeat: Infinity }}
      className='mt-12 flex flex-col items-center gap-2 text-center sm:mt-14'
    >
      <p className='text-sm text-zinc-500 sm:text-base'>Obrigado por passar por aqui 👋</p>
      <span className='text-[10px] uppercase tracking-[0.25em] text-zinc-700 sm:text-xs'>
        © {year} • {name}
      </span>
    </motion.footer>
  );
}
