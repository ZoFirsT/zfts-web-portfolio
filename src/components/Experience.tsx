'use client';

import { motion } from 'framer-motion';

type ExperienceCardProps = {
  title: string;
  company: string;
  date: string;
  points: string[];
  skills: string[];
};

function ExperienceCard({ title, company, date, points, skills }: ExperienceCardProps) {
  return (
    <article className="flex flex-col rounded-lg items-center space-y-7 flex-shrink-0 w-[500px] md:w-[600px] xl:w-[900px] snap-center bg-secondary p-10 opacity-40 hover:opacity-100 cursor-pointer transition-opacity duration-200 overflow-hidden">
      <motion.div
        initial={{
          y: -100,
          opacity: 0,
        }}
        transition={{ duration: 1.2 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="px-0 md:px-10 max-w-6xl"
      >
        <h4 className="text-4xl font-light text-textPrimary">{title}</h4>
        <p className="font-bold text-2xl mt-1 text-accent">{company}</p>
        <p className="uppercase py-5 text-textSecondary">{date}</p>

        <ul className="list-disc space-y-4 ml-5 text-lg text-textSecondary">
          {points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 mt-4">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full text-textSecondary text-sm border border-accent/20"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </article>
  );
}

export default function Experience() {
  const experiences = [
    {
      title: "Developer",
      company: "StratusOne Co., Ltd",
      date: "March 2024 - Present",
      points: [
        "Led development team and handled business planning as company founder",
        "Designed and developed cloud infrastructure using IaC tools",
        "Managed CI/CD pipelines for improved software delivery",
        "Implemented monitoring systems using Prometheus, Grafana, and ELK Stack",
        "Reduced deployment time by 70% and cut infrastructure costs by 30%"
      ],
      skills: [
        "Terraform",
        "Docker",
        "Kubernetes",
        "AWS",
        "GCP",
        "Azure",
        "CI/CD",
        "Python",
        "DevOps"
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="h-screen flex relative overflow-hidden flex-col text-left md:flex-row max-w-full px-10 justify-evenly mx-auto items-center"
    >
      <h3 className="sectionTitle">Experience</h3>

      <div className="w-full flex space-x-5 overflow-x-scroll p-10 snap-x snap-mandatory scrollbar scrollbar-track-primary/20 scrollbar-thumb-accent/80">
        {experiences.map((experience) => (
          <ExperienceCard key={experience.company} {...experience} />
        ))}
      </div>
    </motion.div>
  );
}
