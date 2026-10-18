import { useState } from 'react';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  name: string;
  avatarUrl: string;
}

export function ProfileHeader({ name, avatarUrl }: ProfileHeaderProps) {
  const [spin, setSpin] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className='relative my-6 flex flex-col items-center sm:my-8'
    >
      <div className='relative h-40 w-40 sm:h-50 sm:w-50' style={{ perspective: '650px' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className='pointer-events-none absolute inset-0 rounded-full border-2 border-dashed border-blue-500/30'
        />
        <motion.button
          type='button'
          aria-label='Girar foto de perfil em 3D'
          onClick={() => setSpin((value) => value + 1)}
          initial={false}
          animate={{
            rotateY: spin * 360,
            rotateX: [0, -12, 8, 0],
            scale: [1, 1.18, 1.08, 1],
          }}
          transition={{ duration: 1.35, times: [0, 0.2, 0.75, 1], ease: 'easeInOut' }}
          whileHover={{ scale: 1.05 }}
          className='relative h-full w-full cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400'
          style={{ transformStyle: 'preserve-3d' }}
        >
          <span
            aria-hidden='true'
            className='absolute inset-0 rounded-full border-[8px] border-blue-800 bg-blue-950 shadow-[12px_12px_25px_rgba(0,0,0,.65),inset_0_0_18px_rgba(96,165,250,.35)]'
            style={{ transform: 'translateZ(-9px)' }}
          />
          <img
            src={avatarUrl}
            alt={`Foto de perfil de ${name}`}
            width={160}
            height={160}
            className='absolute inset-0 h-full w-full rounded-full border-4 border-blue-500 object-cover shadow-[0_0_50px_rgba(59,130,246,.45)]'
            style={{ transform: 'translateZ(9px)', backfaceVisibility: 'hidden' }}
            draggable={false}
          />
          <span
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 rounded-full border-4 border-blue-400/70 bg-gradient-to-br from-blue-400/15 via-transparent to-black/35'
            style={{ transform: 'rotateY(180deg) translateZ(9px)', backfaceVisibility: 'hidden' }}
          />
        </motion.button>
      </div>
      <h1 className='mt-6 text-center text-2xl font-extrabold tracking-tight sm:text-3xl'>{name}</h1>
    </motion.div>
  );
}
