import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  name: string;
  avatarUrl: string;
}

export function ProfileHeader({ name, avatarUrl }: ProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className='relative my-6 sm:my-8'
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className='absolute inset-0 rounded-full border-2 border-dashed border-blue-500/30'
      />
      <motion.img
        whileHover={{ scale: 1.05 }}
        src={avatarUrl}
        alt={`Foto de perfil de ${name}`}
        width={160}
        height={160}
        className='relative h-40 w-40 rounded-full border-4 border-blue-500 object-cover shadow-[0_0_50px_rgba(59,130,246,.45)] sm:h-50 sm:w-50'
      />
    </motion.div>
  );
}
