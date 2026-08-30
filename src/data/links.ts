import { BriefcaseBusiness, Code2, Mail } from 'lucide-react';
import { FaSpotify } from 'react-icons/fa';
import type { LinkItem } from '../types';

export const links: LinkItem[] = [
  {
    title: 'LinkedIn',
    description: 'Vamos trocar uma ideia e conexões',
    href: 'https://www.linkedin.com/in/marcos-franco-marinho-031b55187?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    icon: BriefcaseBusiness,
    color: 'blue',
  },
  {
    title: 'GitHub',
    description: 'Meus projetos e alguns experimentos',
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
    description: 'As melhores músicas catalogadas',
    href: 'https://open.spotify.com/playlist/3MhDg6msfOLdVDUKSRFhF2?si=PE92nN01TP-2UM_VjXZB8g&utm_source=copy-link&pi=r4b7_-R-TGWMY',
    icon: FaSpotify,
    color: 'green',
  },
];
