import { FaNodeJs } from "react-icons/fa"
import HomePage from "./HomePage"
// import data from "./../data.json"
import {projects} from "./../projectsData.js"
// import { ref, get } from "firebase/database"
// import { database } from "@/firebase"

// async function getData() {

//   // return await (await get(ref(database))).val()

//   const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL + '/.json'
//   const res = await fetch(DB_URL, { cache: 'no-store' })
//   const data = res.json()
//   return data
// }

export default  function page() {
const alldatas:any=projects
  // const data = await getData()


   return <HomePage data={projects} />;
  
}