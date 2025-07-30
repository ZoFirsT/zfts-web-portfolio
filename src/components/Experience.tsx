'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { FiMapPin, FiCalendar, FiBriefcase, FiTrendingUp, FiAward, FiExternalLink, FiChevronLeft, FiChevronRight, FiPlay, FiPause, FiMaximize2, FiX, FiUsers, FiDollarSign, FiClock, FiStar } from 'react-icons/fi';

type ExperienceCardProps = {
  title: string;
  company: string;
  location: string;
  date: string;
  duration: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  points: string[];
  skills: string[];
  achievements: string[];
  companyLogo?: string;
  companyWebsite?: string;
  isActive: boolean;
  index: number;
  teamSize?: string;
  salary?: string;
  rating?: number;
  onExpand: () => void;
};

function ExperienceCard({
  title,
  company,
  location,
  date,
  duration,
  type,
  points,
  skills,
  achievements,
  companyLogo,
  companyWebsite,
  isActive,
  index,
  teamSize,
  salary,
  rating,
  onExpand
}: ExperienceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      className={`relative flex flex-col rounded-lg flex-shrink-0 w-[320px] md:w-[380px] xl:w-[420px] snap-center bg-gradient-to-br from-secondary/70 to-secondary/30 backdrop-blur-sm border border-accent/20 p-4 transition-all duration-300 overflow-hidden group cursor-pointer ${isActive
        ? 'opacity-100 shadow-lg shadow-accent/10 scale-102 border-accent/40'
        : 'opacity-90 hover:opacity-100 hover:scale-101 hover:shadow-md hover:shadow-accent/5'
        }`}
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, type: "spring", stiffness: 120 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onExpand}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Simplified Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-accent/3 via-transparent to-accent/3 opacity-0"
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Reduced Floating Particles */}
      {isActive && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-accent/30 rounded-full"
              initial={{ x: Math.random() * 420, y: Math.random() * 300 }}
              animate={{
                x: Math.random() * 420,
                y: Math.random() * 300,
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}

      {/* Compact Header Section */}
      <div className="flex items-start gap-3 mb-4 relative z-10">
        {companyLogo && (
          <motion.div
            className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/15 to-accent/5 flex items-center justify-center overflow-hidden flex-shrink-0 border border-accent/15"
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <img src={companyLogo} alt={`${company} logo`} className="w-8 h-8 object-contain" />
          </motion.div>
        )}
        <div className="flex-1 min-w-0">
          <motion.h4
            className="text-lg font-bold text-textPrimary mb-1 truncate"
            animate={{ color: isActive ? '#64ffda' : '#ffffff' }}
            transition={{ duration: 0.2 }}
          >
            {title}
          </motion.h4>
          <div className="flex items-center gap-2 mb-2">
            <p className="font-semibold text-accent text-base">{company}</p>
            {companyWebsite && (
              <motion.a
                href={companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-textSecondary hover:text-accent transition-colors duration-200"
                whileHover={{ scale: 1.1, rotate: 10 }}
                onClick={(e) => e.stopPropagation()}
              >
                <FiExternalLink size={14} />
              </motion.a>
            )}
            {rating && (
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={10}
                    className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Compact Info Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-textSecondary mb-2">
            <div className="flex items-center gap-1.5">
              <FiCalendar size={10} className="text-accent" />
              <span className="truncate">{date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiMapPin size={10} className="text-accent" />
              <span className="truncate">{location}</span>
            </div>
            {teamSize && (
              <div className="flex items-center gap-1.5">
                <FiUsers size={10} className="text-accent" />
                <span className="truncate">{teamSize}</span>
              </div>
            )}
            {salary && (
              <div className="flex items-center gap-1.5">
                <FiDollarSign size={10} className="text-accent" />
                <span className="truncate">{salary}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-gradient-to-r from-accent/15 to-accent/8 rounded-full text-accent text-xs font-medium border border-accent/20">
              <FiClock size={8} className="inline mr-1" />
              {duration}
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${type === 'Full-time' ? 'bg-green-500/15 text-green-400 border border-green-500/20' :
              type === 'Part-time' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                type === 'Contract' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20' :
                  'bg-purple-500/15 text-purple-400 border border-purple-500/20'
              }`}>
              {type}
            </div>
          </div>
        </div>

        {/* Compact Expand Button */}
        <motion.button
          className="p-1.5 rounded-md bg-accent/8 text-accent hover:bg-accent/15 transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
        >
          <FiMaximize2 size={12} />
        </motion.button>
      </div>

      {/* Simplified Progress Bar */}
      <motion.div
        className="w-full h-0.5 bg-accent/15 rounded-full mb-3 overflow-hidden"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isActive ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-accent/50"
          initial={{ x: '-100%' }}
          animate={{ x: isActive ? '0%' : '-15%' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
      </motion.div>

      {/* Compact Key Responsibilities */}
      <motion.div
        className="mb-3"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h5 className="text-sm font-semibold text-textPrimary mb-2 flex items-center gap-1.5">
          <motion.div
            transition={{ duration: 0.3 }}
          >
            <FiTrendingUp className="text-accent" size={12} />
          </motion.div>
          Key Responsibilities
        </h5>
        <ul className="space-y-1.5">
          {points.slice(0, 2).map((point, idx) => (
            <motion.li
              key={idx}
              className="flex items-start gap-2 text-textSecondary text-xs leading-relaxed"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
            >
              <motion.div
                className="w-1.5 h-1.5 bg-gradient-to-r from-accent to-accent/50 rounded-full mt-1.5 flex-shrink-0"
                whileHover={{ scale: 1.3 }}
              />
              <span className="hover:text-textPrimary transition-colors duration-200">{point}</span>
            </motion.li>
          ))}
          {points.length > 2 && (
            <motion.li
              className="text-textSecondary/60 text-xs italic pl-3.5"
              whileHover={{ color: '#64ffda' }}
            >
              +{points.length - 2} more responsibilities
            </motion.li>
          )}
        </ul>
      </motion.div>

      {/* Compact Key Achievements */}
      {achievements.length > 0 && (
        <motion.div
          className="mb-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h5 className="text-sm font-semibold text-textPrimary mb-2 flex items-center gap-1.5">
            <motion.div
              transition={{ duration: 0.3 }}
            >
              <FiAward className="text-accent" size={12} />
            </motion.div>
            Key Achievements
          </h5>
          <div className="space-y-1.5">
            {achievements.slice(0, 1).map((achievement, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-2 text-accent text-xs bg-gradient-to-r from-accent/8 to-accent/4 rounded-md px-2 py-1.5 border border-accent/15"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(100, 255, 20, 0.12)' }}
              >
                <motion.div
                  className="w-1 h-1 bg-accent rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {achievement}
              </motion.div>
            ))}
            {achievements.length > 1 && (
              <div className="text-textSecondary/60 text-xs italic pl-2">
                +{achievements.length - 1} more achievements
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Compact Technologies */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h5 className="text-sm font-semibold text-textPrimary mb-2">Technologies & Skills</h5>
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 6).map((skill, idx) => (
            <motion.span
              key={skill}
              className="px-2 py-1 rounded-md text-textSecondary text-xs border border-accent/15 bg-gradient-to-r from-accent/4 to-transparent hover:text-accent hover:border-accent/30 transition-all duration-200 cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + idx * 0.03 }}
              whileHover={{
                scale: 1.02,
                backgroundColor: 'rgba(100, 255, 218, 0.08)',
                boxShadow: '0 0 5px rgba(100, 255, 218, 0.2)'
              }}
            >
              {skill}
            </motion.span>
          ))}
          {skills.length > 6 && (
            <motion.span
              className="px-2 py-1 rounded-md text-textSecondary/60 text-xs border border-accent/8 hover:border-accent/20 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
            >
              +{skills.length - 6}
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* Simplified Hover Overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-accent/3 to-transparent rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </motion.article>
  );
}
// Modal Component for Expanded View
function ExperienceModal({ experience, isOpen, onClose }: { experience: any, isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-secondary/85 backdrop-blur-md rounded-xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-accent/20"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-textPrimary mb-1">{experience.title}</h2>
              <p className="text-lg text-accent">{experience.company}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-accent/8 text-accent hover:bg-accent/15 transition-colors duration-200"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-semibold text-textPrimary mb-3">All Responsibilities</h3>
              <ul className="space-y-2">
                {experience.points.map((point: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-textSecondary text-sm">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-textPrimary mb-3">All Achievements</h3>
              <div className="space-y-2 mb-4">
                {experience.achievements.map((achievement: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-accent text-sm bg-accent/8 rounded-lg px-2 py-1.5">
                    <FiAward size={12} />
                    {achievement}
                  </div>
                ))}
              </div>

              <h3 className="text-base font-semibold text-textPrimary mb-3">All Technologies</h3>
              <div className="flex flex-wrap gap-1.5">
                {experience.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-2 py-1.5 rounded-md text-textSecondary text-sm border border-accent/15 bg-accent/4 hover:text-accent transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [expandedExperience, setExpandedExperience] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const containerRef = useRef<HTMLDivElement>(null);

  const experiences = [
    {
      title: "Founder & Lead Developer",
      company: "StratusOne Co., Ltd",
      location: "Bangkok, Thailand",
      date: "March 2024 - June 2025",
      duration: "1 year",
      type: "Full-time" as const,
      teamSize: "8 engineers",
      salary: "Equity + Salary",
      rating: 5,
      points: [
        "Founded and led a technology startup focused on cloud infrastructure solutions",
        "Architected and implemented scalable cloud infrastructure using Infrastructure as Code (IaC)",
        "Built and managed high-performance CI/CD pipelines reducing deployment time by 70%",
        "Designed comprehensive monitoring and observability systems using Prometheus, Grafana, and ELK Stack",
        "Led cross-functional development teams and established engineering best practices",
        "Managed multi-cloud environments across AWS, GCP, and Azure platforms",
        "Implemented security best practices and compliance frameworks",
        "Developed automated testing and quality assurance processes"
      ],
      skills: [
        "Terraform", "Docker", "Kubernetes", "AWS", "GCP", "Azure",
        "CI/CD", "Python", "DevOps", "Prometheus", "Grafana", "ELK Stack",
        "Infrastructure as Code", "Team Leadership", "Business Strategy", "Security", "Compliance"
      ],
      achievements: [
        "70% reduction in deployment time",
        "30% cut in infrastructure costs",
        "Zero-downtime deployments achieved",
        "Successfully scaled team from 1 to 8 engineers",
        "Achieved SOC 2 compliance",
      ],
      companyLogo: "/stratusone.jpeg",
      companyWebsite: "https://stratusone.cloud"
    },
    {
      title: "IT Support & Technical Production",
      company: "Wat Phra Ram 9 Kanchanaphisek",
      location: "Bangkok, Thailand",
      date: "March 2022 - May 2022",
      duration: "3 months",
      type: "Full-time" as const,
      teamSize: "5 media team",
      salary: "Contract",
      rating: 4,
      points: [
        "Managed computer systems and network infrastructure within the organization",
        "Provided technical support for dharma media production team",
        "Operated live streaming systems for dharma broadcasting",
        "Handled video recording and media equipment including cameras and audio systems",
        "Collaborated with production team to ensure smooth digital dharma dissemination",
        "Maintained NAS and cloud storage systems for organizational file management",
        "Resolved technical issues and optimized IT equipment performance"
      ],
      skills: [
        "System Administration", "Network Engineering", "Media Technology",
        "Live Streaming", "IT Support", "NAS Management", "Cloud Storage",
        "Video Production", "Audio Systems", "Camera Operations",
        "Technical Troubleshooting", "Equipment Maintenance"
      ],
      achievements: [
        "Ensured 100% uptime for live dharma streaming",
        "Optimized media production workflow",
        "Successfully managed organizational IT infrastructure",
        "Improved technical equipment efficiency",
        "Supported seamless digital dharma broadcasting"
      ]
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % experiences.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, experiences.length]);

  const scrollToCard = (index: number) => {
    setActiveIndex(index);
    const container = containerRef.current;
    if (container && viewMode === 'carousel') {
      const cardWidth = 440;
      const scrollPosition = index * cardWidth;
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const nextCard = () => {
    const nextIndex = (activeIndex + 1) % experiences.length;
    scrollToCard(nextIndex);
  };

  const prevCard = () => {
    const prevIndex = activeIndex === 0 ? experiences.length - 1 : activeIndex - 1;
    scrollToCard(prevIndex);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex relative overflow-hidden flex-col text-left max-w-full px-6 justify-evenly mx-auto items-center py-16"
    >
      <motion.h3
        className="sectionTitle mb-6"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        Professional Experience
      </motion.h3>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-3 mb-6 pt-16">
        <button
          onClick={prevCard}
          className="p-2 rounded-full bg-secondary/50 border border-accent/20 text-textSecondary hover:text-accent hover:border-accent/40 transition-all duration-200"
        >
          <FiChevronLeft size={16} />
        </button>

        <div className="flex gap-2">
          {experiences.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${index === activeIndex
                  ? 'bg-accent scale-125'
                  : 'bg-textSecondary/30 hover:bg-textSecondary/50'
                }`}
            />
          ))}
        </div>

        <button
          onClick={nextCard}
          className="p-2 rounded-full bg-secondary/50 border border-accent/20 text-textSecondary hover:text-accent hover:border-accent/40 transition-all duration-200"
        >
          <FiChevronRight size={16} />
        </button>
      </div>

      {/* Experience Cards Container */}
      <div
        ref={containerRef}
        className="w-auto flex space-x-4 overflow-x-scroll p-6 snap-x snap-mandatory scrollbar scrollbar-track-primary/15 scrollbar-thumb-accent/60"
        onScroll={(e) => {
          const container = e.currentTarget;
          const scrollLeft = container.scrollLeft;
          const cardWidth = 440;
          const newIndex = Math.round(scrollLeft / cardWidth);
          if (newIndex !== activeIndex && newIndex < experiences.length) {
            setActiveIndex(newIndex);
          }
        }}
      >
        {experiences.map((experience, index) => (
          <ExperienceCard
            key={`${experience.company}-${index}`}
            {...experience}
            isActive={index === activeIndex}
            index={index}
            onExpand={() => setExpandedExperience(experience)}
          />
        ))}
      </div>

      {/* Summary */}
      <motion.div
        className="text-center mt-8"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-secondary/40 to-secondary/20 rounded-xl border border-accent/20 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <FiBriefcase className="text-accent" size={16} />
            <span className="text-textSecondary text-sm">
              <span className="text-accent font-bold text-base">{experiences.length}</span> positions
            </span>
          </div>
          <div className="w-px h-4 bg-accent/20" />
          <div className="flex items-center gap-1.5">
            <FiClock className="text-accent" size={16} />
            <span className="text-textSecondary text-sm">
              <span className="text-accent font-bold text-base">4+</span> years
            </span>
          </div>
          <div className="w-px h-4 bg-accent/20" />
          <div className="flex items-center gap-1.5">
            <FiTrendingUp className="text-accent" size={16} />
            <span className="text-textSecondary text-sm">
              <span className="text-accent font-bold text-base">50+</span> projects
            </span>
          </div>
        </div>
      </motion.div>

      {/* Experience Modal */}
      <ExperienceModal
        experience={expandedExperience}
        isOpen={!!expandedExperience}
        onClose={() => setExpandedExperience(null)}
      />
    </motion.div>
  );
}
