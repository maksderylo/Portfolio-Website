import './styles/App.css';
import './styles/compstyles.css';
import {React, useState, useEffect, useRef, useCallback } from "react";
import Home from './components/Home'
import Navigation from './components/Navigation';
import About from './components/About';
import Footer from './components/Footer'/*
import Courses from './components/Courses';*/
import Contact from './components/Contact'
import {Routes, Route} from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { motion} from "framer-motion";
import Particlees from './components/Particlees';


//animations etc





//

const App = () =>{
  useEffect(() =>{
    window.scrollTo(0,0);
},[]);




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
      };

      requestAnimationFrame(raf);
    }, [])

    const childRef = useRef();

     function doSomething(where){
      setColorLight()
      childRef.current.doSomething(where);
      setColorLight()
    };
    
    const [showParticles, setShowParticles] = useState(true);
    const [showWelcome, setShowWelcome] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

  const handleClick = () => {
    setIsAnimated(true);
    setTimeout(()=>{
      setShowParticles(false);
    },1000)
    setTimeout(()=>{
      setShowWelcome(false);
    },3000)
    
  };


    

  return (
    <>
    <div id='viewport'>
    <div id='all'>
    {showWelcome && (
      <motion.div id='enter'>
      
      <div id="page">
      
      <div className="container">
      
        
      {showParticles && (
        <>
        <Particlees/>
        
        <button onClick={handleClick}>Ye</button>
        </>
        )}
        <motion.div id='fristfromtop'
        animate={isAnimated ? { top: "-300vh"} : {top: "100vh"}}
        transition={{ type: "tween", stiffness: 100, damping: 10, duration: 1.5, delay: 0.5, }}>
        </motion.div>
        </div>
        
      </div>
        
    </motion.div>)}
    
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