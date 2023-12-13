// ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem('token'); // Replace with your actual authentication logic

  if (!isAuthenticated) {
    // Redirect to the login page and remember the current location
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the component
  return <Component {...rest} />;
};

export default ProtectedRoute;
