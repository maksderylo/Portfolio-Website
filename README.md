# Portfolio Blog Website

This is a personal portfolio and technical blog website built with **React**, deployed at **maksderylo.com**.

## 🎯 Overview

A modern, responsive portfolio website featuring:
- **Professional Profile**: Personal introduction, career highlights, and contact information
- **Technical Blog**: Searchable blog with tag filtering for technical articles
- **Advanced Markdown Rendering**: 
  - Mathematical equations with KaTeX support
  - Syntax highlighting for code snippets
  - GitHub Flavored Markdown (GFM)
- **Full-Text Search**: Powered by Fuse.js for fast article discovery

## 📚 Blog Content

The blog focuses on:
- Software Engineering & System Design
- Machine Learning Research
- Full-Stack Development
- Financial Technology
- Academic Projects & Research

## 🛠 Tech Stack

- **Frontend Framework**: React 18
- **Routing**: React Router v6
- **Markdown Processing**: React Markdown with plugins
- **Math Rendering**: KaTeX + remark-math
- **Code Highlighting**: React Syntax Highlighter
- **Search**: Fuse.js (fuzzy search)
- **Deployment**: GitHub Pages

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build

# Deploy to GitHub Pages
npm run deploy
```

## 📂 Project Structure

```
src/
├── components/          # React components
│   ├── Home.js         # Profile & highlights
│   ├── Blog.js         # Blog listing with search
│   ├── BlogPost.js     # Individual post renderer
│   ├── Navigation.js   # Header navigation
│   └── Footer.js       # Footer
├── posts/              # Markdown blog posts
├── styles/             # CSS styling
└── utils/              # Helper functions (post loading, etc)

public/                 # Static assets
scripts/                # Build scripts (post index generation)
```

## 📝 Writing Blog Posts

Blog posts are written in Markdown format and placed in `src/posts/`. The build process automatically generates an index of all posts.

**Features:**
- Markdown with GFM support
- Math equations: `$...$` (inline) or `$$...$$` (block)
- Code blocks with syntax highlighting
- Automatic slug generation from filename

## 📄 License

Personal portfolio website - © Maks Derylo
