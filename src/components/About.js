import React from 'react';
import me from './svg/me2.jpg';
import studyrum from './svg/studyrum.png';
import quantum from './svg/quentumPoker.png';

const About = () => {
  return (
    <div className='About simple-about'>
      <section className='about-hero'>
        <div className='about-text'>
          <h1>About Me</h1>
          <p>I'm <strong>Maks Deryło</strong>, a Computer Science student and passionate software developer who enjoys building practical, clear, and robust solutions.</p>
          <p>This simplified portfolio focuses on the essentials: who I am and what I've worked on.</p>
        </div>
        <div className='about-photo'>
          <img src={me} alt='Maks' />
        </div>
      </section>

      <section className='about-section'>
        <h2>Selected Highlights</h2>
        <ul className='highlights'>
          <li>Competitive programming background (graphs, DP, algorithms)</li>
          <li>Full‑stack web app: student forum (React + Express + Docker)</li>
          <li>Educational game: Quantum Poker (Java + Swing)</li>
          <li>Strong interest in performance & code clarity</li>
        </ul>
      </section>

      <section className='about-section'>
        <h2>Projects Snapshot</h2>
        <div className='project-cards'>
          <div className='project-card'>
            <img src={studyrum} alt='Student forum project' />
            <h3>Student Forum</h3>
            <p>Full stack forum platform with authentication, posts, reactions, and Dockerized setup.</p>
            <p><a href='https://github.com/maksderylo/studyrum' target='_blank' rel='noreferrer'>View Repo</a></p>
          </div>
          <div className='project-card'>
            <img src={quantum} alt='Quantum poker project' />
            <h3>Quantum Poker</h3>
            <p>Educational Java game introducing quantum concepts in a playful way.</p>
          </div>
        </div>
      </section>

      <section className='about-section'>
        <h2>Languages</h2>
        <p>Polish (Native) · English (C1) · German (B1) · Dutch (A1)</p>
      </section>
    </div>
  );
};

export default About;