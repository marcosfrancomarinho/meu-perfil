import type { LinkItem } from '../types';
import { LinkCard } from './LinkCard';

interface LinksListProps {
  links: LinkItem[];
}

export function LinksList({ links }: LinksListProps) {
  return (
    <div className='mt-10 flex w-full flex-col gap-4 sm:mt-12 sm:gap-5'>
      {links.map((link, index) => (
        <LinkCard key={link.title} link={link} index={index} />
      ))}
    </div>
  );
}
