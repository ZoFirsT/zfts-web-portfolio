'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiCode, FiDatabase, FiServer, FiLayers, FiStar, FiTrendingUp, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Skill from './Skill';

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const skillCategories = [
    {
      category: "Languages",
      icon: <FiCode className="w-5 h-5" />,
      color: "from-blue-500/20 to-blue-600/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      skills: [
        { name: "JavaScript", icon: "/skills/javascript.svg", proficiency: 95, level: "Expert" },
        { name: "TypeScript", icon: "/skills/typescript.svg", proficiency: 90, level: "Expert" },
        { name: "Python", icon: "/skills/python.svg", proficiency: 90, level: "Expert" },
        { name: "Java", icon: "/skills/java.svg", proficiency: 30, level: "Basic" },
        { name: "PHP", icon: "/skills/php.svg", proficiency: 50, level: "Intermediate" },
        { name: "C", icon: "/skills/c.svg", proficiency: 40, level: "Intermediate" },
      ]
    },
    {
      category: "Frontend",
      icon: <FiLayers className="w-5 h-5" />,
      color: "from-green-500/20 to-green-600/10",
      borderColor: "border-green-500/30",
      textColor: "text-green-400",
      skills: [
        { name: "React", icon: "/skills/react.svg", proficiency: 95, level: "Expert" },
        { name: "Vue.js", icon: "/skills/vuejs.svg", proficiency: 85, level: "Advanced" },
        { name: "HTML5", icon: "/skills/html5.svg", proficiency: 95, level: "Expert" },
        { name: "CSS3", icon: "/skills/css3.svg", proficiency: 90, level: "Expert" },
      ]
    },
    {
      category: "Backend & DevOps",
      icon: <FiServer className="w-5 h-5" />,
      color: "from-purple-500/20 to-purple-600/10",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
      skills: [
        { name: "Node.js", icon: "/skills/nodejs.svg", proficiency: 90, level: "Expert" },
        { name: "Docker", icon: "/skills/docker.svg", proficiency: 85, level: "Advanced" },
        { name: "Kubernetes", icon: "/skills/kubernetes.svg", proficiency: 80, level: "Advanced" },
        { name: "Git", icon: "/skills/git.svg", proficiency: 95, level: "Expert" },
      ]
    },
    {
      category: "Databases",
      icon: <FiDatabase className="w-5 h-5" />,
      color: "from-orange-500/20 to-orange-600/10",
      borderColor: "border-orange-500/30",
      textColor: "text-orange-400",
      skills: [
        { name: "PostgreSQL", icon: "/skills/postgresql.svg", proficiency: 30, level: "Basic" },
        { name: "MySQL", icon: "/skills/mysql.svg", proficiency: 30, level: "Basic" },
        { name: "MongoDB", icon: "/skills/mongodb.svg", proficiency: 90, level: "Expert" },
      ]
    },
  ];

  const totalSkills = skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0);
  const expertSkills = skillCategories.reduce((acc, cat) =>
    acc + cat.skills.filter(skill => skill.level === "Expert").length, 0
  );

  const toggleCategory = (index: number) => {
    setActiveCategory(activeCategory === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="h-screen flex relative flex-col text-left max-w-7xl px-10 justify-evenly mx-auto items-center"
    >
      <h3 className="sectionTitle">Technical Skills</h3>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-center gap-8 mb-8"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-accent mb-1">{totalSkills}</div>
          <div className="text-textSecondary text-sm">Technologies</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent mb-1">{expertSkills}</div>
          <div className="text-textSecondary text-sm">Expert Level</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent mb-1">5+</div>
          <div className="text-textSecondary text-sm">Years Exp</div>
        </div>
      </motion.div>

      {/* Skills Categories */}
      <div className="w-full space-y-4">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            className={`bg-gradient-to-r ${category.color} backdrop-blur-sm border ${category.borderColor} rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5`}
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(categoryIndex)}
              className="w-full flex items-center justify-between mb-3 group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-secondary/50 ${category.textColor} group-hover:scale-110 transition-transform duration-200`}>
                  {category.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-textPrimary group-hover:text-accent transition-colors duration-200">
                    {category.category}
                  </h4>
                  <p className="text-xs text-textSecondary">
                    {category.skills.length} technologies
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {category.skills.slice(0, 3).map((skill, idx) => (
                    <div key={idx} className="w-6 h-6 rounded-full border border-accent/30 overflow-hidden">
                      <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain p-1" />
                    </div>
                  ))}
                  {category.skills.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-xs text-accent font-medium">+{category.skills.length - 3}</span>
                    </div>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: activeCategory === categoryIndex ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-textSecondary group-hover:text-accent"
                >
                  <FiChevronDown size={16} />
                </motion.div>
              </div>
            </button>

            {/* Skills Grid */}
            <AnimatePresence>
              {(activeCategory === categoryIndex || showAll) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-3 border-t border-accent/10">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: skillIndex * 0.05 }}
                        className="group relative bg-secondary/30 rounded-lg p-3 hover:bg-secondary/50 transition-all duration-200 cursor-pointer"
                      >
                        {/* Skill Icon */}
                        <div className="flex flex-col items-center text-center">
                          <div className="w-12 h-12 mb-2 rounded-lg border border-accent/20 p-2 group-hover:border-accent/40 transition-colors duration-200">
                            <img
                              src={skill.icon}
                              alt={skill.name}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                            />
                          </div>
                          <h5 className="text-xs font-medium text-textPrimary mb-1">{skill.name}</h5>

                          {/* Proficiency Bar */}
                          <div className="w-full bg-accent/10 rounded-full h-1.5 mb-1">
                            <motion.div
                              className="bg-gradient-to-r from-accent to-accent/70 h-1.5 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.proficiency}%` }}
                              transition={{ duration: 1, delay: skillIndex * 0.1 }}
                            />
                          </div>

                          {/* Level Badge */}
                          <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${skill.level === 'Expert' ? 'bg-green-500/20 text-green-400' :
                              skill.level === 'Advanced' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-yellow-500/20 text-yellow-400'
                            }`}>
                            {skill.level}
                          </div>
                        </div>

                        {/* Hover Tooltip */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-secondary/90 backdrop-blur-sm border border-accent/30 rounded px-2 py-1 text-xs text-textPrimary opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          {skill.proficiency}% proficiency
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Toggle All Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        onClick={() => setShowAll(!showAll)}
        className="flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-full text-accent transition-all duration-200 group"
      >
        <span className="text-sm font-medium">
          {showAll ? 'Collapse All' : 'Expand All'}
        </span>
        <motion.div
          animate={{ rotate: showAll ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown size={14} />
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
