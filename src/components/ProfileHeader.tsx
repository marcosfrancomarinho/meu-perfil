import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  name: string;
  role: string;
  description: string;
  avatarUrl: string;
  greeting?: string;
}

export function ProfileHeader({
  name,
  role,
  description,
  avatarUrl,
  greeting = 'Oi, seja bem-vindo por aqui!',
}: ProfileHeaderProps) {
  return (
    <header className='flex w-full flex-col items-center'>
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className='inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 backdrop-blur sm:px-4 sm:py-2'
      >
        <Sparkles size={16} aria-hidden='true' className='shrink-0 text-blue-400' />
        <span className='text-xs text-zinc-300 sm:text-sm'>{greeting}</span>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className='relative mt-6 sm:mt-8'
      >
        <motion.div
          aria-hidden='true'
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className='absolute inset-0 rounded-full border-2 border-dashed border-blue-500/30'
        />

        <motion.img
          whileHover={{ scale: 1.05 }}
          src={avatarUrl}
          alt={`Foto de ${name}`}
          width={160}
          height={160}
          className='relative h-40 w-40 rounded-full border-4 border-blue-500 object-cover shadow-[0_0_50px_rgba(59,130,246,.45)] sm:h-48 sm:w-48'
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='mt-6 text-center text-2xl font-extrabold tracking-tight sm:mt-8 sm:text-4xl'
      >
        {name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className='mt-3 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-center text-xs text-blue-300 sm:px-5 sm:py-2 sm:text-sm'
      >
        {role}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className='mt-5 max-w-md text-center text-sm leading-6 text-zinc-400 sm:mt-6 sm:text-base sm:leading-7'
      >
        {description}
      </motion.p>
    </header>
  );
}
