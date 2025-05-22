'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaGithub, FaStar, FaCodeBranch, FaSearch } from 'react-icons/fa';

// Repository data type
type Project = {
  title: string;
  description: string;
  tags: string[];
  link: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState<'stars' | 'recent'>('stars');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://api.github.com/users/zofirst/repos');
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repos = await response.json();
        
        const transformedProjects = repos
          .filter((repo: any) => !repo.fork)
          .map((repo: any) => ({
            title: repo.name,
            description: repo.description || 'No description available',
            tags: [repo.language, ...(repo.topics || [])].filter(Boolean),
            link: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language || 'Unknown',
            updatedAt: repo.updated_at
          }));

        setProjects(transformedProjects);
        setFilteredProjects(transformedProjects);
      } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        setError('Failed to load repositories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let result = [...projects];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag && tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply language filter
    if (selectedLanguage !== 'all') {
      result = result.filter(project => project.language === selectedLanguage);
    }
    
    // Apply sorting
    result = result.sort((a, b) => {
      if (sortBy === 'stars') {
        return b.stars - a.stars;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    setFilteredProjects(result);
  }, [searchTerm, selectedLanguage, sortBy, projects]);

  const languages = ['all', ...Array.from(new Set(projects.map(project => project.language).filter(Boolean)))];

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="min-h-screen relative flex flex-col text-left max-w-full px-10 justify-evenly mx-auto items-center"
    >
      <h3 className="sectionTitle">Projects</h3>

      <div className="w-full max-w-6xl mx-auto mt-20 mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 rounded-lg text-textPrimary placeholder-textSecondary border border-accent/20 focus:border-accent/40 outline-none"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2 bg-secondary/50 rounded-lg text-textPrimary border border-accent/20 focus:border-accent/40 outline-none"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang === 'all' ? 'All Languages' : lang}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'stars' | 'recent')}
              className="px-4 py-2 bg-secondary/50 rounded-lg text-textPrimary border border-accent/20 focus:border-accent/40 outline-none"
            >
              <option value="stars">Most Stars</option>
              <option value="recent">Recently Updated</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-20">
            <p className="text-2xl">{error}</p>
          </div> 
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-secondary/30 rounded-lg overflow-hidden hover:bg-secondary/50 transition-colors duration-300"
              >
                <div className="group relative h-48 cursor-pointer" onClick={() => window.open(project.link, '_blank')}>
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <FaGithub className="w-20 h-20 text-gray-700" />
                  </div>
                  <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <FaGithub className="w-12 h-12 text-accent" />
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h4 className="text-xl font-semibold text-textPrimary truncate">
                    {project.title}
                  </h4>

                  <p className="text-textSecondary text-sm line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between text-textSecondary">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <FaStar className="text-accent" />
                        <span>{project.stars}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaCodeBranch className="text-accent" />
                        <span>{project.forks}</span>
                      </div>
                    </div>
                    <div className="text-xs">
                      Updated: {formatDate(project.updatedAt)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 4).map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className="px-2 py-1 text-xs rounded-full text-textSecondary border border-accent/20"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="px-2 py-1 text-xs rounded-full text-textSecondary border border-accent/20">
                        +{project.tags.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && !error && filteredProjects.length === 0 && (
          <div className="text-center text-textSecondary py-20">
            <p className="text-2xl">No projects found matching your criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedLanguage('all');
                setSortBy('stars');
              }}
              className="mt-4 px-6 py-2 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <div className="w-full absolute top-[30%] bg-accent/10 left-0 h-[500px] -skew-y-12 -z-10" />
    </motion.div>
  );
}