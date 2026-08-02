import { useMemo } from 'react';
import { motion } from 'framer-motion';

const PARTICLE_COUNT = 18;

interface Particle {
  top: string;
  left: string;
  duration: number;
}

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: 5 + Math.random() * 6,
  }));
}

// Componente isolado: evita que o App inteiro rerenderize por causa da
// animação contínua das partículas.
export function Particles() {
  // Gera as posições/tempos UMA única vez (não a cada render do App).
  const particles = useMemo(() => generateParticles(), []);

  return (
    <>
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -50, 0],
            x: [0, 20, -20, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='absolute h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-500/30'
          style={{ top: particle.top, left: particle.left }}
        />
      ))}
    </>
  );
}
