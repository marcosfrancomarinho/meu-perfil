import { useState } from 'react';
import { ChevronDown, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';

interface TechStackProps {
  techs: string[];
  startDelay?: number;
}

export function TechStack({ techs, startDelay = 0.2 }: TechStackProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: startDelay }}
      className='w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl sm:rounded-3xl'
    >
      <button
        type='button'
        aria-expanded={expanded}
        aria-controls='about-profile-content'
        onClick={() => setExpanded((value) => !value)}
        className='flex min-h-26 w-full items-center gap-3 p-4 text-left transition hover:bg-white/[.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-400 sm:p-5'
      >
        <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300 sm:h-14 sm:w-14'>
          <UserRound size={24} aria-hidden='true' />
        </span>
        <span className='min-w-0 flex-1'>
          <span className='block text-base font-semibold text-zinc-100 sm:text-lg'>Sobre mim</span>
          <span className='mt-1 block text-xs text-zinc-400 sm:text-sm'>O que faço e minhas habilidades</span>
        </span>
        <ChevronDown size={20} aria-hidden='true' className={`shrink-0 text-zinc-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div id='about-profile-content' className='space-y-4 border-t border-white/10 px-4 pb-5 pt-4 sm:px-5'>
          <p className='text-sm font-medium text-blue-300'>Desenvolvedor de Software</p>
          <p className='text-sm leading-relaxed text-zinc-300'>
            Sou desenvolvedor Full Stack e gosto de transformar ideias em soluções práticas.
            Desenvolvo aplicações web, APIs e ferramentas para automatizar tarefas,
            priorizando simplicidade, desempenho e código fácil de manter.
          </p>
          <div>
            <h3 className='mb-2 text-sm font-semibold text-zinc-100'>Habilidades e tecnologias</h3>
            <div className='flex flex-wrap gap-2'>
              {techs.map((tech) => (
                <span key={tech} className='rounded-full border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs text-zinc-200'>
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <p className='text-xs leading-relaxed text-zinc-400'>
            Trabalho principalmente com TypeScript, Go e React, utilizando boas práticas,
            SOLID, padrões de projeto e arquiteturas Clean e Hexagonal quando fazem sentido.
          </p>
        </div>
      )}
    </motion.section>
  );
}
