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

    return (
        <div className="About">
        <div className="cont">
        <div className='textb'>  
            <h1>Hello</h1>
            <h2>I'm Maks Deryło.<br/>Software Developer & Computer Science Student</h2>      
        </div>
        <div className='forimg'>
                <img id='aboutintr' src={aboutintr}></img>
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