import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import Laptop from "./svg/laptop.svg"
import Server from "./svg/server.svg"
import Headphones from "./svg/headphones.svg"
import Luggage from "./svg/travel.svg"
import Me from './svg/me.jpg'


const AniFromR = {
    initial:{
        marginRight: -1000,
    },
    animate:{
        marginRight: -20,
        transition:{
        duration:0.5,
        type:"spring"

    }
}
}

const textappear = {
    initial: {
        y: "200%",
    },
    animate: {
        y: 0
    },
    transition: {
        duration:0.75,
        ease: [0.455, 0.03, 0.515, 0.955],
    }
}

const characterAnimation = {
    hidden: {
      opacity: 0,
      y: `0.25em`,
    },
    visible: {
      opacity: 1,
      y: `0em`,
      transition: {
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };





const Home = (props) => {


    function navHome(where){
        setColorLight();
        props.doSomething(where);
        setColorLight();
    };
    
    //variables
    const {scrollYProgress} = useScroll();
    const x = useTransform(scrollYProgress, [0,1], [-20,400] );
    const x1 = useTransform(scrollYProgress, [0,0.5], [-300,200] );
    const x2 = useTransform(scrollYProgress, [0,1], [-300,500] );
    const x3 = useTransform(scrollYProgress, [0,1], [-400,600] );
    const x4 = useTransform(scrollYProgress, [0,1], [-1400,2600] );
    const x5 = useTransform(scrollYProgress, [0,1], [-400,600] );
    const x6 = useTransform(scrollYProgress, [0,1], [-100,3000] );
    const x7 = useTransform(scrollYProgress, [0,1], [300,400] );
    const x8 = useTransform(scrollYProgress, [0,1], [-200,1700] );
    const x9 = useTransform(scrollYProgress, [0,1], [-400,1300] );

    const [scrollY, setScrollY] = useState(0);

    //useref to get divs y coordinate
    const programming = useRef();
    const [programmingy, setProgrammingy] =useState();
    const hardware = useRef();
    const [hardwarey, setHardwarey] =useState();
    const travelling = useRef();
    const [travellingy, setTravellingy] =useState();
    const web = useRef();
    const [weby, setWeby] =useState();
    const music = useRef();
    const [musicy, setMusicy] =useState();

    const getPositions = () =>{
        setProgrammingy(programming.current.offsetTop);
        setHardwarey(hardware.current.offsetTop);
        setTravellingy(travelling.current.offsetTop);
        setWeby(web.current.offsetTop);
        setMusicy(music.current.offsetTop)
    }


    const setColorLight = () =>{
        props.setColorLight();
    }
    const setColorDark = () =>{
        props.setColorDark();
    }
    
    //use effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if(window.scrollY-web.current.offsetTop>0){
        setColorDark();
      }
      else{
        setColorLight();
      }
    };

    getPositions();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize',getPositions);

    setTimeout(function(){
        getPositions();
    },200)

    const timer = setTimeout(() => {
        console.log(scrollY);
        setScrollY(window.scrollY);
      }, 5500);



    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', getPositions);
      clearTimeout(timer);
    };
    
  }, []);

  


  //in view animations
  const controls =useAnimation();
  const [refgreet,inViewGreet]=useInView();


  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(()=>{
        if(inViewGreet){
            controls.start("appear");
            setTimeout(()=>{
                controls.start("visible");
            },750)
        }

        

  },[controls,inViewGreet])




  const stylename = {
    clipPath: `polygon(0px 0px, 100% 0px, 100% ${(scrollY/3)}%, 0px ${(scrollY/3)}%)`,
    right: (x),
  };
  const style1 = {
    clipPath: `polygon(0px 0px, 100% 0px, 100% ${(scrollY/3-programmingy/3+100)}%, 0px ${(scrollY/3-programmingy/3+100)}%)`,
    left: (x1),
  };
  const style2 = {
    clipPath: `polygon(0px 0px, 100% 0px, 100% ${(scrollY/3-hardwarey/3+100)}%, 0px ${(scrollY/3-hardwarey/3+100)}%)`,
    right: (x2),
  };
  const style3 = {
    clipPath: `polygon(0px 0px, 100% 0px, 100% ${(scrollY/3-travellingy/3+100)}%, 0px ${(scrollY/3-travellingy/3+100)}%)`,
    left: (x3)
  };
  const style4 = {
    clipPath: `polygon(0px 0px, 100% 0px, 100% ${(scrollY/3-musicy/3+100)}%, 0px ${(scrollY/3-musicy/3+100)}%)`,
    right: (x5)
  };
  const style5 = {
    clipPath: `polygon(0px 0px, 100% 0px, 100% ${(scrollY/4-weby/4+100)}%, 0px ${(scrollY/4-weby/4+100)}%)`,
  };

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    slickPlay: 1,
    autoplay: true,
  };

    return (

        <div className="Home">
            <div className="hugespace"></div>
            {/* <button onClick={() => {}}>clickme</button> */}
            <div ref={refgreet} className="greetings">
                <div className="textbox">
                    <motion.h1  {...textappear}>HI I'M</motion.h1>
                </div>
                <div className="textbox2" id="namebox">
                    <motion.h2 style={{marginRight: x}} id="name"
                    {...AniFromR}
                    >MAKS</motion.h2>
                    <motion.h2  style={stylename}  id="overname">MAKS</motion.h2>
                    <div className="shape">
                        <img id="me" src={Me} alt="img of me"></img>
                    </div>
                </div>
                <div className="textbox">
                    <motion.h1 {...textappear}>A PERSON WITH A</motion.h1>
                </div>
                <div className="textbox">
                    <motion.h1 {...textappear}>PASSION FOR</motion.h1>
                </div>
                <div className="hugespace"></div>
                <div className="textbox2" ref={programming}>
                    <motion.img style={{left:x6}} src={Laptop}  alt="laptop"
                    animate={"visible"}
                    variants={{
                        visible: {
                            opacity:1,
                                translateY: [0,-5,10,0],
                                rotate: [6,-10,6],
                                translateX: [0,-4,4,0],
                                transition: {
                                duration: 7,
                                ease: "easeInOut",
                                repeat: Infinity,
                                delay:0     
                            }
                        }
                    }
                    }
                    ></motion.img>
                    <motion.h2 className="textl" 
                     style={{marginLeft:x1}}>PROGRAMMING</motion.h2>
                    <motion.h2 className="textlover" style={style1}>PROGRAMMING</motion.h2>
                </div>
                <div className="textbox2" ref={hardware}>
                    <motion.img style={{right:x7}} src={Server} alt="server"
                    animate={"visible"}
                    variants={{
                        visible: {
                            opacity:1,
                                translateY: [0,5,-3,0],
                                rotate: [12,-12,12],
                                translateX: [0,3,-8,0],
                                transition: {
                                duration: 5,
                                ease: "easeInOut",
                                repeat: Infinity,
                                delay:0     
                            }
                        }
                    }
                    }></motion.img>
                    <motion.h2 className="textr" {...textappear} style={{marginRight:x2}}>HARDWARE</motion.h2>
                    <motion.h2 className="textrover" style={style2}>HARDWARE</motion.h2>
                </div>
                <div className="textbox2" ref={travelling}>
                    <motion.img style={{left:x8}} src={Luggage} alt="luggage"
                    animate={"visible"}
                    variants={{
                        visible: {
                            opacity:1,
                                translateY: [0,9,-1,0],
                                rotate: [-4,12,-4],
                                translateX: [0,-8,2,0],
                                transition: {
                                duration: 6,
                                ease: "easeInOut",
                                repeat: Infinity,
                                delay:0     
                            }
                        }
                    }
                    }
                    ></motion.img>
                    <motion.h2 className="textl" {...textappear} style={{marginLeft:x3}}>TRAVELLING</motion.h2>
                    <motion.h2 className="textlover" style={style3}>TRAVELLING</motion.h2>
                </div>
                <div className="textbox2" ref={music}>
                    <motion.img style={{right:x9}} src={Headphones} alt="headphones"
                    animate={"visible"}
                    variants={{
                        visible: {
                            opacity:1,
                                translateY: [0,5,-3,0],
                                rotate: [12,-12,12],
                                translateX: [0,3,-8,0],
                                transition: {
                                duration: 7,
                                ease: "easeInOut",
                                repeat: Infinity,
                                delay:0     
                            }
                        }
                    }
                    }
                    ></motion.img>
                    <motion.h2 className="textr" {...textappear} style={{marginRight:x5}}>MUSIC</motion.h2>
                    <motion.h2 className="textrover" style={style4}>MUSIC</motion.h2>
                </div>
                <div ref={web} className="textbox"><motion.h3 {...textappear}>BUT MOST IMPORTANTLY!</motion.h3></div>
                <div className="textbox2" id="webbox" ref={web}><motion.h2 id="web">WEB</motion.h2>
                    <motion.h2 id="overweb" style={style5}>WEB</motion.h2>
                </div>
                <motion.div ref={ref} className="centertext"><motion.p variants={characterAnimation}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}>Because I think browsing should always
                     be an amazing experience, I am fueled by the ability to express myself 
                     through code and create immersive digital wonders that captivate and inspire.
                      With each line I write, I strive to push boundaries, blend functionality with 
                      aesthetics, and elevate the online world to new heights, ensuring that users are
                       met with unforgettable
                     journeys that leave <span style={{color: "#cab99a", fontWeight: "bolder"}}>a lasting impact.</span> </motion.p></motion.div>
            </div>
                <div className="smallspace"></div>
                <div id="relocatebuttons">
                    <ul>
                        <li><p onClick={() => navHome('/about')}>About me</p><div className="behind"></div></li>
                        <li><p onClick={() => navHome('/contact')}>Work!</p><div className="behind"></div></li>
                    </ul>
                    
                </div>
                    
        </div>
    );
}

export default Home;