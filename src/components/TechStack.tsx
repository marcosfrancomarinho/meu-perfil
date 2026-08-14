import { motion } from 'framer-motion';

interface TechStackProps {
  techs: string[];
  startDelay?: number;
}

export function TechStack({ techs, startDelay = 0.5 }: TechStackProps) {
  return (
    <section aria-labelledby='tech-title' className='mt-10 w-full text-center sm:mt-12'>
      <motion.h2
        id='tech-title'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: startDelay }}
        className='text-lg font-bold text-zinc-100 sm:text-xl'
      >
        Coisas que gosto de usar
      </motion.h2>
      <p className='mt-2 text-xs leading-5 text-zinc-500 sm:text-sm'>
        Linguagens, ferramentas e ideias que fazem parte do meu dia a dia.
      </p>

      <div className='mt-5 flex flex-wrap justify-center gap-2 sm:gap-3'>
        {techs.map((tech, index) => (
          <motion.span
            key={tech}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: startDelay + index * 0.04 }}
            whileHover={{ scale: 1.08, y: -4 }}
            className='rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-300 backdrop-blur sm:px-4 sm:py-2 sm:text-sm'
          >
            {tech}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
