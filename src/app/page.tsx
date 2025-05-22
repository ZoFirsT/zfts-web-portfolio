"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import BackToTop from "@/components/BackToTop";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import BlacklistDownloader from "@/components/BlacklistDownloader";
import { FaCode } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-primary text-white dark:bg-slate-900 h-screen snap-y snap-mandatory overflow-y-scroll overflow-x-hidden z-0 scrollbar scrollbar-track-primary/20 scrollbar-thumb-accent/80">
      <Header />
      <LanguageSelector />
      <ThemeToggle />

      <section id="hero" className="snap-start">
        <Hero />
      </section>

      <section id="about" className="snap-center">
        <About />
      </section>

      <section id="experience" className="snap-center">
        <Experience />
      </section>

      <section id="skills" className="snap-start">
        <Skills />
      </section>

      <section id="projects" className="snap-start">
        <Projects />
      </section>

      <section id="timeline" className="snap-start">
        <Timeline />
      </section>

      <section id="blog" className="snap-start">
        <Blog />
      </section>

      <section id="contact" className="snap-start">
        <Contact />
      </section>

      <section id="security-tools" className="snap-start">
        <div className="h-screen relative flex flex-col text-center max-w-7xl px-10 justify-center mx-auto items-center">
          <h3 className="uppercase tracking-[20px] text-gray-500 text-2xl mb-10">
            Open Source
          </h3>
          
          <div className="w-full max-w-3xl">
            <BlacklistDownloader 
              title="Security IP Blacklist - Open Source Initiative" 
              showIcon={true}
              variant="full"
              className="mb-10"
            />
            
            <div className="text-center text-textSecondary">
              <p className="mb-3">
                As part of our commitment to internet security, we're making our threat intelligence data freely available.
              </p>
              <p className="mb-5">
                This blacklist is updated daily and contains IPs associated with suspicious activity.
                Use this data to enhance your security systems and protect your applications.
              </p>
              
              <Link 
                href="/opensrc/blacklist" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors duration-200"
              >
                <FaCode /> View API Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="footer" className="snap-start">
        <Footer />
      </section>

      <BackToTop />
    </div>
  );
}
