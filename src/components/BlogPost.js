import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { loadPostBySlug } from '../utils/postLoader';

// Image assets in posts directory (non-recursive). This lets us map relative markdown image references like (img.png)
// to the actual bundled asset URL.
const imagesContext = require.context('../posts', false, /\.(png|jpe?g|gif|svg)$/);
const imageMap = imagesContext.keys().reduce((acc, key) => {
  acc[key.replace('./', '')] = imagesContext(key);
  return acc;
}, {});

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPost = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const postData = await loadPostBySlug(slug);

      if (postData) {
        setPost(postData);
      } else {
        setError('Post not found');
        setPost(null);
      }
    } catch (err) {
      setError('Failed to load post');
      console.error('Error loading post:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="blog-post-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-container">
        <div className="error">
          <h1>Post not found</h1>
          <p>The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-container">
      <article className="blog-post">
        <header className="post-header">
          <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
          <div className="post-meta">
            <time className="post-date">{formatDate(post.date)}</time>
          </div>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-tags">
            {post.tags && post.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </header>

        <div className="post-content">
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              img({node, ...props}) {
                const src = props.src || '';
                if (src && !/^https?:/i.test(src) && !src.startsWith('/') ) {
                  const normalized = src.startsWith('./') ? src.slice(2) : src;
                  const mapped = imageMap[normalized];
                  if (mapped) {
                    return <img {...props} src={mapped} alt={props.alt || ''} />;
                  }
                }
                return <img {...props} />;
              },
              a({node, ...props}) {
                const href = props.href || '';
                // Determine if this is a downloadable asset (python script or other file under downloads/)
                const isDownloadable = /(^|\/)(downloads\/).+\.(py|zip|tar|gz|txt)$/i.test(href) || /\.py$/i.test(href);
                // Build a safe href respecting PUBLIC_URL (for GH Pages subpaths) and avoiding hash-router interception
                let resolved = href;
                if (isDownloadable) {
                  const pub = process.env.PUBLIC_URL || '.';
                  // Normalize leading slashes to support relative hosting
                  if (href.startsWith('/')) {
                    resolved = `${pub}${href}`;
                  } else if (!href.startsWith(pub)) {
                    resolved = `${pub}/${href}`.replace(/\\+/g, '/');
                  }
                }
                return (
                  <a
                    {...props}
                    href={resolved}
                    download={isDownloadable ? '' : undefined}
                    rel={props.rel || (isDownloadable ? 'noopener noreferrer' : undefined)}
                  />
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
