'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { FaBriefcase, FaGraduationCap, FaTrophy, FaRocket, FaCode, FaAward } from 'react-icons/fa';
import { FiCalendar, FiMapPin, FiExternalLink, FiStar } from 'react-icons/fi';

type TimelineItem = {
  title: string;
  organization: string;
  date: string;
  description: string;
  type: 'work' | 'education' | 'achievement' | 'project';
  location?: string;
  skills?: string[];
  achievement?: string;
  link?: string;
  highlight?: boolean;
};

const timelineData: TimelineItem[] = [
  {
    title: "CDN zFts Enterprise",
    organization: "Personal Project",
    date: "2025",
    description: "Developed a CDN management platform using Next.js 15, MongoDB for data storage, NextAuth.js for authentication, and Cloudinary for image optimization. Features real-time analytics dashboard with Recharts visualization and comprehensive file management system and use LocalStorage for CDN.",
    type: "project",
    skills: ["Next.js 15", "MongoDB", "NextAuth.js", "Cloudinary", "Recharts", "LocalStorage", "CDN Management"],
    link: "https://cdn.zfts.site",
    highlight: true
  },
  {
    title: "ValenGift",
    organization: "Personal Project", 
    date: "2025",
    description: "Developed a Valentine's gift suggestion system using Next.js, Google Gemini, Redis, and Vercel. Focused on personality-based AI recommendations with real-time processing.",
    type: "project",
    skills: ["Next.js", "Google Gemini", "Redis", "Vercel", "AI Recommendations", "Real-time Processing"],
    link: "https://valengift.vercel.app",
    highlight: true
  },
  {
    title: "Digital Science and Technology Student",
    organization: "Mahidol University *Withdraw from university to choose a more suitable educational path",
    date: "2567 - 2568",
    location: "Bangkok, Thailand",
    description: "Currently studying Digital Science and Technology at the Faculty of Information and Communication Technology, Mahidol University.",
    type: "education",
    skills: ["Digital Technology", "Computer Science", "ICT"],
    highlight: true
  },
  {
    title: "Computer Technician Certificate",
    organization: "",
    date: "2564 - 2567",
    location: "Bangkok, Thailand", 
    description: "Completed Vocational Certificate Program (ปวช.) in Computer Technician, gaining foundational technical skills in computer systems and technology.",
    type: "education",
    skills: ["Computer Hardware", "System Maintenance", "Technical Support"]
  },
  {
    title: "KIBO RPC 2023 Competitor",
    organization: "NASA/JAXA International Competition",
    date: "2023",
    location: "International",
    description: "Ranked 15th nationally with 136.62 points in programming challenge. Programmed NASA's Astrobee robot using Java to assist astronauts in JAXA simulator environment.",
    type: "achievement",
    skills: ["Java Programming", "Robotics", "Problem Solving", "Space Technology"],
    achievement: "15th place nationally, 136.62 points",
    highlight: true
  },
  {
    title: "Thailand Cyber Top Talent 2023",
    organization: "National Cybersecurity Competition",
    date: "2023",
    location: "Thailand",
    description: "Competed in Capture the Flag (CTF) cybersecurity competition in Jeopardy format. Ranked 170th with 140 points, solving various cybersecurity challenges.",
    type: "achievement",
    skills: ["Cybersecurity", "CTF", "Problem Solving", "Network Security"],
    achievement: "170th place, 140 points"
  },
  {
    title: "Full-Stack Developer Bootcamp",
    organization: "Rangsit University",
    date: "May 17-19, 2566",
    location: "Bangkok, Thailand",
    description: "Completed intensive 3-day Full-Stack Developer training program, gaining comprehensive web development skills.",
    type: "education",
    skills: ["Full-Stack Development", "Web Programming", "Frontend", "Backend"]
  },
  {
    title: "AI FOR THAI Training",
    organization: "National Science and Technology Development Agency",
    date: "Jun 22-23, 2566",
    location: "Thailand",
    description: "Completed training in Artificial Intelligence and application of AI for Thai platform, focusing on AI implementation and practical applications.",
    type: "education",
    skills: ["Artificial Intelligence", "AI Platforms", "Machine Learning", "Thai AI"]
  },
  {
    title: "RMUTP VISION Staff",
    organization: "Rajamangala University of Technology Phra Nakhon",
    date: "2566",
    location: "Bangkok, Thailand",
    description: "Invited by Computer Engineering department head to manage and present information about 3D printing, industrial robotics, Unity 3D game development, and Cira Core attendance systems.",
    type: "work",
    skills: ["3D Printing", "Unity 3D", "Industrial Automation", "Public Speaking", "Technical Presentation"]
  },
  {
    title: "3D Model Design and Printing Workshop",
    organization: "Rajamangala University of Technology Phra Nakhon",
    date: "Jan 27, 2566",
    location: "Bangkok, Thailand",
    description: "Completed training in 3D model design for robotics components and 3D printing technology applications.",
    type: "education",
    skills: ["3D Modeling", "3D Printing", "CAD Design", "Robotics Components"]
  },
  {
    title: "Mini CRU ROBOT GAMES 14",
    organization: "National Robotics Competition",
    date: "2565",
    location: "Thailand",
    description: "Advanced to Round 2 in mixed robotics competition. Developed robots for block manipulation tasks using manual control and autonomous systems integration.",
    type: "achievement",
    skills: ["Robotics", "Automation", "Manual Control Systems", "Problem Solving"],
    achievement: "Advanced to Round 2"
  },
  {
    title: "MAGIC HACK 2022",
    organization: "National Hackathon Competition", 
    date: "2022",
    location: "Thailand",
    description: "Selected as one of top 10 finalist teams in hackathon competition themed '5-Minutes Moment: Changing Ways in the Same World'. Networked with professional developers and gained industry insights.",
    type: "achievement",
    skills: ["Software Development", "Hackathon", "Team Collaboration", "Innovation"],
    achievement: "Top 10 finalist team",
    highlight: true
  },
  {
    title: "K-Engineering World Tour Workshop",
    organization: "KMITL Innovation Expo 2023",
    date: "2023",
    location: "Bangkok, Thailand",
    description: "Participated in 'Web Programming towards Metaverse' and 'Python for Fun' workshops, learning HTML web development fundamentals and Python programming including image generation.",
    type: "education",
    skills: ["Web Programming", "HTML", "Python Programming", "Metaverse Development"]
  },
  {
    title: "National Arts and Crafts Competition 69th",
    organization: "Ministry of Education Thailand",
    date: "2565",
    location: "Thailand",
    description: "Qualified for national-level competition, gaining experience in problem-solving under pressure and competing at the highest academic level in Thailand.",
    type: "achievement",
    skills: ["Technical Skills", "Problem Solving", "Competition Experience"],
    achievement: "National level qualification"
  },
];

const getIcon = (type: string, highlight?: boolean) => {
  const iconClass = `w-5 h-5 ${highlight ? 'text-yellow-400' : 'text-accent'}`;
  
  switch (type) {
    case 'work':
      return <FaBriefcase className={iconClass} />;
    case 'education':
      return <FaGraduationCap className={iconClass} />;
    case 'achievement':
      return <FaTrophy className={iconClass} />;
    case 'project':
      return <FaCode className={iconClass} />;
    default:
      return <FaRocket className={iconClass} />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'work':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'education':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'achievement':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'project':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    default:
      return 'bg-accent/20 text-accent border-accent/30';
  }
};

export default function Timeline() {
  const [filter, setFilter] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const filteredData = filter === 'all' 
    ? timelineData 
    : timelineData.filter(item => item.type === filter);

  const filterOptions = [
    { value: 'all', label: 'All', count: timelineData.length },
    { value: 'work', label: 'Work', count: timelineData.filter(item => item.type === 'work').length },
    { value: 'education', label: 'Education', count: timelineData.filter(item => item.type === 'education').length },
    { value: 'achievement', label: 'Achievements', count: timelineData.filter(item => item.type === 'achievement').length },
    { value: 'project', label: 'Projects', count: timelineData.filter(item => item.type === 'project').length }
  ];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="min-h-screen relative flex flex-col text-left max-w-full px-4 md:px-10 justify-center mx-auto items-center py-20"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 opacity-50" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-accent/10 rounded-full filter blur-3xl opacity-30" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent/5 rounded-full filter blur-3xl opacity-40" />

      <div className="relative z-10 w-full max-w-6xl">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-bold text-textPrimary mb-4">
            My <span className="text-accent">Journey</span>
          </h3>
          <p className="text-textSecondary text-lg max-w-2xl mx-auto mb-8">
            A chronological overview of my professional growth, educational milestones, and key achievements in technology.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  filter === option.value
                    ? 'bg-accent/20 text-accent border-accent/40'
                    : 'bg-secondary/30 text-textSecondary border-textSecondary/20 hover:border-accent/30 hover:text-accent'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Animated Timeline Line */}
          <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-0 w-0.5 h-full bg-textSecondary/20" />
          <motion.div 
            className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-0 w-0.5 bg-gradient-to-b from-accent to-accent/50 origin-top"
            style={{ height: lineHeight }}
          />

          {/* Timeline Items */}
          <div className="space-y-8">
            {filteredData.map((item, index) => (
              <motion.div
                key={`${item.title}-${index}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-start ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                } flex-col md:flex-row`}
              >
                {/* Content Card */}
                <div className={`w-full md:w-5/12 ml-12 md:ml-0 ${
                  index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
                }`}>
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`bg-gradient-to-br from-secondary/80 to-secondary/40 backdrop-blur-sm border rounded-xl p-6 shadow-lg transition-all duration-300 group ${
                      item.highlight 
                        ? 'border-accent/30 shadow-accent/10' 
                        : 'border-textSecondary/10 hover:border-accent/20'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.type)}`}>
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          </span>
                          {item.highlight && (
                            <FiStar className="text-yellow-400 w-4 h-4" />
                          )}
                        </div>
                        <h4 className="text-xl font-bold text-textPrimary mb-1 group-hover:text-accent transition-colors duration-300">
                          {item.title}
                        </h4>
                        <p className="text-accent font-semibold mb-2">{item.organization}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm text-textSecondary mb-3">
                          <div className="flex items-center gap-1">
                            <FiCalendar size={14} />
                            <span>{item.date}</span>
                          </div>
                          {item.location && (
                            <div className="flex items-center gap-1">
                              <FiMapPin size={14} />
                              <span>{item.location}</span>
                            </div>
                          )}
                          {item.link && (
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-accent hover:text-accent/80 transition-colors duration-200"
                            >
                              <FiExternalLink size={14} />
                              <span>View</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-textSecondary leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Achievement Badge */}
                    {item.achievement && (
                      <div className="flex items-center gap-2 mb-4">
                        <FaAward className="text-yellow-400 w-4 h-4" />
                        <span className="text-yellow-400 font-medium text-sm">
                          {item.achievement}
                        </span>
                      </div>
                    )}

                    {/* Skills */}
                    {item.skills && item.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 rounded-md text-xs bg-accent/10 text-accent border border-accent/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Timeline Icon */}
                <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-6">
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 ${
                      item.highlight 
                        ? 'bg-gradient-to-br from-yellow-400/20 to-accent/20 border-yellow-400/50' 
                        : 'bg-gradient-to-br from-secondary to-secondary/50 border-accent/30'
                    }`}
                  >
                    {getIcon(item.type, item.highlight)}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {filterOptions.slice(1).map((option, index) => (
            <div key={option.value} className="text-center p-4 bg-secondary/30 rounded-lg border border-accent/10">
              <div className="text-2xl font-bold text-accent mb-1">{option.count}</div>
              <div className="text-textSecondary text-sm">{option.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
