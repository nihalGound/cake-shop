import React from 'react';
import { Link } from 'react-router-dom';
import './PageNotFound.css'; // Import the CSS file for styles

const PageNotFound = () => {
  return (
    <div className="pageNotFoundContainer">
      <h1 className="errorTitle">404</h1>
      <p className="errorMessage">Oops! The page you're looking for isn't here.</p>
      <Link to="/" className="homeLink">
        Go Home
      </Link>
    </div>
  );
}

export default PageNotFound;
