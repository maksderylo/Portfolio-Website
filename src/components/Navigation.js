import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  return (
    <header className='simple-nav'>
      <nav>
        <ul className='nav-links'>
          <li><Link className={location.pathname === '/' ? 'active' : ''} to='/'>Home</Link></li>
          <li><Link className={location.pathname.startsWith('/blog') ? 'active' : ''} to='/blog'>Blog</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;