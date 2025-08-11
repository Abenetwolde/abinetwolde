'use client';

import dynamic from "next/dynamic";
import { data } from "@/types/main";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Socials from "@/components/Socials";
import Contact from "@/components/Contact";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
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
  loading: () => <SectionLoading sectionName="Projects" />, // Optional fallback
  ssr: false // If you want to disable server-side rendering for this component
});

const Skills = dynamic(() => import("@/components/skills/Skills"), {
   loading: () => <SectionLoading sectionName="Skills" />,
  ssr: false
});

const Experiences = dynamic(() => import("@/components/experiences/Experiences"), {
  loading: () => <SectionLoading sectionName="Experiences" />,
  ssr: false
});

interface Props {
  data: any;
}

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
      <Hero mainData={data.main} />
      <Socials socials={data.socials} />
      <About aboutData={data.about} name={data.main.name} />
      
      {/* These sections load only when the user scrolls near them */}
      <Projects projectsData={data.projects} />
      <Skills skillData={data.skills} />
      <Experiences
        experienceData={data.experiences}
        educationData={data.educations}
      />

      {/* <Contact /> */}
      <Footer socials={data.socials} name={data.main.name} />
    </>
  );
};

export default HomePage;
