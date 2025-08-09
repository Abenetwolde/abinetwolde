'use client';

import dynamic from "next/dynamic";
import { data } from "@/types/main";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Socials from "@/components/Socials";
import Contact from "@/components/Contact";
import Header from "./Header";
import Footer from "./Footer";

// Dynamically import large/heavy sections
const Projects = dynamic(() => import("@/components/projects/Projects"), {
  loading: () => <p>Loading projects...</p>, // Optional fallback
  ssr: false // If you want to disable server-side rendering for this component
});

const Skills = dynamic(() => import("@/components/skills/Skills"), {
  loading: () => <p>Loading skills...</p>,
  ssr: false
});

const Experiences = dynamic(() => import("@/components/experiences/Experiences"), {
  loading: () => <p>Loading experiences...</p>,
  ssr: false
});

interface Props {
  data: any;
}

const HomePage = ({ data }: Props) => {
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
