import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="search-bar">
          <input type="text" placeholder="Search in site" />
          <button>🔍</button>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <h2>Books Categories</h2>
        <p>Discover our top picks</p>
        <div className="category-list">
          <Link to="/library" className="book-card">
            <img src="http://www.nikhef.nl/~i93/img/universe_original.jpg" alt="Astrophysics" />
            <p><strong>Physics & Astronomy</strong><br />Stephen Hawking</p>
          </Link>
          <Link to="/library" className="book-card">
            <img src="https://www.degruyter.com/document/cover/isbn/9783110516142/product_pages" alt="Number Theory" />
            <p><strong>Algebra & Number Theory</strong><br />Leonhard Euler</p>
          </Link>
          <Link to="/library" className="book-card">
            <img src="https://connectjaya.com/wp-content/uploads/2020/08/cropped-AdobeStock_20-1.jpg" alt="AI Book" />
            <p><strong>Artificial Intelligence</strong><br />Judea Pearl</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
