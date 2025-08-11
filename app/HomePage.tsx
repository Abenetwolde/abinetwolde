'use client';

import dynamic from "next/dynamic";
import { data } from "@/types/main";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Socials from "@/components/Socials";
import Contact from "@/components/Contact";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect, Suspense, useRef, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
// Reusable loading component
const SectionLoading = ({ sectionName }: { sectionName: string }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      minHeight: "200px", // Prevent layout shift
      marginTop: "2rem", // Position near top
      padding: "1rem",
    }}
  >
    <CircularProgress
      size={40} // Larger size for visibility
      sx={{
        color: (theme) => (theme.palette.mode === "dark" ? "#a78bfa" : "#7c3aed"), // Violet-500 (dark) or Violet-600 (light)
      }}
      aria-label={`Loading ${sectionName} section`}
    />
    <span style={{ marginLeft: "1rem", fontSize: "1.2rem" }}>
      Loading {sectionName}...
    </span>
  </Box>
);

// Dynamically import large/heavy sections
const Projects = dynamic(() => import("@/components/projects/Projects"), {

  ssr: false,
});

const Skills = dynamic(() => import("@/components/skills/Skills"), {
 
  ssr: false,
});

const Experiences = dynamic(() => import("@/components/experiences/Experiences"), {

  ssr: false,
});

interface Props {
  data: any;
}

// Custom LazyLoad component using IntersectionObserver
const LazyLoad = ({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once loaded
        }
      },
      {
        rootMargin: "200px", // Load when within 200px of viewport (preloads slightly early)
        threshold: 0.1, // Trigger when 10% visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return <div ref={ref}>{isVisible ? children : fallback}</div>;
};

const HomePage = ({ data }: Props) => {
  useEffect(() => {
    const handleHashChange = () => {
      // Send to your analytics tool, e.g., via a custom event or Loglib API
      console.log('Current path:', window.location.hash); // Placeholder for analytics send
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      <Header logo={data.main.name} />
      {/* Use LazyLoad for Hero section */}
     <Header logo={data.main.name} />
      {/* Use LazyLoad for Hero section */}

          <Hero mainData={data.main} />
   

      <Socials socials={data.socials} />
      {/* Wrap About section in LazyLoad and Suspense */}
      <LazyLoad fallback={<SectionLoading sectionName="about" />}>
        <Suspense fallback={<SectionLoading sectionName="about" />}>
          <About aboutData={data.about} name={data.main.name} />
        </Suspense>
      </LazyLoad>

      {/* Wrap dynamic sections in LazyLoad and Suspense */}
      <Suspense fallback={<SectionLoading sectionName="projects" />}>
        <LazyLoad fallback={<SectionLoading sectionName="projects" />}>
          <Projects projectsData={data.projects} />
        </LazyLoad>
      </Suspense>

      <Suspense fallback={<SectionLoading sectionName="skills" />}>
        <LazyLoad fallback={<SectionLoading sectionName="skills" />}>
          <Skills skillData={data.skills} />
        </LazyLoad>
      </Suspense>

      <Suspense fallback={<SectionLoading sectionName="experiences" />}>
        <LazyLoad fallback={<SectionLoading sectionName="experiences" />}>
          <Experiences
            experienceData={data.experiences}
            educationData={data.educations}
          />
        </LazyLoad>
      </Suspense>

      {/* <Contact /> */}
      <Footer socials={data.socials} name={data.main.name} />
    </>
  );
};

export default HomePage;