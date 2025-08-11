
import HomePage from "./HomePage"

import {projects} from "./../projectsData.js"
import { useMemo } from "react";
export default  function page() {
  // Use useMemo to memoize the projects data
  const memoizedProjects = useMemo(() => {
    return projects;
  }, [projects]);


   return <HomePage data={memoizedProjects} />;
  
}