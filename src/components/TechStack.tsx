import { motion } from 'framer-motion';

interface TechStackProps {
  techs: string[];
  startDelay?: number;
}

export function TechStack({ techs, startDelay = 0.5 }: TechStackProps) {
  return (
    <div className='mt-8 flex flex-wrap justify-center gap-2 sm:mt-10 sm:gap-3'>
      {techs.map((tech, index) => (
        <motion.div
          key={tech}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: startDelay + index * 0.04 }}
          whileHover={{ scale: 1.08, y: -4 }}
          className='rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-300 backdrop-blur sm:px-4 sm:py-2 sm:text-sm'
        >
          {tech}
        </motion.div>
      ))}
    </div>
  );
}
