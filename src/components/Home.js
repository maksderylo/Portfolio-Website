import React from 'react';
import Me from './svg/me.jpg';

const Home = () => {
  return (
    <div className='Home simple-home'>
      <section className='hero'>
        <div className='hero-text'>
          <h1>Hi, I'm Maks</h1>
          <p>Software Engineer with experience at Goldman Sachs and TSMC, currently pursuing Computer Science at Eindhoven University of Technology.</p>
          <p>
            Specialized in full-stack development, financial technology, and machine learning research. Passionate about building scalable, high-performance applications.
          </p>
          <p>
            Currently I wish to persue masters in AI and ML and work on innovative projects in these fields.
          </p>
        </div>
        <div className='hero-image'>
          <img src={Me} alt='Maks profile' />
        </div>
      </section>

      <section className='quick-highlights'>
        <h2>Links</h2>
        <ul>
          <li><a href="/Resume.pdf" target="_blank" rel="noopener noreferrer">Download CV</a></li>
          <li><a href="https://github.com/mderylo" target="_blank" rel="noopener noreferrer">GitHub Profile</a></li>
        </ul>
      </section>

      <section className='highlights-section'>
        <h2>Professional Career Highlights</h2>
        <div className='highlights-grid'>
          <div className='highlight-card'>
            <h3>Goldman Sachs</h3>
            <p>Experience in financial technology and software development in a high-performance environment.</p>
          </div>
          <div className='highlight-card'>
            <h3>TSMC</h3>
            <p>Contributed to semiconductor technology solutions and manufacturing process optimization.</p>
          </div>
          <div className='highlight-card'>
            <h3>Eindhoven University of Technology</h3>
            <p>Computer Science studies with focus on algorithms, software engineering, and system design.</p>
          </div>
          <div className='highlight-card'>
            <h3>ML Research</h3>
            <p>Machine Learning research projects exploring innovative applications and algorithm development.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;