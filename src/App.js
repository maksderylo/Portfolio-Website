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
import Blog from './components/Blog';
import Blogpost from './components/Blogpost';
import { useLocation } from 'react-router-dom';
import Roadmap from './components/Roadmap';


const App = () =>{
  const [intro, setIntro] = useState(true);
  const location = useLocation();
  const lenis = new Lenis({
    duration: 2,
  })
  //
  useEffect(() => {
    
    console.log('Location changed to:', location.pathname);
  }, [location.pathname]);

  useEffect(() =>{
    lenis.setScroll(0);
    if(location.pathname.startsWith('/blog') || location.pathname.startsWith('/roadmap') ){
        console.log('BLOOG');
        setIntro(false);
        setIsAnimated(true);
      setShowParticles(false);
      setShowWelcome(false);
    }
    else{
    setTimeout(()=>{
      setIntro(false);
    },4200)
  }
},[]);

  //colormode
  const [colormode, setColormode] = useState("light");

    const setColorDark = () => {
      setColormode("dark");
  }
  const setColorLight = () => {
      setColormode("light");
  }


  const lenis2 = new Lenis({
    duration: 0.3,
  })



  function raf(time) {
    lenis.dimensions.resize();
    lenis.raf(time);
    requestAnimationFrame(raf)
  };
    useEffect(() =>{
      requestAnimationFrame(raf);
    }, [raf])

    const childRef = useRef();
     function doSomething(where){
      childRef.current.doSomething(where);
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
        <div id='buttoncont' onClick={handleClick}><motion.h1
        initial={{translateY: 100}}
        animate={{ translateY: 0 }}
        transition={{type: "spring", duration: 1,delay: 1 }}
        >Enter portfolio</motion.h1>
        </div>
      
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
      <Navigation ref={childRef} lenis={lenis} lenis2={lenis2}/>
      <Routes>
          <Route path="/" element={<Home doSomething={doSomething} setColorLight={setColorLight} setColorDark={setColorDark}/>}/>
          <Route  path="/about" element={<About setColorLight={setColorLight}/>} />
          <Route path="/blog" element={<Blog setColorLight={setColorLight}/>}/>
          <Route path="/blog/:slug" element={<Blogpost setColorLight={setColorLight}/>}/>
          <Route path="/roadmap" element={<Roadmap setColorLight={setColorLight} />}/>
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