'use client';

import { motion } from 'framer-motion';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';

type TimelineItem = {
  title: string;
  organization: string;
  date: string;
  description: string;
  type: 'work' | 'education';
};

const timelineData: TimelineItem[] = [
  {
    title: "Developer",
    organization: "StratusOne Co., Ltd",
    date: "Mar 2024 - Present",
    description: "Leading cloud infrastructure development using IaC, managing CI/CD pipelines, and optimizing cloud resources across AWS, GCP, and Azure. Achieved 70% faster deployments and 30% cost reduction.",
    type: "work"
  },
  {
    title: "Developer",
    organization: "ZITS Dev",
    date: "May 2024 - Present",
    description: "Building full-stack applications and integrating cloud-native services. Focused on performance optimization, container orchestration, and delivering scalable backend systems tailored to client needs.",
    type: "work"
  },
  {
    title: "Thailand Cyber Top Talent 2023 Finalist",
    organization: "National Cyber Security Agency (NCSA)",
    date: "Oct 2023",
    description: "Ranked 170th nationwide in Thailand's premier cybersecurity CTF competition, scoring 140 points and gaining hands-on experience in real-world security challenges.",
    type: "education"
  },
  {
    title: "ToBeIT'67 The Second",
    organization: "KMITL Faculty of IT",
    date: "Oct 2023 - Dec 2023",
    description: "Completed comprehensive IT training program including online courses and onsite camp, covering various IT disciplines with hands-on projects and mentor guidance.",
    type: "education"
  },
  {
    title: "Kibo Robot Programming Challenge 4",
    organization: "GISTDA & JAXA",
    date: "Jul 2023",
    description: "Top 15 national finalist in Thailand Round with 136.62 points. Developed robotics and space science programming skills through simulated ISS missions.",
    type: "education"
  },
  {
    title: "Full-Stack Developer Bootcamp",
    organization: "Rangsit University",
    date: "May 2023",
    description: "Intensive training in frontend (React.js) and backend (Node.js, MongoDB) development, including REST APIs and deployment techniques.",
    type: "education"
  },
  {
    title: "Magic Hack 2022 - Top 10 Finalist",
    organization: "Magic Hack",
    date: "Apr 2022",
    description: "Led team to Top 10 finish in '5-Minute Moment' themed hackathon, competing against both student and professional developers.",
    type: "education"
  },
  {
    title: "Bachelor's Degree - ICT",
    organization: "Mahidol University",
    date: "Present",
    description: "Studying Information and Communication Technology with focus on Full-Stack Development, Cloud Computing, and DevOps. Developed multiple practical projects including Web-Based Slip Verification System and CDN Upload Platform.",
    type: "education"
  }
];

export default function Timeline() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="min-h-screen relative flex flex-col text-left max-w-full px-10 justify-evenly mx-auto items-center"
    >
      <h3 className="sectionTitle">Journey</h3>

      <div className="w-full max-w-6xl mx-auto mt-20 mb-10">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-accent/30" />

          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`relative flex items-center justify-between mb-8 ${
                index % 2 === 0 ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                <h4 className="text-xl font-semibold text-textPrimary">{item.title}</h4>
                <p className="text-accent">{item.organization}</p>
                <p className="text-sm text-textSecondary">{item.date}</p>
                <p className="mt-2 text-textSecondary">{item.description}</p>
              </div>

              {/* Icon */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center z-10">
                {item.type === 'work' ? (
                  <FaBriefcase className="text-accent w-6 h-6" />
                ) : (
                  <FaGraduationCap className="text-accent w-6 h-6" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
