import { BriefcaseBusiness, Code2, Mail } from 'lucide-react';
import { FaSpotify, FaInstagram } from 'react-icons/fa';
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
    title: 'Olá Mundo!',
    description: 'Entendendo o mundo da programação',
    href: 'https://www.instagram.com/_ola_mundo/',
    icon: FaInstagram,
    color: 'pink',
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
    description: 'A melhores músicas catalogadas',
    href: 'https://open.spotify.com/playlist/47f2vCrvOn7hSKpaMMz2vw?si=SBx9yelwR4uBvJHSt5gq-g&utm_source=whatsapp&pi=UQBnD7GuQ7SIc',
    icon: FaSpotify,
    color: 'green',
  },
];
