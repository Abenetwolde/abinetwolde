import { FaNodeJs } from "react-icons/fa"
import HomePage from "./HomePage"

import {projects} from "./../projectsData.js"

export default  function page() {
const alldatas:any=projects

   return <HomePage data={projects} />;
  
}