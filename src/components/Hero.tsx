'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ["Full Stack Developer", "DevOps", "CloudOps"];
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Enhanced parallax effect setup with bidirectional scrolling
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500, 0], [0, 150, 0]);
  const y2 = useTransform(scrollY, [0, 500, 0], [0, -150, 0]);
  const y3 = useTransform(scrollY, [0, 500, 0], [0, 100, 0]);
  const rotate1 = useTransform(scrollY, [0, 500, 0], [0, 15, 0]);
  const rotate2 = useTransform(scrollY, [0, 500, 0], [0, -15, 0]);
  const scale1 = useTransform(scrollY, [0, 300, 0], [1, 1.2, 1]);
  const scale2 = useTransform(scrollY, [0, 300, 0], [1, 0.8, 1]);
  const opacity = useTransform(scrollY, [0, 300, 0], [1, 0, 1]);
  const contentY = useTransform(scrollY, [0, 300, 0], [0, -50, 0]);
  
  // Spring physics for smoother animations
  const springConfig = { stiffness: 100, damping: 30, mass: 1 };
  const smoothY1 = useSpring(y1, springConfig);
  const smoothY2 = useSpring(y2, springConfig);
  const smoothRotate1 = useSpring(rotate1, springConfig);
  const smoothRotate2 = useSpring(rotate2, springConfig);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" ref={containerRef} className="relative h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Enhanced parallax background elements */}
      <motion.div 
        style={{ y: smoothY1, rotate: smoothRotate1, scale: scale1 }} 
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        <motion.div 
          className="absolute top-20 left-20 w-64 h-64 bg-accent/10 rounded-full filter blur-xl opacity-70"
          style={{ scale: useTransform(scrollY, [0, 300, 0], [1, 1.3, 1]) }}
        ></motion.div>
        <motion.div 
          className="absolute top-40 right-40 w-72 h-72 bg-accent/5 rounded-full filter blur-xl opacity-70"
          style={{ scale: useTransform(scrollY, [0, 300, 0], [1, 0.7, 1]) }}
        ></motion.div>
      </motion.div>
      
      <motion.div 
        style={{ y: smoothY2, rotate: smoothRotate2, scale: scale2 }} 
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        <motion.div 
          className="absolute bottom-20 right-20 w-72 h-72 bg-accent/20 rounded-full filter blur-xl opacity-70"
          style={{ scale: useTransform(scrollY, [0, 300, 0], [1, 1.2, 1]) }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-40 left-40 w-64 h-64 bg-accent/15 rounded-full filter blur-xl opacity-70"
          style={{ scale: useTransform(scrollY, [0, 300, 0], [1, 0.8, 1]) }}
        ></motion.div>
      </motion.div>
      
      {/* Additional floating elements */}
      <motion.div 
        style={{ y: y3, x: useTransform(scrollY, [0, 500, 0], [0, 50, 0]) }}
        className="absolute z-0"
      >
        <motion.div 
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 6,
            ease: "easeInOut"
          }}
          className="absolute top-[30%] right-[15%] w-20 h-20 bg-accent/10 rounded-lg filter blur-md opacity-60"
        ></motion.div>
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, -7, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 7,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute bottom-[25%] left-[20%] w-16 h-16 bg-accent/15 rounded-lg filter blur-md opacity-60"
        ></motion.div>
      </motion.div>
      
      {/* Enhanced grid pattern overlay with bidirectional parallax */}
      <motion.div 
        className="absolute inset-0 bg-grid-pattern opacity-10 z-0"
        style={{ 
          y: useTransform(scrollY, [0, 500, 0], [0, 30, 0]),
          scale: useTransform(scrollY, [0, 500, 0], [1, 1.1, 1])
        }}
      ></motion.div>

      {/* Content container with enhanced bidirectional parallax effect */}
      <motion.div 
        style={{ opacity, y: contentY }}
        className="z-10 max-w-4xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <motion.p 
            className="text-accent font-mono text-lg mb-4"
            whileInView={{ x: [20, 0], opacity: [0, 1] }}
            transition={{ duration: 0.5 }}
          >
            Hello, my name is
          </motion.p>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-textPrimary mb-4"
            whileInView={{ x: [-20, 0], opacity: [0, 1] }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Thanatcha Saleekongchai
          </motion.h1>
          
          <div className="h-16 mb-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-textSecondary">
              I'm a <motion.span 
                className="text-accent"
                key={roleIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {roles[roleIndex]}
              </motion.span>
            </h2>
          </div>
          
          <motion.p 
            className="text-textSecondary text-lg max-w-xl mb-8 md:pr-8"
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            I build exceptional digital experiences with modern technologies.
            Let's create something amazing together.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4 justify-center md:justify-start"
            whileInView={{ y: [20, 0], opacity: [0, 1] }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="#about">
              <button className="heroButton">About</button>
            </Link>
            <Link href="#experience">
              <button className="heroButton">Experience</button>
            </Link>
            <Link href="#skills">
              <button className="heroButton">Skills</button>
            </Link>
            {/* <Link href="#projects">
              <button className="heroButton">Projects</button>
            </Link> */}
            <Link href="#contact" className="px-6 py-2 bg-accent/20 rounded-full uppercase text-xs tracking-widest text-accent border border-accent hover:bg-accent/30 transition-all">
              Contact Me
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced scroll indicator with bidirectional parallax effect */}
      <motion.div 
        style={{ opacity, y: useTransform(scrollY, [0, 100, 0], [0, 50, 0]) }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <motion.p 
          className="text-textSecondary text-sm mb-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          Scroll Down
        </motion.p>
        <div className="w-6 h-10 rounded-full border-2 border-textSecondary flex justify-center p-1">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-2 h-2 bg-accent rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}