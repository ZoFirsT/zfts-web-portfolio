'use client';

import { motion } from 'framer-motion';

type LoadingAnimationProps = {
  type?: 'fullscreen' | 'inline';
  size?: 'sm' | 'md' | 'lg';
};

export default function LoadingAnimation({ type = 'inline', size = 'md' }: LoadingAnimationProps) {
  const sizes = {
    sm: { outer: 'h-32 w-32', inner: 'h-20 w-20' },
    md: { outer: 'h-48 w-48', inner: 'h-32 w-32' },
    lg: { outer: 'h-64 w-64', inner: 'h-40 w-40' },
  };

  const animation = {
    scale: [1, 1.2, 1],
    rotate: [0, 360],
    borderRadius: ["20%", "50%", "20%"],
  };

  const content = (
    <motion.div
      initial={{ opacity: 1 }}
      animate={animation}
      transition={{
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.5, 1],
        repeat: Infinity,
      }}
      className="relative flex justify-center items-center"
    >
      <div className={`absolute border-2 border-accent rounded-full ${sizes[size].outer} animate-ping`} />
      <div className={`absolute border border-accent/20 rounded-full ${sizes[size].outer}`} />
      <div className={`absolute border border-accent/20 rounded-full ${sizes[size].inner}`} />
      <div className={`absolute border border-accent rounded-full opacity-20 ${sizes[size].inner} animate-pulse`} />
    </motion.div>
  );

  if (type === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
