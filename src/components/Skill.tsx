import { motion } from 'framer-motion';
import { useState } from 'react';

type Props = {
  directionLeft?: boolean;
  name: string;
  icon: string;
  proficiency?: number;
  experience?: string;
  index?: number;
};

export default function Skill({ directionLeft, name, icon, proficiency = 80, experience, index = 0 }: Props) {
  return (
    <div className="group relative flex cursor-pointer">
      <motion.img
        initial={{
          x: directionLeft ? -200 : 200,
          opacity: 0,
        }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, x: 0 }}
        src={icon}
        className="rounded-full border border-accent/30 object-cover w-16 h-16 md:w-20 md:h-20 xl:w-24 xl:h-24 filter group-hover:grayscale transition duration-300 ease-in-out p-2"
      />
      <div className="absolute opacity-0 group-hover:opacity-80 transition duration-300 ease-in-out group-hover:bg-accent/20 w-16 h-16 md:w-20 md:h-20 xl:w-24 xl:h-24 rounded-full z-0">
        <div className="flex items-center justify-center h-full">
          <p className="text-sm font-bold text-textPrimary opacity-100">{name}</p>
        </div>
      </div>
    </div>
  );
}
