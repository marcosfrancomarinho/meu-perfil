import type { LinkItem } from '../types';
import { LinkCard } from './LinkCard';

interface LinksListProps {
  links: LinkItem[];
}

export function LinksList({ links }: LinksListProps) {
  return (
    <section aria-labelledby='links-title' className='mt-10 w-full sm:mt-12'>
      <div className='text-center'>
        <h2 id='links-title' className='text-lg font-bold text-zinc-100 sm:text-xl'>
          Me encontre por aí
        </h2>
        <p className='mt-2 text-xs text-zinc-500 sm:text-sm'>
          Escolha um link e conheça mais um pouco do meu mundo.
        </p>
      </div>

      <div className='mt-5 flex flex-col gap-4 sm:gap-5'>
        {links.map((link, index) => (
          <LinkCard key={link.title} link={link} index={index} />
        ))}
      </div>
    </section>
  );
}
