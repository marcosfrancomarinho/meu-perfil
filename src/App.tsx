import { useMemo } from 'react';
import { ArrowUpRight, BriefcaseBusiness, Code2, Mail, Sparkles } from 'lucide-react';
import { FaSpotify } from 'react-icons/fa';
import { motion } from 'framer-motion';

type ColorKey = 'blue' | 'violet' | 'amber' | 'green';

interface LinkItem {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  color: ColorKey;
}

const links: LinkItem[] = [
  {
    title: 'LinkedIn',
    description: 'Vamos trocar uma ideia e conexões',
    href: 'https://www.linkedin.com/in/marcos-franco-marinho-031b55187?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    icon: BriefcaseBusiness,
    color: 'blue',
  },
  {
    title: 'GitHub',
    description: 'Meus projetos  e alguns experimentos',
    href: 'https://github.com/marcosfrancomarinho',
    icon: Code2,
    color: 'violet',
  },
  {
    title: 'E-mail',
    description: 'Entre em contato comigo',
    href: 'mailto:marcosmarinho19998@gmail.com',
    icon: Mail,
    color: 'amber',
  },
  {
    title: 'Spotify',
    description: 'A trilha sonora dos meus commits 🎧',
    href: 'https://open.spotify.com/playlist/47f2vCrvOn7hSKpaMMz2vw?si=SBx9yelwR4uBvJHSt5gq-g&utm_source=whatsapp&pi=UQBnD7GuQ7SIc',
    icon: FaSpotify,
    color: 'green',
  },
];

const techs = [
  'TypeScript',
  'Golang',
  'Python',
  'Node.js',
  'React',
  'Spring Boot',
  'TailwindCSS',
  'Clean Architecture',
  'SOLID',
  'Design Patterns',
];

const PARTICLE_COUNT = 18;

const colorThemes: Record<ColorKey, { border: string; icon: string; bg: string }> = {
  blue: {
    border: 'hover:border-blue-500/60',
    icon: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  violet: {
    border: 'hover:border-violet-500/60',
    icon: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  amber: {
    border: 'hover:border-amber-500/60',
    icon: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  green: {
    border: 'hover:border-green-500/60',
    icon: 'text-green-400',
    bg: 'bg-green-500/10',
  },
};

// Componente isolado: evita que o App inteiro rerenderize por causa da
// animação contínua das partículas.
function Particles() {
  // Gera as posições/tempos UMA única vez (não a cada render do App).
  const particles = useMemo(() => {
    const generateParticles = () =>
      Array.from({ length: PARTICLE_COUNT }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: 5 + Math.random() * 6,
      }));
    return generateParticles();
  }, []);

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

function LinkCard({ link, index }: { link: LinkItem; index: number }) {
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

export function App() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <main className='relative min-h-screen w-full overflow-x-hidden bg-[#09090B] text-white'>
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute -left-20 top-0 h-72 w-72 rounded-full bg-blue-600/20 blur-[100px] sm:-left-32 sm:h-96 sm:w-96 sm:blur-[150px]' />
        <div className='absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px] sm:h-96 sm:w-96 sm:blur-[150px]' />
      </div>

      <Particles />

      <div className='relative mx-auto flex min-h-screen w-full max-w-lg flex-col items-center px-4 py-8 sm:px-6 sm:py-10'>
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className='inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 backdrop-blur sm:px-4 sm:py-2'
        >
          <Sparkles size={16} className='shrink-0 text-blue-400' />
          <span className='text-xs sm:text-sm text-zinc-300'>Ei, que bom te ver por aqui</span>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 120 }}
          className='relative mt-6 sm:mt-8'
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className='absolute inset-0 rounded-full border-2 border-dashed border-blue-500/30'
          />

          <motion.img
            whileHover={{ scale: 1.05 }}
            src='https://github.com/marcosfrancomarinho.png'
            alt='Foto de perfil de Marcos'
            loading='lazy'
            width={160}
            height={160}
            className='relative h-40 w-40 rounded-full border-4 border-blue-500 object-cover shadow-[0_0_50px_rgba(59,130,246,.45)] sm:h-50 sm:w-50'
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='mt-6 text-center text-2xl font-extrabold tracking-tight sm:mt-8 sm:text-4xl'
        >
          Marcos Franco Marinho
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className='mt-3 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs text-blue-300 sm:px-5 sm:py-2 sm:text-sm'
        >
          Desenvolvedor de Software
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className='mt-5 max-w-md text-center text-sm leading-6 text-zinc-400 sm:mt-6 sm:text-base sm:leading-7'
        >
          Desenvolvedor Full Stack focado em arquitetura de software, código limpo e boas práticas.
        </motion.p>

        <div className='mt-8 flex flex-wrap justify-center gap-2 sm:mt-10 sm:gap-3'>
          {techs.map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.04 }}
              whileHover={{ scale: 1.08, y: -4 }}
              className='rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-300 backdrop-blur sm:px-4 sm:py-2 sm:text-sm'
            >
              {tech}
            </motion.div>
          ))}
        </div>

        <div className='mt-10 flex w-full flex-col gap-4 sm:mt-12 sm:gap-5'>
          {links.map((link, index) => (
            <LinkCard key={link.title} link={link} index={index} />
          ))}
        </div>

        <motion.footer
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className='mt-12 flex flex-col items-center gap-2 text-center sm:mt-14'
        >
          <p className='text-sm text-zinc-500 sm:text-base'>Valeu por passar por aqui 👋</p>
          <span className='text-[10px] uppercase tracking-[0.25em] text-zinc-700 sm:text-xs'>
            © {currentYear} • Marcos Franco Marinho
          </span>
        </motion.footer>
      </div>
    </main>
  );
}
