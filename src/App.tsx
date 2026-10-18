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
          role='Desenvolvedor de Software'
          description='Desenvolvedor Full Stack focado em arquitetura de software, código limpo e boas práticas.'
          avatarUrl='https://github.com/marcosfrancomarinho.png'
        />

        <div className='mt-8 flex w-full flex-col gap-4 sm:mt-10'>
          <TechStack techs={techs} startDelay={0.2} />

          <LinksList links={links} />

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-lg shadow-black/20 sm:rounded-3xl'
          >
            <button
              type='button'
              aria-expanded={gameOpen}
              aria-controls='snake-card-content'
              onClick={() => setGameOpen((open) => !open)}
              className='flex w-full items-center gap-3 p-4 text-left transition hover:bg-white/[.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400 sm:p-5'
            >
              <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300'>
                <Gamepad2 size={22} aria-hidden='true' />
              </span>
              <span className='min-w-0 flex-1'>
                <span className='block text-sm font-semibold text-zinc-100 sm:text-base'>Snake Game</span>
                <span className='mt-1 block text-xs leading-relaxed text-zinc-400'>
                  Uma pausa para jogar. Supere seu recorde!
                </span>
              </span>
              <span className='flex items-center gap-2 text-xs font-medium text-emerald-300'>
                <span>{gameOpen ? 'Fechar' : 'Jogar'}</span>
                <ChevronDown size={17} aria-hidden='true' className={`transition-transform ${gameOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>
            <div id='snake-card-content'>
              {gameOpen && (
                <div className='border-t border-white/10 p-2 sm:p-3'>
                  <SnakeGame />
                </div>
              )}
            </div>
          </motion.section>
        </div>

        <AppFooter name='Marcos Franco Marinho' year={currentYear} />
      </div>
    </main>
  );
}
