import './styles/App.css';
import './styles/compstyles.css';
import {React, useState, useEffect, useRef } from "react";
import Home from './components/Home'
import Navigation from './components/Navigation';
import About from './components/About';
import Footer from './components/Footer'/*
import Courses from './components/Courses';*/
import Contact from './components/Contact'
import {Routes, Route} from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { motion} from "framer-motion";
import logoi from './logoi.png'



//animations etc
const goupenter = {
  initial: {
    top: 0
  },
  animate: {
      top: - window.innerHeight - 300
  },
  transition: {
      duration:1.5,
      ease: [0.455, 0.03, 0.515, 0.955],
      delay: 5
  }
}




const textappear1 = {
  initial: {
      y: "200%",
  },
  animate: {
      y: 0
  },
  transition: {
      duration:0.75,
      ease: [0.455, 0.03, 0.515, 0.955],
      delay: 1
  }
}

const textappear2 = {
  initial: {
      y: "200%",
  },
  animate: {
      y: 0
  },
  transition: {
      duration:0.75,
      ease: [0.455, 0.03, 0.515, 0.955],
      delay: 1.5
  }
}
const textappear3 = {
  initial: {
      y: "200%",
  },
  animate: {
      y: 0
  },
  transition: {
      duration:0.75,
      ease: [0.455, 0.03, 0.515, 0.955],
      delay: 2
  }
}
const textappear0 = {
  initial: {
      y: "200%",
  },
  animate: {
      y: 0
  },
  transition: {
      duration:0.75,
      ease: [0.455, 0.03, 0.515, 0.955],
      delay: 0.5
  }
}



//

const App = () =>{
  useEffect(() =>{
    window.scrollTo(0,0);
},[]);



  const [, setShowOverflow] = useState(false);
  const [visibility,] = useState(true);

  //colormode
  const [colormode, setColormode] = useState("light");

    const setColorDark = () => {
      setColormode("dark");
  }
  const setColorLight = () => {
      setColormode("light");
  }


    useEffect(() =>{
      const lenis = new Lenis({
        duration: 2,
      })
      function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)

      
      

      const timer = setTimeout(() => {
        setShowOverflow(true);
        //setVisibility(false)
      }, 5000);


    return () => {
      clearTimeout(timer);
    };

    }, [])

    document.body.style.overflow = "hidden";
    const childRef = useRef();

     function doSomething(where){
      setColorLight()
      childRef.current.doSomething(where);
      setColorLight()
    };
    
    

  return (
    <>
    <div id='viewport'>
    <div id='all'>
      <motion.div id='enter' className={visibility ? 'visibilitytru' : 'visibilityhid'} {...goupenter}>
      <div id="page">
        <div id='logontext'>
            <motion.img src={logoi} alt='logo' {...textappear0}></motion.img>
            <motion.h1 {...textappear1}>developer, </motion.h1>
            <motion.h1 {...textappear2}>freelancer,</motion.h1>
            <motion.h1 {...textappear3}>student</motion.h1>
        </div>
        <div id='waves'></div>
      </div>
        
    </motion.div>
    <motion.div id='body2'>
    <div className={colormode}>
      <Navigation ref={childRef} colormode={colormode} />
      <Routes>
          <Route path="/" element={<Home doSomething={doSomething} setColorLight={setColorLight} setColorDark={setColorDark}/>}/>
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
      </Routes>
      <Footer />
    </div>
    </motion.div>
    </div>
    </div>
    </>
  );
}

export default App;