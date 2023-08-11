import { useState } from "react";
import React from 'react';
import {useNavigate} from 'react-router-dom';


const Footer = () => {

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


    return(
        <footer>
            <div id='footmenu'>
            <p>Made by maksderylo</p>
            </div>

        <div className='textbotmen'><ul>
          <li><a href="https://github.com/maksderylo">GitHub,</a></li>
          <li><a href="https://www.linkedin.com/in/maksymilian-dery%C5%82o-677954261">LinkedIn,</a></li>
          <li><a href='mailto:derylomaksoff@gmail.com'>Mail</a></li>
        </ul>
        </div>


        </footer>

    );

}

export default Footer;