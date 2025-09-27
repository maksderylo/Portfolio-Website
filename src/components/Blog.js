import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { loadAllPosts } from '../utils/postLoader';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const loadedPosts = await loadAllPosts();
      console.log('[Blog] loadedPosts:', loadedPosts);

      setPosts(loadedPosts);
      setFilteredPosts(loadedPosts);

      // Extract all unique tags
      const tags = [...new Set(loadedPosts.flatMap(post => post.tags || []))];
      console.log('[Blog] tags extracted:', tags);
      setAllTags(tags);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  useEffect(() => {
    let filtered = posts;
    console.log('[Blog] Filtering posts. searchTerm:', searchTerm, 'selectedTag:', selectedTag, 'input posts length:', posts.length);

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(post => post.tags && post.tags.includes(selectedTag));
    }

    // Search functionality
    if (searchTerm) {
      const fuse = new Fuse(filtered, {
        keys: ['title', 'excerpt', 'tags'],
        threshold: 0.3
      });
      const searchResults = fuse.search(searchTerm);
      filtered = searchResults.map(result => result.item);
    }

    console.log('[Blog] filtered result length:', filtered.length);
    setFilteredPosts(filtered);
  }, [searchTerm, selectedTag, posts]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="blog-container">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Blog @maksderylo</h1>
      </div>

      <div className="blog-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="tag-filter">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="tag-select"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="posts-grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <article key={post.slug} className="post-card">
              <div className="post-meta">
                <time className="post-date">{formatDate(post.date)}</time>
              </div>
              <h2 className="post-title">
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="post-excerpt">{post.excerpt}</p>
              <div className="post-tags">
                {post.tags && post.tags.map(tag => (
                  <span
                    key={tag}
                    className="tag"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link to={`/blog/${post.slug}`} className="read-more">
                Read More →
              </Link>
            </article>
          ))
        ) : (
          <div className="no-posts">
            <p>No posts found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
