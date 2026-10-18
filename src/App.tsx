import { useMemo, useState } from 'react';
import { Gamepad2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { BackgroundGlow } from './components/BackgroundGlow';
import { Particles } from './components/Particles';
import { ProfileHeader } from './components/ProfileHeader';
import { TechStack } from './components/TechStack';
import { LinksList } from './components/LinksList';
import { SnakeGame } from './components/SnakeGame/SnakeGame';
import { AppFooter } from './components/AppFooter';
import { links } from './data/links';
import { techs } from './data/techs';

export function App() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [gameOpen, setGameOpen] = useState(false);

  return (
    <main className='relative min-h-screen w-full overflow-x-hidden bg-[#09090B] text-white'>
      <BackgroundGlow />
      <Particles />
      <div className='relative mx-auto flex min-h-screen w-full max-w-lg flex-col items-center px-4 py-8 sm:px-6 sm:py-10'>
        <ProfileHeader
          name='Marcos Franco Marinho'
          avatarUrl='https://github.com/marcosfrancomarinho.png'
        />
        <div className='flex w-full flex-col gap-4 sm:gap-5'>
          <TechStack techs={techs} startDelay={0.2} />
          <LinksList links={links} />
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl sm:rounded-3xl'
          >
            <button
              type='button'
              aria-expanded={gameOpen}
              aria-controls='snake-card-content'
              onClick={() => setGameOpen((open) => !open)}
              className='flex min-h-26 w-full items-center gap-3 p-4 text-left transition hover:bg-white/[.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400 sm:p-5'
            >
              <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300 sm:h-14 sm:w-14'>
                <Gamepad2 size={24} aria-hidden='true' />
              </span>
              <span className='min-w-0 flex-1'>
                <span className='block text-base font-semibold text-zinc-100 sm:text-lg'>Snake Game</span>
                <span className='mt-1 block text-xs text-zinc-400 sm:text-sm'>Uma pausa para jogar. Supere seu recorde!</span>
              </span>
              <ChevronDown size={20} aria-hidden='true' className={`shrink-0 text-zinc-400 transition-transform ${gameOpen ? 'rotate-180' : ''}`} />
            </button>
            {gameOpen && (
              <div id='snake-card-content' className='border-t border-white/10 p-2 sm:p-3'>
                <SnakeGame />
              </div>
            )}
          </motion.section>
        </div>
        <AppFooter name='Marcos Franco Marinho' year={currentYear} />
      </div>
    </main>
  );
}
