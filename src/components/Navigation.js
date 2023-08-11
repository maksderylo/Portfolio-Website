import { motion } from 'framer-motion';
import { useState } from "react";
import React from 'react';
import {useNavigate} from 'react-router-dom';
import logo from './svg/logo.png';
import logodark from './svg/logodark.png';

const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: () => {
      const delay = 1.5;
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
          opacity: { delay, duration: 0.01 }
        }
      };
    },
    hidde: () => {
        const delay = 0;
        return {
          pathLength: 0,
          transition: {
            pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
          }
        };
      }
  };
  
  


const Navigation = () =>{
  const navigate = useNavigate();
  const [menuState, setMenu] = useState("closed");
    
    
    function navHome(where){
      setMenu("fullscreen");

      setTimeout(function(){
        window.scrollTo(0, 0);
        navigate(`${where}`);
        setTimeout(function(){
          setMenu("closed");
      }, 1500);
    }, 500);
    
    
    };

    const setMenuDiff = () => {
        setMenu(menuState === "closed" ? "open" : "closed"); 
    }

    return (
        <>
        <motion.div className='menu'
        animate={menuState}
        variants={{
            open: { top: -90,
                  height: "90vh",
                    transition: {
                    delay:0.5,
                    duration: 1.5,
                    type: "spring"
                }
            },
            closed: { top: "min(-91vh,-500px)",
                    height: "90vh",
                    transition: {
                    type: "spring",
                    duration: 1.5
                }
            },
            fullscreen: {
              height: "calc(90px + 100vh)",
              top: "-90px",
              borderRadius: "0px 0px 0px 0px",
              transition: {
                type: "spring",
                duration: 1.5,
            }
            }
          }
          
        }
        >
    <motion.svg id='closemenu' onClick={() => setMenuDiff()}
      viewBox="0 0 200 200"
      initial="hidden"
      animate={menuState === "open" ? "visible" : "hidde"}
    >
      <motion.line
        x1="0"
        y1="0"
        x2="200"
        y2="200"
        stroke="#ff0055"
        custom={3}
        variants={draw}
      />
      <motion.line
        x1="0"
        y1="200"
        x2="200"
        y2="0"
        stroke="#ff0055"
        custom={3.5}
        variants={draw}
      />
        
    </motion.svg>
            <ul>
                <li><p className={window.location.pathname==="/" ? "active" : ""} onClick={() => navHome('/')}>Home</p></li>
                <li><p className={window.location.pathname==="/about" ? "active" : ""} onClick={() => navHome('/about')}>About</p></li>
                <li><p className={window.location.pathname==="/contact" ? "active" : ""} onClick={() => navHome('/contact')}>Contact</p></li>
            </ul>
        <div className='textbotmenu'><ul>
          <li><a href="https://github.com/maksderylo">GitHub,</a></li>
          <li><a href="https://www.linkedin.com/in/maksymilian-dery%C5%82o-677954261">LinkedIn,</a></li>
          <li><a href='mailto:derylomaksoff@gmail.com'>Mail</a></li>
          </ul></div>
    </motion.div>
        <div className="boxbehindnav"></div>
        <motion.nav className={`centered-nav`}
        animate={menuState}
        initial="closed"
        variants={{
            open: { top: -200,
              transition: {
                type: "spring",
                duration: 0.5}},
            closed: { top: 0,
              transition: {
                type: "spring",
                duration: 1.5}
          },
            fullscreen:{ top: -200,
              transition: {
                type: "spring",
                duration: 0.5}}
        }
          
        }
        >
          <div id='logo'><img src={logo} id='logoimg' alt='logo'
          /></div>
          <div id='logodark'><img src={logodark} id='logoimg' alt='logo'/></div>
        <div id="burger" onClick={() => setMenuDiff()}>
            <div className='burgerline' id='topline'></div>
            <div className='burgerline'></div>
        </div>
        
        </motion.nav>
        <motion.div className='blur' onClick={() => setMenuDiff()}
        animate={menuState}
        initial="closed"
        variants={{
          open: {
            display: "block",
            transition:{ 
              type: "spring",
              delay: 0.5
            }
          },
          closed: {
            display:"none",
            transition:{ 
              delay: 0
            }
          },
          fullscreen: {
            display: "none",
            transition:{ 
              delay: 2
            }}
        }
      } 
      
        
        ></motion.div>
        </>
    );
}

export default Navigation;