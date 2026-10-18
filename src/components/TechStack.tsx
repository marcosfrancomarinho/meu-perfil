import { Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TechStackProps {
  techs: string[];
  startDelay?: number;
}

export function TechStack({ techs, startDelay = 0.5 }: TechStackProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: startDelay }}
      aria-labelledby='skills-heading'
      className='w-full rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 shadow-lg shadow-black/20 sm:rounded-3xl sm:p-5'
    >
      <div className='mb-4 flex items-center gap-3'>
        <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300'>
          <Code2 size={22} aria-hidden='true' />
        </span>
        <div>
          <h2 id='skills-heading' className='text-sm font-semibold text-zinc-100 sm:text-base'>Habilidades</h2>
          <p className='mt-1 text-xs text-zinc-400'>Tecnologias com as quais trabalho e estudo</p>
        </div>
      </div>
      <div className='flex flex-wrap gap-2'>
        {techs.map((tech, index) => (
          <motion.span
            key={tech}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: startDelay + 0.1 + index * 0.04 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className='rounded-full border border-zinc-700/70 bg-zinc-800/70 px-3 py-1.5 text-xs text-zinc-200 sm:text-sm'
          >
            {tech}
          </motion.span>
        ))}
      </div>
    </motion.section>
  );
}
