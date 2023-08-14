import { useEffect } from 'react';
import '../styles/about.css'
import aboutintr from './svg/aboutintr.jpg'


const About = (props) => {
    const setColorLight = () =>{
        props.setColorLight();
    }
    console.log("about");
    setColorLight();
    useEffect(() =>{
        
    },[])

    function handleFace(){
        window.location.href = 'https://www.facebook.com/profile.php?id=100013332671297';
    }

    return (
        <div className="About">
        <div className="cont">
        <div className='textb'>  
            <h1>Hello</h1>
            <h2>I'm Maks Deryło.<br/>Software Developer &<br/> Computer Science Student</h2>      
        </div>
        <div className='forimg'>
                <img id='aboutintr' src={aboutintr} alt='image of me'></img>
        </div>
        <div className='smallspace'></div>
        <div className='iconscenter'>
        <svg onClick={handleFace} id='facebook' viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path  stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"></path>
</svg>
<svg id='instagram' viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z"></path>
   <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
   <path d="M16.5 7.5l0 .01"></path>
</svg>
<svg id='twitter' viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z"></path>
</svg>

        </div>
            
        </div>




        <h1>about</h1>
        <h1>about</h1>
        <h1>about</h1>
        <h1>about</h1>
        <h1>about</h1>
        <h1>about</h1>
        <h1>about</h1>
        <h1>about</h1>
        <h1>about</h1>
        <h1>about</h1>
        <h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
<h1>about</h1>
        <h1>about</h1>
        <h1>about</h1>
        <h1>about</h1>
        <h1>about</h1>
        <h1>about</h1>
        <h1>about</h1>
        <h1>about</h1>
        <h1>about</h1>
    </div>
    );
}

export default About;