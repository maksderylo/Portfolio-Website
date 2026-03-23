import './styles/App.css';
import './styles/compstyles.css';
import React from 'react';
import Home from './components/Home';
import Navigation from './components/Navigation';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';

/**
 * Portfolio Blog Website Application
 *
 * This is a personal portfolio and technical blog website built with React.
 * It features:
 * - A home page with professional introduction and career highlights
 * - A searchable blog with tag filtering for technical articles
 * - Individual blog post pages with markdown rendering, math support, and syntax highlighting
 *
 * The blog focuses on software engineering, machine learning research, and technical topics.
 */
const App = () => {
  return (
    <div id='app-root'>
      {/* Main navigation header */}
      <Navigation />

      {/* Main content area with routing */}
      <main>
        <Routes>
          {/* Home: Professional introduction and highlights */}
          <Route path="/" element={<Home />} />

          {/* Blog: List of all blog posts with search and filtering */}
          <Route path="/blog" element={<Blog />} />

          {/* Blog Post: Individual article with full markdown rendering */}
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </main>

      {/* Footer with additional links and info */}
      <Footer />
    </div>
  );
};

export default App;