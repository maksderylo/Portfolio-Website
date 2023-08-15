import { useEffect } from 'react';
import '../styles/about.css'
import aboutintr from './svg/aboutintr.jpg'


const About = (props) => {

    setTimeout(function(){
        window.dispatchEvent(new Event('resize'));
        console.log("resized")
    }, 1500);

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
            <h2>I'm Maks Deryło.<br/>Software Developer &<br/> Computer Science Student at TU/E</h2>      
        </div>
        <div className='forimg'>
                <img id='aboutintr' src={aboutintr} alt='image of me'></img>
        </div>
        <div className='smallspace'></div>
        
            
        </div>

        <div id='sections'>
        <h1>Professional Timeline</h1>
        <section>
        <div className='grid'>
        <article>
        <h3>Giganci Programowania Course</h3>
        <h4>June 2017 – July 2017</h4>
        <p>Developed C# and HTML programming skills, used HTML, CSS, and JavaScript to create project websites. </p>
      </article>
      <article>
        <h3>SAP Cybersecurity Virtual Internship Program</h3>
        <h4>June 27th, 2022</h4>
        <p>Finished virtual internship program for SAP USA on cybersecurity, worked on industry analysis and anti-phishing tactics.</p>
      </article>
      <article>
        <h3>Club of Young Scientists</h3>
        <h4>Feb. 2019 – June 2019</h4>
        <p>Course in the field of computer science and physics made by Warsaw Higher School of Computer Science, interdisciplinary classes with a group project - a website describing particular celestial bodies.</p>
      </article>
      <article>
        <h3>13:30 AM</h3>
        <p>Yeah, but your scientists were so preoccupied with whether or not they could, they didn't stop to think if they should. </p>
        <img src="https://images.fineartamerica.com/images-medium-large-5/maroon-bells-aspen-colorado-black-and-white-photography-by-sai.jpg" alt="Black and white photo of a lake"/>
    </article>
        <article>
        <h3>14:30 AM</h3>
        <p>Just my luck, no ice. God help us, we're in the hands of engineers. </p>
      </article>
      <article>
        <h3>15:30 AM</h3>
        <p>I gave it a cold? I gave it a virus. A computer virus. </p>
      </article>
      <article>
        <h3>16:30 AM</h3>
        <p>God creates dinosaurs. God destroys dinosaurs. God creates Man. Man destroys God. Man creates Dinosaurs. </p>
      </article>
      <article>
        <h3>17:30 AM</h3>
        <p>What do they got in there? King Kong?  </p>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Eiffel_tower_at_Exposition_Universelle%2C_Paris%2C_1889.jpg/1200px-Eiffel_tower_at_Exposition_Universelle%2C_Paris%2C_1889.jpg" alt="Black and White Eiffel Tower"/>
        </article>
        </div>
        </section>



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