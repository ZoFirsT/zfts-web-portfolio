'use client';

import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col relative h-screen text-center md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center"
    >
      <h3 className="sectionTitle">About</h3>

      <motion.img
        initial={{
          x: -200,
          opacity: 0,
        }}
        transition={{
          duration: 1.2,
        }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        src="/profile-image.jpeg"
        className="mb-20 md:mb-0 flex-shrink-0 w-56 h-56 rounded-full object-cover md:rounded-lg md:w-64 md:h-95 xl:w-[400px] xl:h-[500px]"
      />

      <div className="space-y-10 px-0 md:px-10">
        <h4 className="text-4xl font-semibold">
          Senior Full Stack Developer &{" "}
          <span className="underline decoration-accent/50">CloudOps</span>{" "}
          Engineer
        </h4>
        <p className="text-base text-textSecondary">
          With 5+ years of comprehensive expertise in modern web development and cloud infrastructure, I specialize in 
          JavaScript and TypeScript ecosystems with demonstrated proficiency across the entire technology stack. My experience 
          spans advanced frontend development with Next.js, React, and Vue.js, robust backend development with Node.js and Express, 
          and proven expertise in multi-cloud environments (AWS, GCP, Azure). At StratusOne Co., Ltd, I successfully led 
          cross-functional development teams while architecting enterprise-level cloud infrastructure solutions using Terraform, 
          Docker, and Kubernetes. I'm passionate about bridging technical innovation with business objectives, consistently 
          delivering scalable solutions that optimize performance, reduce costs, and create practical business value through 
          automation, CI/CD implementation, and continuous learning.
        </p>
      </div>
    </motion.div>
  );
}