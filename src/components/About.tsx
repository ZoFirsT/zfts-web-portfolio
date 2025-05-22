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
          Here's a{" "}
          <span className="underline decoration-accent/50">little</span>{" "}
          background
        </h4>
        <p className="text-base text-textSecondary">
          I am currently pursuing a Bachelor's degree in Information and Communication Technology at Mahidol University (MU). 
          With a strong foundation in Full-Stack Development, Cloud DevOps, and emerging technologies, I bring a unique blend 
          of academic excellence and practical experience. At StratusOne Co., Ltd, I've led development teams and implemented 
          cloud infrastructure using modern tools like Terraform, Docker, and Kubernetes. My expertise spans across cloud platforms 
          (AWS, GCP, Azure) and I'm particularly skilled in automation, CI/CD implementation, and optimizing cloud resources. 
          I'm passionate about creating innovative solutions that combine technical excellence with practical business value.
        </p>
      </div>
    </motion.div>
  );
}