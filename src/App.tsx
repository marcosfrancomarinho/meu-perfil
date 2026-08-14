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
  return (
    <main className='relative min-h-screen w-full overflow-x-hidden bg-[#09090B] text-white'>
      <BackgroundGlow />
      <Particles />

      <div className='relative mx-auto flex min-h-screen w-full max-w-lg flex-col items-center px-4 py-8 sm:px-6 sm:py-10'>
        <ProfileHeader
          name='Marcos Franco Marinho'
          role='Programador e curioso por tecnologia'
          description='Gosto de transformar ideias em coisas que funcionam. Aqui você pode conhecer um pouco sobre mim, visitar meus links e jogar uma partida de Snake.'
          avatarUrl='https://github.com/marcosfrancomarinho.png'
        />

        <TechStack techs={techs} />
        <LinksList links={links} />
        <SnakeGame />

        <AppFooter name='Marcos Franco Marinho' year={new Date().getFullYear()} />
      </div>
    </main>
  );
}
