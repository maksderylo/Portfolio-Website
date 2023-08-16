import './styles/App.css';
import './styles/compstyles.css';
import {React, useState, useEffect, useRef} from "react";
import Home from './components/Home'
import Navigation from './components/Navigation';
import About from './components/About';
import Footer from './components/Footer'
import {Routes, Route} from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { motion} from "framer-motion";
import LogoVid from './logovid.mp4';
import LogoLoop from './logoloop.mp4';
import Blog from './components/Blog';
import Blogpost from './components/Blogpost';


const App = () =>{
  const [intro, setIntro] = useState(true);

  useEffect(() =>{
    
    setTimeout(()=>{
      setIntro(false);
    },4200)
},[]);

  //colormode
  const [colormode, setColormode] = useState("light");

    const setColorDark = () => {
      setColormode("dark");
  }
  const setColorLight = () => {
      setColormode("light");
  }

  const lenis = new Lenis({
    duration: 2,
  })
  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  };

    useEffect(() =>{
      

      requestAnimationFrame(raf);
    }, [raf])

    const childRef = useRef();

     function doSomething(where){
      childRef.current.doSomething(where);
      lenis.resize();
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
    <motion.div  id='viewport'

    >
    <div id='all'>
    {showWelcome && (
      <motion.div id='enter'>
      
      <div id="page">
      
      <div className="container">
      
        
      {showParticles && (
        <div id='back'>
          {intro && (
        <video id='a' autoPlay muted
        >
          
        <source src={LogoVid} type="video/mp4" />
      </video>)}
      <video id='b' autoPlay muted loop>
        <source src={LogoLoop} type="video/mp4" />
      </video>
      <motion.button onClick={handleClick} id='open'
      initial={{opacity: 0,}}
      animate={{opacity: 1}}
      transition={{duration: 1, delay: 3}}
      >Click to open</motion.button>
        </div>
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
      <Navigation ref={childRef} lenis={lenis} />
      <Routes>
          <Route path="/" element={<Home doSomething={doSomething} setColorLight={setColorLight} setColorDark={setColorDark}/>}/>
          <Route  path="/about" element={<About setColorLight={setColorLight}/>} />
          <Route path="/blog" element={<Blog/>}/>
          <Route path="/blog/:slug" element={<Blogpost />}/>
      </Routes>
      <Footer />
    </div>
    </motion.div>
    </div>
    </motion.div>
    </>
  );
}

export default App;