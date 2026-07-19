import { ArrowUpRight, BriefcaseBusiness, Code2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const links = [
  {
    title: 'LinkedIn',
    description: 'Vamos trocar ideias e conexões',
    href: 'https://www.linkedin.com/in/marcos-franco-marinho-031b55187?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    icon: BriefcaseBusiness,
  },
  {
    title: 'GitHub',
    description: 'Conheça meus projetos',
    href: 'https://github.com/marcosfrancomarinho',
    icon: Code2,
  },
  {
    title: 'E-mail',
    description: 'Entre em contato comigo',
    href: 'mailto:marcosmarinho19998@gmail.com',
    icon: Mail,
  },
];

const technologies = [
  'TypeScript',
  'Golang',
  'Python',
  'Node.js',
  'NestJS',
  'React',
  'Spring Boot',
  'Tailwind CSS',
  'Clean Architecture',
  'SOLID',
  'Design Patterns',
];

const floatingItems = Array.from({ length: 10 });

export function App() {
  return (
    <main className='relative min-h-screen overflow-hidden bg-zinc-950 pb-8 text-white'>
      {floatingItems.map((_, index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 5 + index,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='absolute h-2 w-2 rounded-full bg-blue-500/30'
          style={{
            top: `${10 + index * 8}%`,
            left: `${index * 10}%`,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className='mx-auto flex w-full max-w-md flex-col items-center px-4 py-8 sm:px-6 sm:py-12'
      >
        {/* Foto */}
        <motion.div
          animate={{
            boxShadow: ['0 0 0px #3b82f6', '0 0 40px #2563eb', '0 0 0px #3b82f6'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className='rounded-full'
        >
          <motion.img
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 120,
            }}
            src='https://github.com/marcosfrancomarinho.png'
            alt='Marcos Franco Marinho'
            className='h-32 w-32 rounded-full border-4 border-blue-500 object-cover sm:h-40 sm:w-40'
          />
        </motion.div>

        {/* Nome */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='mt-6 text-center text-2xl font-bold sm:text-3xl'
        >
          Marcos Franco Marinho
        </motion.h1>

        {/* Descrição */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='mt-3 max-w-sm text-center text-sm leading-relaxed text-zinc-400 sm:text-base'
        >
          Desenvolvedor apaixonado por programação, arquitetura de software e boas práticas. Sempre buscando aprender e evoluir
          através de novos projetos.
        </motion.p>

        {/* Tecnologias */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className='mt-8 flex w-full flex-wrap justify-center gap-2'
        >
          {technologies.map((tech, index) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.7 + index * 0.05,
              }}
              whileHover={{
                scale: 1.1,
                y: -3,
              }}
              className='rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300 sm:text-sm'
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* Links */}
        <div className='mt-10 flex w-full flex-col gap-4'>
          {links.map((link, index) => {
            const Icon = link.icon;

            return (
              <motion.a
                key={link.title}
                href={link.href}
                target='_blank'
                rel='noreferrer'
                initial={{
                  opacity: 0,
                  x: -40,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 1 + index * 0.15,
                }}
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className='group flex w-full items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-blue-500 hover:bg-zinc-800 sm:p-5'
              >
                <div className='flex items-center gap-4'>
                  <motion.div
                    whileHover={{
                      rotate: 15,
                    }}
                    className='rounded-xl bg-blue-500/10 p-3 text-blue-400'
                  >
                    <Icon size={24} />
                  </motion.div>

                  <div>
                    <h2 className='font-semibold'>{link.title}</h2>
                    <p className='text-sm text-zinc-400'>{link.description}</p>
                  </div>
                </div>

                <ArrowUpRight
                  size={20}
                  className='text-zinc-500 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1'
                />
              </motion.a>
            );
          })}
        </div>

        <motion.footer
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className='mt-10 text-center text-sm text-zinc-500'
        >
          © {new Date().getFullYear()} • Marcos Franco Marinho
        </motion.footer>
      </motion.div>
    </main>
  );
}
