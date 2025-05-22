'use client';

import { motion } from 'framer-motion';
import Skill from './Skill';

export default function Skills() {
  const skillCategories = [
    {
      category: "Languages",
      skills: [
        { name: "Python", icon: "/skills/python.svg" },
        { name: "JavaScript", icon: "/skills/javascript.svg" },
        { name: "TypeScript", icon: "/skills/typescript.svg" },
        { name: "Java", icon: "/skills/java.svg" },
        { name: "C", icon: "/skills/c.svg" },
        { name: "PHP", icon: "/skills/php.svg" },
      ]
    },
    {
      category: "Frontend",
      skills: [
        { name: "React", icon: "/skills/react.svg" },
        { name: "Vue.js", icon: "/skills/vuejs.svg" },
        { name: "HTML", icon: "/skills/html5.svg" },
        { name: "CSS", icon: "/skills/css3.svg" },
      ]
    },
    {
      category: "Backend & DevOps",
      skills: [
        { name: "Node.js", icon: "/skills/nodejs.svg" },
        { name: "Docker", icon: "/skills/docker.svg" },
        { name: "Kubernetes", icon: "/skills/kubernetes.svg" },
        { name: "Git", icon: "/skills/git.svg" },
      ]
    },
    {
      category: "Databases",
      skills: [
        { name: "PostgreSQL", icon: "/skills/postgresql.svg" },
        { name: "MySQL", icon: "/skills/mysql.svg" },
        { name: "MongoDB", icon: "/skills/mongodb.svg" },
      ]
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="min-h-screen flex relative flex-col text-center md:text-left max-w-7xl px-10 justify-evenly mx-auto items-center"
    >
      <h3 className="sectionTitle">Skills</h3>

      <div className="w-full flex flex-col space-y-12">
        {skillCategories.map((category) => (
          <div key={category.category} className="space-y-4">
            <h4 className="text-2xl text-accent tracking-wider">{category.category}</h4>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {category.skills.map((skill, i) => (
                <Skill
                  key={skill.name}
                  name={skill.name}
                  icon={skill.icon}
                  directionLeft={i < category.skills.length / 2}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
