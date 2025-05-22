import { motion } from 'framer-motion';

type Props = {
  directionLeft?: boolean;
  name: string;
  icon: string;
};

export default function Skill({ directionLeft, name, icon }: Props) {
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
        className="rounded-full border border-accent/30 object-cover w-24 h-24 md:w-28 md:h-28 xl:w-32 xl:h-32 filter group-hover:grayscale transition duration-300 ease-in-out p-2"
      />
      <div className="absolute opacity-0 group-hover:opacity-80 transition duration-300 ease-in-out group-hover:bg-accent/20 w-24 h-24 md:w-28 md:h-28 xl:w-32 xl:h-32 rounded-full z-0">
        <div className="flex items-center justify-center h-full">
          <p className="text-xl font-bold text-textPrimary opacity-100">{name}</p>
        </div>
      </div>
    </div>
  );
}
