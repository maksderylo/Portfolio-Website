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
            <h2>I'm Maks Deryło.<br/>Software Developer &<br/> Computer Science Student</h2>      
        </div>
        <div className='forimg'>
                <img id='aboutintr' src={aboutintr} alt='image of me'></img>
        </div>
        <div className='smallspace'></div>
        
            
        </div>

        <div id='sections'>

        <section>
        <div className='grid'>
        <article>
        <h3>9:00 AM</h3>
        <p>Life finds a way. You know what? It is beets. </p>
      </article>
      <article>
        <h3>10:00 AM</h3>
        <p>I've crashed into a beet truck </p>
      </article>
      <article>
        <h3>12:30 AM</h3>
        <p>I was part of something special. </p>
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