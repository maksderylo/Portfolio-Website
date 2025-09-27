import './styles/App.css';
import './styles/compstyles.css';
import React from 'react';
import Home from './components/Home';
import Navigation from './components/Navigation';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div id='app-root'>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;