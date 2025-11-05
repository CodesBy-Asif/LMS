'use client'
import Heading from "./utils/Heading";
import Header from './components/Header/Header'
import { useState } from "react";
import Hero from "./components/Hero/Hero";
import Courses from "./components/Courses/Courses";
import Reviews from "./components/Reviews/Review";
import Footer from "./components/Footer/Footer";
import Faq from "./components/Faq/Faq";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [Route,setRoute]=useState("Login");
  
  return (
 <>
    <Heading
      title="Edura"
      description="Edura is a free and open source learning management system."
      keywords="Edura, LMS, free, open source, learning management system"
    />
    <Header open={open} setOpen={setOpen} activeItem={activeItem} route={Route} setRoute={setRoute}/>
<Hero/>
<Courses/>
<Reviews/>
<Faq/>
<Footer/>
 </>
  );
}
