'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SocialIcon } from 'react-social-icons';

export default function Header() {
  return (
    <header className="sticky top-0 p-5 flex items-start justify-between max-w-7xl mx-auto z-20 xl:items-center">
      <motion.div
        initial={{
          x: -500,
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          x: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.5,
        }}
        className="flex flex-row items-center"
      >
        <SocialIcon
          url="https://github.com/ZoFirsT"
          fgColor="#8892B0"
          bgColor="transparent"
          className="hover:scale-125 transition-all"
        />
        <SocialIcon
          url="https://www.linkedin.com/in/thanatcha-saleekongchai-187385367/"
          fgColor="#8892B0"
          bgColor="transparent"
          className="hover:scale-125 transition-all"
        />
      </motion.div>

      <motion.div
        initial={{
          x: 500,
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          x: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.5,
        }}
        className="flex flex-row items-center text-textSecondary cursor-pointer"
      >
        <SocialIcon
          className="cursor-pointer hover:scale-125 transition-all"
          network="email"
          fgColor="#8892B0"
          bgColor="transparent"
          url="#contact"
        />
        <Link href="#contact">
          <p className="uppercase hidden md:inline-flex text-sm text-textSecondary">
            Get In Touch
          </p>
        </Link>
      </motion.div>
    </header>
  );
}