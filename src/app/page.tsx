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

      <section id="footer" className="snap-start">
        <Footer />
      </section>

      <BackToTop />
    </div>
  );
}
